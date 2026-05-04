import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await fetch('/api/orders');
  return response.json();
});

export const confirmOrder = createAsyncThunk('orders/confirmOrder', async (id: string, { rejectWithValue }) => {
  const response = await fetch(`/api/orders/${id}/confirm`, { method: 'PATCH' });
  const data = await response.json();
  if (!response.ok) return rejectWithValue(data.message);
  return id;
});

export const cancelOrder = createAsyncThunk('orders/cancelOrder', async (id: string, { rejectWithValue }) => {
  const response = await fetch(`/api/orders/${id}/cancel`, { method: 'PATCH' });
  const data = await response.json();
  if (!response.ok) return rejectWithValue(data.message);
  return id;
});

export const bulkConfirmOrders = createAsyncThunk('orders/bulkConfirm', async (ids: string[]) => {
  const response = await fetch('/api/orders/bulk-confirm', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  return response.json();
});

export const bulkCancelOrders = createAsyncThunk('orders/bulkCancel', async (ids: string[]) => {
  const response = await fetch('/api/orders/bulk-cancel', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  return response.json();
});

interface OrderState {
  items: any[];
  status: 'idle' | 'loading' | 'failed';
  selectedIds: string[];
}

const initialState: OrderState = { 
  items: [], 
  status: 'idle', 
  selectedIds: [] 
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    toggleSelection: (state, action: { payload: string }) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(i => i !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
    selectAll: (state, action: { payload: boolean }) => {
      state.selectedIds = action.payload ? state.items.map(o => o.id) : [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        const order = state.items.find(o => o.id === action.payload);
        if (order) order.statut = 'CONFIRMEE';
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const order = state.items.find(o => o.id === action.payload);
        if (order) order.statut = 'ANNULEE';
      })
      .addCase(bulkConfirmOrders.fulfilled, (state, action) => {
        const ids = action.meta.arg as string[];
        state.items.forEach(order => {
          if (ids.includes(order.id) && order.statut === 'EN_ATTENTE') {
            order.statut = 'CONFIRMEE';
          }
        });
        state.selectedIds = [];
      })
      .addCase(bulkCancelOrders.fulfilled, (state, action) => {
        const ids = action.meta.arg as string[];
        state.items.forEach(order => {
          if (ids.includes(order.id) && order.statut === 'EN_ATTENTE') {
            order.statut = 'ANNULEE';
          }
        });
        state.selectedIds = [];
      });
  },
});

export const { toggleSelection, clearSelection, selectAll } = ordersSlice.actions;
export default ordersSlice.reducer;

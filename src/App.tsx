import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import TestConnection from "./pages/TestConnection.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Products from "./pages/admin/Products.tsx";
import Orders from "./pages/admin/Orders.tsx";
import { AdminLayout } from "./components/admin/AdminLayout.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ShopProvider>
        <Toaster position="top-right" />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/test" element={<TestConnection />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ShopProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

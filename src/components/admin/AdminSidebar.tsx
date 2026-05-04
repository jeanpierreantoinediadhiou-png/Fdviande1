import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Beef
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Produits", path: "/admin/products" },
  { icon: ShoppingCart, label: "Commandes", path: "/admin/orders" },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-950 text-white border-r border-zinc-800 hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
          <Beef className="h-6 w-6 text-white" />
        </div>
        <span className="font-bold text-xl">Admin Panel</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-primary text-white" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/auth';
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

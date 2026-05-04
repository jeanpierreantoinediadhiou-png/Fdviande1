import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export const AdminNavbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input 
          placeholder="Rechercher..." 
          className="pl-10 bg-zinc-50 dark:bg-zinc-900 border-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-400 hover:text-primary transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
          <div className="text-right">
            <p className="text-sm font-semibold">{user.nom || 'Admin'}</p>
            <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            {user.nom?.[0] || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

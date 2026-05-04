import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <AdminSidebar />
      <div className="md:ml-64 min-h-screen flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const connected = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY),
  );
  return (
    <div className="admin-body">
      <div className="admin-shell">
        <AdminSidebar />
        <div className="admin-main">
          <AdminTopbar connected={connected} />
          {children}
        </div>
      </div>
    </div>
  );
}

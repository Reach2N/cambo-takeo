import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen bg-cream">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-sm border-b border-warm-border px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="lg:hidden w-8" /> {/* Spacer for mobile hamburger */}
          <div className="text-sm text-warm-muted">
            {new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-xs font-semibold text-gold-dark">
              A
            </div>
            <span className="text-sm text-warm-dark font-medium hidden sm:inline">Admin</span>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

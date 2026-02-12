"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Calendar,
  Ticket,
  DollarSign,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const navConfig = [
  { href: "/admin", icon: LayoutDashboard, key: "admin.dashboard" as const },
  { href: "/admin/movies", icon: Film, key: "admin.movies" as const },
  { href: "/admin/showtimes", icon: Calendar, key: "admin.showtimes" as const },
  { href: "/admin/bookings", icon: Ticket, key: "admin.bookings" as const },
  { href: "/admin/revenue", icon: DollarSign, key: "admin.revenue" as const },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  const navItems = navConfig.map((item) => ({ ...item, label: t(item.key) }));

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/cambo-cinema.jpg"
            alt="Cambo Cinema"
            width={24}
            height={24}
            className="w-6 h-6 rounded-md object-cover"
          />
          <div className="leading-tight">
            <span className="font-[family-name:var(--font-display)] text-sm font-bold text-sidebar-foreground">
              Cambo Cinema
            </span>
            <span className="text-[9px] text-sidebar-foreground/50 block">{t("admin.panel")}</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive(item.href)
              ? "bg-sidebar-primary/20 text-sidebar-primary font-medium"
              : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
          >
            <item.icon className="w-4.5 h-4.5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Back to site */}
      <div className="p-3 border-t border-sidebar-border">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/50 hover:text-sidebar-primary transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {t("admin.backToSite")}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar text-sidebar-foreground rounded-lg shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-sidebar h-screen sticky top-0 border-r border-sidebar-border shrink-0 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-56 bg-sidebar z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

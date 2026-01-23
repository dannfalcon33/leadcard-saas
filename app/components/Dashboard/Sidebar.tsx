"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BarChart2,
  Users,
  FileEdit,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

const menuItems = [
  { name: "Inicio", icon: Home, href: "/dashboard" },
  { name: "Métricas", icon: BarChart2, href: "/dashboard/metrics" },
  { name: "Leads", icon: Users, href: "/dashboard/leads" },
  { name: "Editar Landing Page", icon: FileEdit, href: "/dashboard/editor" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-md text-white md:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 bg-[#0B0E14] border-r border-gray-800 transition-all duration-300 md:h-screen flex flex-col",
          isCollapsed ? "w-20" : "w-64",
          // Mobile responsive logic
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header (Logo/User) */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-10 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Image
                src="/logo-icon.png"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-white font-medium truncate">
                  LeadCard
                </span>
                <span className="text-gray-500 text-xs truncate">
                  Panel de Control
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group relative",
                  isActive
                    ? "bg-blue-600/10 text-blue-500"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "shrink-0",
                    isActive
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-white",
                  )}
                />
                {!isCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800/50 space-y-2">
          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors",
              isCollapsed && "justify-center",
            )}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium whitespace-nowrap">
                Cerrar Sesión
              </span>
            )}
          </button>

          <button
            onClick={toggleSidebar}
            className="hidden md:flex w-full items-center justify-center p-2 text-gray-500 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[#000000] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full md:p-8 p-4">
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}

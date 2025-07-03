import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-border/40 hidden md:block">
        <MainNav />
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-border/40 flex items-center justify-end px-6">
          <UserNav />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

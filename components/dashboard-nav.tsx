"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Projects", href: "/projects" },
  { label: "Community", href: "https://discord.gg/6XEZDwCDSk", target: "_blank" },
  { label: "Pricing", href: "/billing" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1000] h-16 border-b"
      style={{
        background: "rgba(15, 22, 25, 0.5)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(151, 255, 239, 0.1)",
      }}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-10">
        <div className="flex items-center gap-8">
          <Link href="/dashboardv2" className="flex items-center gap-2">
            <Image
              src="/landing-page/header-image-main.png"
              alt="Dravmo Logo"
              width={100}
              height={60}
              className="rounded-md"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.target}
                  className={cn(
                    "text-sm font-medium transition-colors font-quantico",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
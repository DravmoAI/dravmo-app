"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Home, Upload, LayoutGrid, User, LogOut, CreditCard } from "lucide-react";

const navItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Upload",
    href: "/upload",
    icon: Upload,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: LayoutGrid,
  },
  //   {
  //     name: "Billing",
  //     href: "/billing",
  //     icon: CreditCard,
  //   },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 p-4">
      <div className="flex justify-center items-center gap-2 px-2 py-1.5">
        <Image
          width={32}
          height={32}
          src="/logo.png"
          alt="Dravmo Logo"
          className="h-[80%] w-[80%] rounded-full flex items-center justify-center"
        />
      </div>

      <div className="space-y-1 py-4 font-quantico">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              pathname === item.href
                ? "bg-secondary text-primary"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="mt-auto space-y-1 font-quantico">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            pathname === "/profile"
              ? "bg-secondary text-primary"
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          )}
        >
          <User className="h-4 w-4" />
          Profile
        </Link>
        <Link
          href="/logout"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Link>
      </div>
    </nav>
  );
}

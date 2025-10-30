"use client";

import Image from "next/image";
import PillNav, { PillNavItem } from "./PillNav";

export function Navigation() {
  const navItems: PillNavItem[] = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Community",
      href: "https://discord.gg/6XEZDwCDSk",
      target: "_blank",
    },
    {
      label: "Features",
      href: "#features",
    },
    {
      label: "Plans",
      href: "#plans",
    },
  ];

  return (
    <>
      <PillNav
        logo="/dravmo-logo.png"
        logoAlt="Dravmo"
        items={navItems}
        className="hidden lg:flex"
      />
    </>
  );
}

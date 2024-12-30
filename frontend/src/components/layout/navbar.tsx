"use client";

import Link from "next/link";
import { ToggleTheme } from "./toggle-theme";
import { NavigationLinks } from "./navigation-links";
import { MobileNav } from "./mobile-nav";

export const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:py-2">
      <nav className="mx-auto flex h-14 max-w-screen-xl items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">BetterIDN</span>
        </Link>

        <div className="flex-1 flex justify-center items-center">
          <NavigationLinks
            className="hidden md:flex md:gap-6"
            itemClassName="text-sm font-medium"
          />
        </div>

        <ToggleTheme />

        <MobileNav />
      </nav>
    </header>
  );
}

"use client";

import Link from "next/link";
import { ToggleTheme } from "./toggle-theme";
import { NavigationLinks } from "./navigation-links";
import { Button } from "@/components/ui/button";
import { Menu, UserCircle2, PenLine } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        {/* Left section - Logo and Nav Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="text-lg font-semibold">BetterIDN</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationLinks
            className="hidden md:flex md:gap-6"
            itemClassName="text-sm font-medium"
          />
        </div>

        {/* Right section - Auth buttons and Theme toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:gap-2">
            <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>

          <ToggleTheme />

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Access navigation links and authentication options
              </SheetDescription>
              <div className="flex flex-col">
                {/* Auth Section */}
                <div className="border-b pb-4">
                  <Link 
                    href="/sign-in"
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    <UserCircle2 className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link 
                    href="/sign-up"
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <PenLine className="h-4 w-4" />
                    Sign Up
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="pt-4">
                  <NavigationLinks
                    className="flex flex-col space-y-1"
                    itemClassName="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

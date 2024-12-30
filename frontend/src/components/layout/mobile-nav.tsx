"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavigationLinks } from "./navigation-links";


export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full">
        <SheetTitle>Navigation Menu</SheetTitle>
        <div className="flex flex-col space-y-4 pt-4">
          <NavigationLinks
            className="flex flex-col space-y-4 text-center mt-4"
            itemClassName="text-lg font-medium border-b pb-2"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

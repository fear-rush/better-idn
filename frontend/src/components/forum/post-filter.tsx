"use client";

import { Button } from "@/components/ui/button";
import { Flame, Clock, TrendingUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function PostFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "trending";

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", filter);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={currentFilter === "trending" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleFilterChange("trending")}
      >
        <Flame className="mr-2 h-4 w-4" />
        Trending
      </Button>
      <Button
        variant={currentFilter === "new" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleFilterChange("new")}
      >
        <Clock className="mr-2 h-4 w-4" />
        New
      </Button>
      <Button
        variant={currentFilter === "top" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleFilterChange("top")}
      >
        <TrendingUp className="mr-2 h-4 w-4" />
        Top
      </Button>
    </div>
  );
} 
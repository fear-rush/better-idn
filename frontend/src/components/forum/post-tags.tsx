"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const tags = [
  "All",
  "Politics",
  "Science",
  "Healthcare",
  "Environment",
  "Education",
  "Technology",
  "Economy",
] as const;

export function PostTags() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag") || "All";

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    if (tag === "All") {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Categories</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={currentTag === tag ? "default" : "secondary"}
              className={cn(
                "cursor-pointer transition-colors",
                currentTag === tag
                  ? "hover:bg-primary/80"
                  : "hover:bg-secondary/80"
              )}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowBigUp, MessageSquare } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";

interface PostCardProps {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  commentCount: number;
  tags: string[];
  createdAt: Date;
}

export function PostCard({
  id,
  title,
  description,
  upvotes,
  commentCount,
  tags,
  createdAt,
}: PostCardProps) {
  return (
    <Link href={`/forum/${slugify(title)}`}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader className="space-y-2">
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ArrowBigUp className="h-4 w-4" />
              <span>{upvotes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{commentCount}</span>
            </div>
            <div>
              {new Date(createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 
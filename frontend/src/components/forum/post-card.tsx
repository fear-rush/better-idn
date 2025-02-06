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
    <Link 
      href={`/forum/${slugify(title)}`}
      aria-label={`View post: ${title}`}
    >
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader className="space-y-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <div 
            className="flex gap-2 flex-wrap"
            role="list"
            aria-label="Post categories"
          >
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary"
                role="listitem"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="flex items-center gap-4 text-sm text-muted-foreground"
            role="group"
            aria-label="Post statistics"
          >
            <div 
              className="flex items-center gap-1"
              role="status"
              aria-label="Upvotes"
            >
              <ArrowBigUp className="h-4 w-4" aria-hidden="true" />
              <span>{upvotes}</span>
            </div>
            <div 
              className="flex items-center gap-1"
              role="status"
              aria-label="Comments"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              <span>{commentCount}</span>
            </div>
            <div role="status" aria-label="Post date">
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
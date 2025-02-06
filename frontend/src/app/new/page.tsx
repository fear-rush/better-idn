import { Metadata } from "next";
import { NewPostForm } from "@/components/forum/new-post-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create New Post - BetterIDN",
  description: "Share your ideas and suggestions for improving Indonesian policies",
};

export default function NewPostPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-16 md:pt-24">
      <div className="w-full max-w-3xl px-4">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Create New Post</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your ideas and suggestions for improving Indonesian policies. Be clear, constructive, and specific.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <NewPostForm />
        </div>
      </div>
    </main>
  );
} 
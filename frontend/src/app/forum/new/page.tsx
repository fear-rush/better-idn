"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@/lib/schemas/post";
import type { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

type FormData = z.infer<typeof createPostSchema>;

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // TODO: Implement API call to create post
      console.log("Form data:", data);
      
      toast({
        title: "Post created successfully!",
        description: "Your post has been published to the forum.",
      });
      
      router.push("/forum");
    } catch (error) {
      toast({
        title: "Error creating post",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-3xl space-y-8 p-4 pt-24 md:p-6 md:pt-24">
        {/* Back button */}
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/forum" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Forum
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Create New Post</h1>
            <p className="mt-2 text-muted-foreground">
              Share your ideas and proposals for better Indonesian policies. Be clear,
              concise, and constructive.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a clear, descriptive title"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Make it specific and memorable (50-100 characters recommended)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain your proposal in detail..."
                            className="min-h-[200px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Include the problem, your proposed solution, and expected benefits
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Economy, Technology, Politics..."
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Add up to 3 relevant tags, separated by commas
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit button */}
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/forum")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Publishing..." : "Publish Post"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
} 
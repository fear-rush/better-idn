"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";

const tags = [
  "Economy",
  "Politics",
  "Technology",
  "Education",
  "Healthcare",
  "Environment",
  "Infrastructure",
  "Social",
] as const;

const newPostSchema = z.object({
  title: z
    .string()
    .min(10, {
      message: "Title must be at least 10 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
  description: z
    .string()
    .min(100, {
      message: "Description must be at least 100 characters.",
    })
    .max(4000, {
      message: "Description must not be longer than 4000 characters.",
    }),
  tag: z.enum(tags, {
    required_error: "Please select a category for your post.",
  }),
});

type NewPostValues = z.infer<typeof newPostSchema>;

export function NewPostForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<NewPostValues>({
    resolver: zodResolver(newPostSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(data: NewPostValues) {
    startTransition(async () => {
      try {
        // TODO: Add your post creation API call here
        console.log("New post data:", data);
        
        // Redirect to home page on success
        router.push("/");
        router.refresh();
      } catch (error) {
        // Handle error appropriately
        console.error("Post creation error:", error);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a clear and specific title for your suggestion"
                  className="h-12"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Make it clear and compelling. This is what others will see first.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain your suggestion in detail. Include the problem, your proposed solution, and expected benefits."
                  className="min-h-[200px] resize-y p-4"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Be specific and constructive. Explain the what, why, and how of your suggestion.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Category</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the most relevant category for your suggestion.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Post
          </Button>
        </div>
      </form>
    </Form>
  );
} 
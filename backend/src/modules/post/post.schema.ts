import { z } from "zod";

export const createPostSchema = {
  tags: ["post"],
  summary: "Create a new post",
  body: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    categories: z.array(z.string({ message: "Categories is required" })),
  }),
  response: {
    200: z.object({
      message: z.string().default("Post created successfully"),
      data: z.object({
        id: z.string().uuid(),
      }),
    }),
  },
};

export const updatePostSchema = {
  tags: ["post"],
  summary: "Update an existing post",
  body: z.object({
    title: z
      .string()
      .min(1, { message: "Empty title is not allowed" })
      .optional(),
    content: z
      .string()
      .min(1, { message: "Empty content is not allowed" })
      .optional(),
    categories: z
      .array(z.string())
      .optional()
      .refine((categories) => !categories || categories.length > 0, {
        message: "Categories can't be empty if provided",
      }),
  }),
  response: {
    200: z.object({
      message: z.string().default("Post updated successfully"),
      data: z.object({
        id: z.string().uuid(),
      }),
    }),
  },
};

export const voteOnPostSchema = {
  tags: ["post"],
  summary: "Vote on a post",
  body: z.object({
    voteType: z
      .union([z.literal(1), z.literal(-1)])
      .refine((value) => value === 1 || value === -1, {
        message: "voteType must be either 1 (upvote) or -1 (downvote)",
      }),
  }),
  response: {
    200: z.object({
      message: z.string().default("Vote recorded successfully"),
    }),
  },
};

export const getPostByIdSchema = {
  tags: ["post"],
  summary: "Fetch a post by ID",
  params: z.object({
    postId: z.string().uuid({ message: "Invalid UUID" }),
  }),
  response: {
    200: z.object({
      message: z.string().default("Posts retrieved successfully"),
      data: z.object({
        id: z.string().uuid(),
        title: z.string(),
        content: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        categories: z.array(z.string()),
        user: z.object({
          id: z.string(),
          username: z.string(),
        }),
        voteCounts: z.object({
          upvotes: z.number(),
          downvotes: z.number(),
        }),
      }),
    }),
  },
};

export const getAllPostsSchema = {
  tags: ["post"],
  summary: "Fetch all posts",
  response: {
    200: z.object({
      message: z.string().default("Posts retrieved successfully"),
      data: z.array(
        z.object({
          id: z.string().uuid(),
          title: z.string(),
          content: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
          categories: z.array(z.string()),
          user: z.object({
            id: z.string().uuid(),
            username: z.string(),
          }),
          voteCounts: z.object({
            upvotes: z.number(),
            downvotes: z.number(),
          }),
        })
      ),
    }),
  },
};

export const getPostsByUserIdSchema = {
  tags: ["post"],
  summary: "Fetch posts by user ID",
  params: z.object({
    userId: z.string().uuid({ message: "Invalid UUID" }),
  }),
  response: {
    200: z.object({
      message: z.string().default("Posts retrieved successfully"),
      data: z.array(
        z.object({
          id: z.string().uuid(),
          title: z.string(),
          content: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
          categories: z.array(z.string()),
          user: z.object({
            id: z.string().uuid(),
            username: z.string(),
          }),
          voteCounts: z.object({
            upvotes: z.number(),
            downvotes: z.number(),
          }),
        })
      ),
    }),
  },
};

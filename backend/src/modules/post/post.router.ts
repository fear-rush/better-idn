import { FastifyInstance } from "fastify";
import {
  createPostHandler,
  getAllPostsHandler,
  getPostByIdHandler,
  updatePostHandler,
  voteOnPostHandler,
  getPostsByUserIdHandler,
} from "./post.controller";
import {
  createPostSchema,
  getAllPostsSchema,
  getPostByIdSchema,
  updatePostSchema,
  voteOnPostSchema,
  getPostsByUserIdSchema,
} from "./post.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export function postRoutes(app: FastifyInstance) {
  // Create a new post
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/posts",
    preHandler: [app.authenticate], // Ensure the user is authenticated
    handler: createPostHandler,
    schema: createPostSchema,
  });

  // Get all posts (with optional pagination)
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/posts",
    handler: getAllPostsHandler,
    schema: getAllPostsSchema,
  });

  // Get a post by ID
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/posts/:postId",
    handler: getPostByIdHandler,
    schema: getPostByIdSchema,
  });

  // Update a post by ID
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/posts/:postId",
    preHandler: [app.authenticate],
    handler: updatePostHandler,
    schema: updatePostSchema,
  });

  // Delete a post by ID
  // app.withTypeProvider<ZodTypeProvider>().route({
  //   method: "DELETE",
  //   url: "/posts/:postId",
  //   preHandler: [app.authenticate], // Ensure the user is authenticated
  //   handler: deletePostHandler,
  //   schema: deletePostSchema,
  // });

  // Vote on a post
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/posts/:postId/vote",
    preHandler: [app.authenticate], // Ensure the user is authenticated
    handler: voteOnPostHandler,
    schema: voteOnPostSchema,
  });

  // Get posts by user ID
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/users/:userId/posts",
    handler: getPostsByUserIdHandler,
    schema: getPostsByUserIdSchema,
  });
}
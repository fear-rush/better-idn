import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  voteOnPost,
  getPostsByUserId,
} from "./post.service";
import { createPostSchema } from "./post.schema";
import { AppError } from "../../utils/custom-error";

// TODO: remove the try catch and follow the user.controller rules

export async function createPostHandler(
  req: FastifyRequest<{ Body: z.infer<typeof createPostSchema.body> }>,
  reply: FastifyReply
) {
  const { title, content, categories } = req.body;
  const userId = req.session.get("user")?.id;

  if (!userId) {
    reply.code(401).send({ message: "Unauthorized: User not logged in" });
    return;
  }

  const newPost = await createPost({ title, content, categories }, userId);

  reply.code(201).send({
    message: "Post created successfully",
    data: newPost,
  });
}

export async function getAllPostsHandler(
  req: FastifyRequest<{
    Querystring: { limit?: number; offset?: number };
  }>,
  reply: FastifyReply
) {
  const { limit = 10, offset = 0 } = req.query;

  const posts = await getAllPosts(limit, offset);
  reply.code(200).send({
    message: "Posts retrieved successfully",
    data: posts,
  });
}

export async function getPostByIdHandler(
  req: FastifyRequest<{ Params: { postId: string } }>,
  reply: FastifyReply
) {
  const { postId } = req.params;

  const post = await getPostById(postId);
  reply.code(200).send({
    message: "Post retrieved successfully",
    data: post,
  });
}

export async function updatePostHandler(
  req: FastifyRequest<{
    Params: { postId: string };
    Body: { title?: string; content?: string; categories?: string[] };
  }>,
  reply: FastifyReply
) {
  const { postId } = req.params;
  const { title, content, categories } = req.body;

  const updatedPost = await updatePost(postId, { title, content }, categories);
  reply.code(200).send({
    message: "Post updated successfully",
    data: updatedPost,
  });
}

// export async function deletePostHandler(
//   req: FastifyRequest<{ Params: { postId: string } }>,
//   reply: FastifyReply
// ) {
//   const { postId } = req.params;

//   try {
//     await deletePost(postId);
//     reply.code(200).send({
//       message: "Post deleted successfully",
//     });
//   } catch (error) {
//     if (error instanceof AppError) {
//       reply.code(error.statusCode).send({ message: error.message });
//     } else {
//       reply.code(500).send({ message: "Internal server error" });
//     }
//   }
// }

export async function voteOnPostHandler(
  req: FastifyRequest<{
    Params: { postId: string };
    Body: { voteType: number };
  }>,
  reply: FastifyReply
) {
  const { postId } = req.params;
  const { voteType } = req.body;
  const userId = req.session.get("user")?.id; // Use optional chaining

  if (!userId) {
    return reply
      .code(401)
      .send({ message: "Unauthorized: User not logged in" });
  }

  await voteOnPost(postId, userId, voteType);
  reply.code(200).send({
    message: "Vote recorded successfully",
  });
}

export async function getPostsByUserIdHandler(
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  const { userId } = req.params;

  const posts = await getPostsByUserId(userId);
  reply.code(200).send({
    message: "Posts retrieved successfully",
    data: posts,
  });
}

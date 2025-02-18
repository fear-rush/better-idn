import z from "zod";
import { db } from "../../db";
import {
  posts,
  categories,
  postsToCategories,
  postVotes,
} from "../../db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { createPostSchema } from "./post.schema";
import { AppError } from "../../utils/custom-error";

import { findUserById } from "../auth/auth.service";
import {
  PostWithCategoriesAndVotes,
  PostQueryResult,
  VoteType,
  Category,
} from "./post.type";

export async function createPost(
  postData: z.infer<typeof createPostSchema.body>,
  userId: string
): Promise<{ id: string }> {
  const { title, content, categories } = postData;
  await validateCategories(categories);

  const newPost = await db
    .insert(posts)
    .values({
      title: title,
      content: content,
      userId: userId,
    })
    .returning({ id: posts.id });

  if (!newPost[0]) {
    throw new AppError("Error creating post", 500);
  }

  const postId = newPost[0].id;

  await insertCategoriesToPost(postId, categories);

  return newPost[0];
}

// TODO: check this cache is working or not. this is just for development only
const categoryCache = new Map<string, Category>();

async function validateCategories(categoryNames: string[]) {
  const uncachedCategoryNames = categoryNames.filter((name) => !categoryCache.has(name));

  if (uncachedCategoryNames.length > 0) {
    const existingCategories = await db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(inArray(categories.name, uncachedCategoryNames));

    existingCategories.forEach((category) => {
      categoryCache.set(category.name, category);
    });
  }

  const invalidCategoryNames = categoryNames.filter((name) => !categoryCache.has(name));

  if (invalidCategoryNames.length > 0) {
    throw new AppError(
      `The following categories do not exist: ${invalidCategoryNames.join(", ")}`,
      400
    );
  }
}

async function insertCategoriesToPost(postId: string, categoryNames: string[]): Promise<void> {
  const categoryIds = await db
    .select({ id: categories.id })
    .from(categories)
    .where(inArray(categories.name, categoryNames));

  const postCategories = categoryIds.map((category) => ({
    postId,
    categoryId: category.id,
  }));

  await db
    .insert(postsToCategories)
    .values(postCategories)
    .onConflictDoNothing();
}

export async function getAllPosts(
  limit: number = 10,
  offset: number = 0
): Promise<PostWithCategoriesAndVotes[]> {
  const allPosts = await db.query.posts.findMany({
    limit,
    offset,
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    with: {
      user: {
        columns: {
          id: true,
          username: true,
        },
      },
      postsToCategories: {
        with: {
          category: {
            columns: {
              name: true,
            },
          },
        },
      },
      votes: {
        columns: {
          voteType: true,
        },
      },
    },
  });

  if (!allPosts) {
    throw new AppError("Error fetching posts", 500);
  }

  return allPosts.map(mapPostWithCategoriesAndVotes);
}

export async function getPostById(
  postId: string
): Promise<PostWithCategoriesAndVotes> {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    with: {
      user: {
        columns: {
          id: true,
          username: true,
        },
      },
      postsToCategories: {
        with: {
          category: true,
        },
      },
      votes: {
        columns: {
          voteType: true,
        },
      },
    },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return mapPostWithCategoriesAndVotes(post);
}

export async function updatePost(
  postId: string,
  updateData: { title?: string; content?: string },
  newCategoryNames?: string[]
): Promise<{ id: string }> {
  const updatedPost = await db
    .update(posts)
    .set({
      title: updateData.title,
      content: updateData.content,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, postId))
    .returning({
      id: posts.id,
      title: posts.title,
      content: posts.content,
    });

  if (!updatedPost[0]) {
    throw new AppError("Post not found", 404);
  }

  if (newCategoryNames) {
    await updatePostCategories(postId, newCategoryNames);
  }

  return { id: postId };
}

export async function updatePostCategories(
  postId: string,
  newCategoryNames: string[]
): Promise<void> {
  await validateCategories(newCategoryNames);

  const existingCategories = await db
    .select({
      categoryId: postsToCategories.categoryId,
      name: categories.name,
    })
    .from(postsToCategories)
    .leftJoin(categories, eq(postsToCategories.categoryId, categories.id))
    .where(eq(postsToCategories.postId, postId));

  const existingCategoryNames = existingCategories
    .map((c) => c.name)
    .filter((name): name is string => name !== null);

  const categoriesToRemove = existingCategories
    .filter((c) => c.name !== null && !newCategoryNames.includes(c.name))
    .map((c) => c.categoryId);

  const categoriesToAdd = newCategoryNames.filter(
    (c) => !existingCategoryNames.includes(c)
  );

  if (categoriesToRemove.length > 0) {
    await db
      .delete(postsToCategories)
      .where(
        and(
          eq(postsToCategories.postId, postId),
          inArray(postsToCategories.categoryId, categoriesToRemove)
        )
      );
  }

  if (categoriesToAdd.length > 0) {
    await insertCategoriesToPost(postId, categoriesToAdd);
  }
}

export async function getPostsByUserId(
  userId: string
): Promise<PostWithCategoriesAndVotes[]> {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const userPosts = await db.query.posts.findMany({
    where: eq(posts.userId, userId),
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    with: {
      user: {
        columns: {
          id: true,
          username: true,
        },
      },
      postsToCategories: {
        with: {
          category: true,
        },
      },
      votes: {
        columns: {
          voteType: true,
        },
      },
    },
  });

  return userPosts.map(mapPostWithCategoriesAndVotes);
}

export async function voteOnPost(
  postId: string,
  userId: string,
  voteType: number
): Promise<void> {
  if (voteType !== VoteType.UPVOTE && voteType !== VoteType.DOWNVOTE) {
    throw new AppError(
      "Invalid vote type. Use 1 for upvote or -1 for downvote.",
      400
    );
  }

  const existingVote = await db.query.postVotes.findFirst({
    where: and(eq(postVotes.postId, postId), eq(postVotes.userId, userId)),
  });

  if (existingVote) {
    await db
      .update(postVotes)
      .set({ voteType })
      .where(and(eq(postVotes.postId, postId), eq(postVotes.userId, userId)));
  } else {
    await db.insert(postVotes).values({
      postId,
      userId,
      voteType,
    });
  }
}

function mapPostWithCategoriesAndVotes(
  post: PostQueryResult
): PostWithCategoriesAndVotes {
  const upvotes = post.votes.filter(
    (vote) => vote.voteType === VoteType.UPVOTE
  ).length;
  const downvotes = post.votes.filter(
    (vote) => vote.voteType === VoteType.DOWNVOTE
  ).length;

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    categories: post.postsToCategories.map(
      (postCategory) => postCategory.category.name
    ),
    user: {
      id: post.user.id,
      username: post.user.username,
    },
    voteCounts: {
      upvotes,
      downvotes,
    },
  };
}
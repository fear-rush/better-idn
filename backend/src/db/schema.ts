import { sql } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  integer,
  text,
  timestamp,
  uuid,
  boolean,
  jsonb,
  check,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isEmailConfirmed: boolean("is_email_confirmed").default(false).notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  preferences: jsonb("preferences"),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  emailConfirmations: many(emailConfirmations),
  postVotes: many(postVotes),
  commentVotes: many(commentVotes),
  loginProviders: many(loginProviders),
}));

export const emailConfirmations = pgTable("email_confirmations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const emailConfirmationsRelations = relations(emailConfirmations, ({ one }) => ({
  user: one(users, {
    fields: [emailConfirmations.userId],
    references: [users.id],
  }),
}));

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  ...timestamps,
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  metadata: one(postMetadata, {
    fields: [posts.id],
    references: [postMetadata.id],
  }),
  votes: many(postVotes),
  postsToCategories: many(postsToCategories),
}));

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  ...timestamps,
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  votes: many(commentVotes),
}));

export const postMetadata = pgTable("post_metadata", {
  id: uuid("id")
    .primaryKey()
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  firstCommentId: uuid("first_comment_id").references(() => comments.id, {
    onDelete: "cascade",
  }),
  lastCommentId: uuid("last_comment_id").references(() => comments.id, {
    onDelete: "cascade",
  }),
  firstCommentAt: timestamp("first_comment_at", { withTimezone: true }),
  lastCommentAt: timestamp("last_comment_at", { withTimezone: true }),
});

export const postMetadataRelations = relations(postMetadata, ({ one }) => ({
  post: one(posts, {
    fields: [postMetadata.id],
    references: [posts.id],
  }),
  firstComment: one(comments, {
    fields: [postMetadata.firstCommentId],
    references: [comments.id],
  }),
  lastComment: one(comments, {
    fields: [postMetadata.lastCommentId],
    references: [comments.id],
  }),
}));

export const postVotes = pgTable(
  "post_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .references(() => posts.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    voteType: integer("vote_type"),
  },
  (table) => [
    {
      checkConstraint: check("vote_check", sql`${table.voteType} IN (-1,1)`), // ensure constraint -1 for downvote and 1 for upvote
    },
  ]
);

export const postVotesRelations = relations(postVotes, ({ one }) => ({
  post: one(posts, {
    fields: [postVotes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postVotes.userId],
    references: [users.id],
  }),
}));

export const commentVotes = pgTable(
  "comment_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    commentId: uuid("comment_id")
      .references(() => comments.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    voteType: integer("vote_type"),
  },
  (table) => [
    {
      checkConstraint: check("vote_check", sql`${table.voteType} IN (-1,1)`), // ensure constraint -1 for downvote and 1 for upvote
    },
  ]
);

export const commentVotesRelations = relations(commentVotes, ({ one }) => ({
  comment: one(comments, {
    fields: [commentVotes.commentId],
    references: [comments.id],
  }),
  user: one(users, {
    fields: [commentVotes.userId],
    references: [users.id],
  }),
}));

export const loginProviders = pgTable("login_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  provider: text("provider").notNull(),
  identifier: text("identifier").notNull(),
  ...timestamps,
});

export const loginProvidersRelations = relations(loginProviders, ({ one }) => ({
  user: one(users, {
    fields: [loginProviders.userId],
    references: [users.id],
  }),
}));

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  postsToCategories: many(postsToCategories),
}));

export const postsToCategories = pgTable(
  "posts_categories",
  {
    postId: uuid("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: uuid("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return [
      {
        pk: primaryKey({ columns: [table.postId, table.categoryId] }),
      },
    ];
  }
);

export const postsToCategoriesRelations = relations(postsToCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postsToCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postsToCategories.categoryId],
    references: [categories.id],
  }),
}));

// TODO: implement notifications table, module, and functions later. because it's a bit complicated

// export const notifications = pgTable("notifications", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   fromUserId: uuid("from_user_id")
//     .references(() => users.id)
//     .notNull(),
//   toUserId: uuid("to_user_id")
//     .references(() => users.id)
//     .notNull(),
//   type: text("type"),
//   data: jsonb("data"),
//   createdAt: timestamp("created_at", { withTimezone: true })
//     .defaultNow()
//     .notNull(),
//   read_at: timestamp("read_at", { withTimezone: true }),
//   is_deleted: boolean("is_deleted").default(false),
// });


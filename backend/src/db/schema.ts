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

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

// TODO: maybe composite key id and username can improve query performance with drizzle prepared statement
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isEmailConfirmed: boolean("is_email_confirmed").default(false).notNull(),
  bio: text("bio"),
  avatar_url: text("avatar_url"),
  preferences: jsonb("preferences"),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  ...timestamps,
});

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

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  ...timestamps,
});

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  post_id: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  ...timestamps,
});

export const post_metadata = pgTable("post_metadata", {
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

export const post_votes = pgTable(
  "post_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    post_id: uuid("post_id")
      .references(() => posts.id)
      .notNull(),
    user_id: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    vote_type: integer("vote_type"),
  },
  (table) => [
    {
      // TODO: check whether this function is run or not
      checkConstraint: check("vote_check", sql`${table.vote_type} IN (-1,1)`), // ensure constraint -1 for downvote and 1 for upvote
    },
  ]
);

export const comment_votes = pgTable(
  "comment_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    comment_id: uuid("comment_id")
      .references(() => comments.id)
      .notNull(),
    user_id: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    vote_type: integer("vote_type"),
  },
  (table) => [
    {
      // TODO: check whether this function is run or not
      checkConstraint: check("vote_check", sql`${table.vote_type} IN (-1,1)`), // ensure constraint -1 for downvote and 1 for upvote
    },
  ]
);

export const login_providers = pgTable("login_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  provider: text("provider").notNull(),
  identifier: text("identifier").notNull(),
  ...timestamps,
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique().notNull(),
});

export const post_tags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .references(() => posts.id)
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id)
      .notNull(),
  },
  (table) => {
    return [
      {
        pk: primaryKey({ columns: [table.postId, table.tagId] }),
      },
    ];
  }
);

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

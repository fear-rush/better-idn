import argon2 from "argon2";
import z from "zod";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { createUserSchema } from "./auth.schema";
import { AppError } from "../../utils/custom-error";
import { User, UserWithPassword } from "../user/user.type";

export async function createUser(
  userData: z.infer<typeof createUserSchema.body>
): Promise<User> {
  const existingUser = await findUserByUsername(userData.username);
  const existingEmail = await findUserByEmail(userData.email);

  if (existingEmail?.email) {
    throw new AppError("User already exists", 400);
  }

  if (existingUser?.username) {
    throw new AppError("User already exists!", 400);
  }

  const hashedPassword = await argon2.hash(userData.password);

  const newUser = await db
    .insert(users)
    .values({
      ...userData,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      username: userData.username,
    })
    .returning({
      id: users.id,
      username: users.username,
    });

  if (!newUser[0]) {
    throw new AppError("Error creating user", 500);
  }

  return newUser[0];
}

// TODO: create user route to find by username
export async function findUserByUsername(
  username: string
): Promise<User | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: {
      id: true,
      username: true,
    },
  });

  return user;
}

export async function findUserById(userId: string): Promise<User | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      username: true,
    },
  });

  return user;
}

export async function findUserByEmail(
  email: string
): Promise<UserWithPassword | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      id: true,
      email: true,
      username: true,
      password: true,
    },
  });

  return user;
}

export async function verifyPassword(
  candidatePassword: string,
  hashedPassword: string
): Promise<void> {
  const isValidPassword = await argon2.verify(
    hashedPassword,
    candidatePassword
  );

  if (!isValidPassword) {
    throw new AppError("Invalid credentials", 401);
  }
}

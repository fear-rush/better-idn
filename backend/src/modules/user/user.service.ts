import argon2 from "argon2";
import z from "zod";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { createUserSchema } from "./user.schema";
import { AppError } from "../../utils/custom-error";

export async function createUser(
  userData: z.infer<typeof createUserSchema.body>
) {
  const hashedPassword = await argon2.hash(userData.password);
  const existingUser = await findUserByUsername(userData.username);
  if (existingUser?.username) {
    throw new AppError("User already exists!", 400);
  }
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
}

async function findUserByUsername(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: {
      username: true,
    },
  });

  return user;
}

export async function findUserById(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      username: true,
    },
  });
  if (!user?.username) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function findUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      id: true,
      username: true,
      password: true,
    },
  });
  if (!user?.username) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function verifyPassword(
  candidatePassword: string,
  hashedPassword: string
) {
  const isValidPassword = await argon2.verify(
    hashedPassword,
    candidatePassword
  );

  if (!isValidPassword) {
    throw new AppError("Invalid credentials", 401);
  }
}

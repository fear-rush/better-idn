import argon2 from "argon2";
import z from "zod";
import { db } from "../../db";
import { generateUsername } from "unique-username-generator";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  createUserSchema,
} from "./user.schema";

export async function createUser(
  userData: z.infer<typeof createUserSchema.body>
) {
  try {
    const hashedPassword = await argon2.hash(userData.password);
    // TODO: check in the database if there is any duplicate name
    const uniqueName = generateUsername("-", 4, 20);

    const newUser = await db
      .insert(users)
      .values({
        ...userData,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        username: uniqueName,
      })
      .returning({
        id: users.id,
        username: users.username,
      });

    return newUser[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage ?? "Error creating user");
  }
}

export async function findUserById(userId: string) {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        username: true,
      },
    });

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage ?? "Error fetching user by id");
  }
}

export async function findUserByEmail(email: string) {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        id: true,
        username: true,
        password: true,
      }
    });

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage ?? "Error fetching user by email");
  }
}

export async function verifyPassword(
  candidatePassword: string,
  hashedPassword: string
) {
  try {
    const isValidPassword = await argon2.verify(
      hashedPassword,
      candidatePassword
    );
    return isValidPassword;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage ?? "Error verifying password");
  }
}

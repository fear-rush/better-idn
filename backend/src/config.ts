import z from "zod";
import fs from "fs";
import path from "path";

const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.local";

const envPath = path.resolve(__dirname, `../${envFile}`);
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, { encoding: "utf-8" });
  envContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=").map((part) => part.trim());
    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  });
} else {
  console.warn(`Environment file not found: ${envPath}`);
}

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  SERVER_PORT: z.coerce.number().default(3000),
  ALLOW_ORIGIN: z.string(),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string(),
  COOKIE_NAME: z.string().default("session"),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
});

export const config = schema.parse(process.env);
export type Config = z.infer<typeof schema>;

console.log(`Loaded environment variables from: ${envFile}`);

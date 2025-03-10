import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().url(),
});

const parsedEnv = envSchema.safeParse({
  API_URL: process.env.NEXT_PUBLIC_API_URL, 
});

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;

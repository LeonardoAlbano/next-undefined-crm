import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});


const serverEnvSchema = clientEnvSchema.extend({
  NEXT_API_URL: z.string().url(),
});

const isClient = typeof window !== "undefined";

function formatErrors(errors: z.ZodFormattedError<Map<string, string>, string>) {
  return Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value) {
        return `${name}: ${value._errors.join(", ")}\n`;
      }
      return null;
    })
    .filter(Boolean);
}

const clientEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

const serverEnv = {
  ...clientEnv,
  NEXT_API_URL: process.env.NEXT_API_URL,
};

const parsed = isClient 
  ? clientEnvSchema.safeParse(clientEnv)
  : serverEnvSchema.safeParse(serverEnv);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(parsed.error.format()),
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
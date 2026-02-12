import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_BASE_URL || process.env.BETTER_AUTH_URL,
  plugins: [],
});

export const { signIn, signUp, useSession } = createAuthClient();

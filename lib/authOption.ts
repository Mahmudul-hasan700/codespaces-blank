import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";

// Function to generate a unique username
async function findUniqueUsername(baseUsername: string): Promise<string> {
  let count = 0;
  let username = generateUsername(baseUsername, count);

  while (true) {
    const result = await pool.query("SELECT 1 FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return username;
    }

    count += 1;
    username = generateUsername(baseUsername, count);
  }
}

function generateUsername(name: string, count: number): string {
  const baseUsername = name.trim().replace(/\s+/g, "").toLowerCase();
  return `${baseUsername}${count}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [credentials.email],
        );

        const user = result.rows[0];

        if (!user || !user.password) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      try {
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [user.email],
        );

        const existingUser = result.rows[0];

        if (existingUser) {
          // Update existing user
          const updateResult = await pool.query(
            "UPDATE users SET name = $1, avatar_url = $2, provider = $3 WHERE id = $4 RETURNING id",
            [
              user.name || existingUser.name,
              user.image || existingUser.avatar_url,
              account?.provider,
              existingUser.id,
            ],
          );
          user.id = updateResult.rows[0].id;
        } else {
          // Create new user
          const baseUsername =
            user.name?.trim().replace(/\s+/g, "").toLowerCase() || "user";
          const username = await findUniqueUsername(baseUsername);

          const newUser = await pool.query(
            "INSERT INTO users (name, email, avatar_url, username, provider) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [user.name, user.email, user.image, username, account?.provider],
          );
          user.id = newUser.rows[0].id;
        }
        return true;
      } catch (error) {
        console.error("Error saving user", error);
        return false;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
  },
};
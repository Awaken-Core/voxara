import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";

export const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.APP_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    databaseHooks: {
        account: {
            create: {
                after: async (account) => {
                    if (account.providerId === "credential" && account.password) {
                        await prisma.user.update({
                            where: { id: account.userId },
                            data: { password: account.password },
                        });
                    }
                },
            },
            update: {
                after: async (account) => {
                    if (account.providerId === "credential" && account.password) {
                        await prisma.user.update({
                            where: { id: account.userId },
                            data: { password: account.password },
                        });
                    }
                },
            },
        },
    },

    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }
    },

    trustedOrigins: [
        env.APP_URL,
    ],
});

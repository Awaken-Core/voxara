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
        user: {
            create: {
                after: async (user) => {
                    await prisma.$transaction(async (tx) => {
                        const crdt = await tx.userCredits.upsert({
                            where: {
                                userId: user.id,
                            },
                            update: {},
                            create: {
                                userId: user.id,
                            },
                        });

                        await tx.creditLog.create({
                            data: {
                                userId: user.id,
                                creditId: crdt.id,
                                creditsOps: "ADDED",
                                credits: crdt.totalCredits,
                                source: `signup:${user.id}`,
                            },
                        });
                    });
                },
            }
        }
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

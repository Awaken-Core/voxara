import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { chatterbox } from "@/lib/chatterbox-client";
import { prisma } from "@/lib/db";
import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { authProcedure, createTRPCRouter } from "../init";
import { uploadAudiofile } from "@/utils/uploadThings-server-functions";

export const generationsRouter = createTRPCRouter({
    getCredits: authProcedure.query(async ({ ctx }) => {
        const [credits, user] = await Promise.all([
            prisma.userCredits.findUnique({
                where: { userId: ctx.userId },
                select: { totalCredits: true },
            }),
            prisma.user.findUniqueOrThrow({
                where: { id: ctx.userId },
                select: { isPremium: true },
            }),
        ]);

        return {
            totalCredits: credits?.totalCredits ?? 0,
            isPremium: user.isPremium,
        };
    }),

    getById: authProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const generation = await prisma.generation.findUnique({
                where: {
                    id: input.id,
                    generatedBy: ctx.userId,
                },
                omit: {
                    r2ObjectKey: true,
                },
            });

            if (!generation) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return {
                ...generation,
                audioUrl: `/api/audio/${generation.id}`,
            };
        }),

    getAll: authProcedure.query(async ({ ctx }) => {
        const generations = await prisma.generation.findMany({
            where: {
                generatedBy: ctx.userId,
            },
            orderBy: { createdAt: "desc" },
            omit: {
                r2ObjectKey: true,
            },
        });

        return generations;
    }),

    create: authProcedure
        .input(
            z.object({
                text: z.string().min(1).max(TEXT_MAX_LENGTH),
                voiceId: z.string().min(1),
                temperature: z.number().min(0).max(2).default(0.8),
                topP: z.number().min(0).max(1).default(0.95),
                topK: z.number().min(1).max(10000).default(1000),
                repetitionPenalty: z.number().min(1).max(2).default(1.2),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const voice = await prisma.voice.findUnique({
                where: {
                    id: input.voiceId,
                    OR: [
                        { variant: "SYSTEM" },
                        {
                            variant: "CUSTOM",
                            userId: ctx.userId,
                        }
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    r2ObjectKey: true,
                },
            });

            if (!voice) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Voice not found",
                });
            }

            if (!voice.r2ObjectKey) {
                throw new TRPCError({
                    code: "PRECONDITION_FAILED",
                    message: "Voice audio not available",
                });
            }

            const generationId = crypto.randomUUID();
            let wasPremium = false;

            try {
                wasPremium = await prisma.$transaction(async (tx) => {
                    const user = await tx.user.findUniqueOrThrow({
                        where: { id: ctx.userId },
                        select: { isPremium: true },
                    });
                    const reserved = await tx.userCredits.updateMany({
                        where: {
                            userId: ctx.userId,
                            totalCredits: { gt: 0 },
                        },
                        data: { totalCredits: { decrement: 1 } },
                    });

                    if (reserved.count !== 1) {
                        throw new TRPCError({
                            code: "FORBIDDEN",
                            message: "You have no credits remaining. Please purchase a plan to continue.",
                        });
                    }

                    const userCredits = await tx.userCredits.findUniqueOrThrow({
                        where: { userId: ctx.userId },
                        select: { id: true, totalCredits: true },
                    });

                    if (userCredits.totalCredits === 0) {
                        await tx.user.update({
                            where: { id: ctx.userId },
                            data: { isPremium: false },
                        });
                    }

                    await tx.generation.create({
                        data: {
                            id: generationId,
                            generatedBy: ctx.userId,
                            text: input.text,
                            voiceName: voice.name,
                            voiceId: voice.id,
                            temperature: input.temperature,
                            topP: input.topP,
                            topK: input.topK,
                            repetitionPenalty: input.repetitionPenalty,
                        },
                    });

                    await tx.creditLog.create({
                        data: {
                            userId: ctx.userId,
                            creditId: userCredits.id,
                            generationId,
                            credits: 1,
                            creditsOps: "REMOVED",
                            source: `generation:${generationId}`,
                        },
                    });

                    return user.isPremium;
                });

                const { data, error } = await chatterbox.POST("/generate", {
                    body: {
                        prompt: input.text,
                        voice_key: voice.r2ObjectKey,
                        temperature: input.temperature,
                        top_p: input.topP,
                        top_k: input.topK,
                        repetition_penalty: input.repetitionPenalty,
                        norm_loudness: true,
                    },
                    parseAs: "arrayBuffer",
                });

                if (error || !(data instanceof ArrayBuffer)) {
                    throw new Error("TTS generation failed");
                }

                const response = await uploadAudiofile(Buffer.from(data));
                const r2ObjectKey = response?.key;
                if (!r2ObjectKey) {
                    throw new Error("Audio upload failed");
                }

                await prisma.generation.update({
                    where: { id: generationId },
                    data: { r2ObjectKey },
                });
            } catch (error) {
                if (error instanceof TRPCError && error.code === "FORBIDDEN") {
                    throw error;
                }

                await prisma.$transaction(async (tx) => {
                    const removed = await tx.generation.deleteMany({
                        where: { id: generationId, generatedBy: ctx.userId },
                    });

                    if (removed.count === 1) {
                        await tx.userCredits.update({
                            where: { userId: ctx.userId },
                            data: { totalCredits: { increment: 1 } },
                        });
                        if (wasPremium) {
                            await tx.user.update({
                                where: { id: ctx.userId },
                                data: { isPremium: true },
                            });
                        }
                    }
                }).catch(() => undefined);

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to generate audio. Your credit was restored.",
                    cause: error,
                });
            }

            return {
                id: generationId,
            };
        }),
});

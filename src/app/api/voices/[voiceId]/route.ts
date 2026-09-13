import { getServerSession } from "@/lib/auth-session";
import { prisma } from "@/lib/db";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ voiceId: string }> },
) {
    const session = await getServerSession(request);

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { voiceId } = await params;

    const voice = await prisma.voice.findUnique({
        where: { id: voiceId },
        select: {
            variant: true,
            userId: true,
            r2ObjectKey: true,
        },
    });

    if (!voice) {
        return new Response("Not found", { status: 404 });
    }

    if (voice.variant === "CUSTOM" && voice.userId !== session.user.id) {
        return new Response("Not found", { status: 404 });
    }

    if (!voice.r2ObjectKey) {
        return new Response("Voice audio is not available yet", { status: 409 });
    }

    const signedUrl = await utapi.getSignedURL(voice.r2ObjectKey, {
        expiresIn: 3600
    });

    const audioResponse = await fetch(signedUrl?.url);

    if (!audioResponse.ok) {
        return new Response("Failed to fetch voice audio", { status: 502 });
    }

    const contentType =
        audioResponse.headers.get("content-type") || "audio/wav";

    return new Response(audioResponse.body, {
        headers: {
            "Content-Type": contentType,
            "Cache-Control":
                voice.variant === "SYSTEM"
                    ? "public, max-age=86400"
                    : "private, max-age=3600",
        },
    });
};

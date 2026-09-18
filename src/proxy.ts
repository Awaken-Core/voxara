import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { apiRateLimit } from "@/lib/rate-limit";

const PUBLIC_PREFIXES = ["/sign-in", "/sign-up", "/api/auth", "/api/webhooks"];
const RATE_LIMIT_EXEMPT_PREFIXES = ["/api/webhooks", "/api/uploadthing"];

function getClientIdentifier(request: NextRequest) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim()
        || request.headers.get("x-real-ip")
        || "127.0.0.1";

    return `ip:${ip}`;
}

function shouldRateLimit(pathname: string) {
    const isApiRequest = pathname === "/api"
        || pathname.startsWith("/api/")
        || pathname === "/trpc"
        || pathname.startsWith("/trpc/");
    const isExempt = RATE_LIMIT_EXEMPT_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

    return isApiRequest && !isExempt;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (shouldRateLimit(pathname)) {
        const result = await apiRateLimit.limit(getClientIdentifier(request));

        if (!result.success) {
            const retryAfterSeconds = Math.max(
                1,
                Math.ceil((result.reset - Date.now()) / 1000),
            );

            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(retryAfterSeconds),
                        "X-RateLimit-Limit": String(result.limit),
                        "X-RateLimit-Remaining": String(result.remaining),
                        "X-RateLimit-Reset": String(result.reset),
                    },
                },
            );
        }
    }

    const isPublic = pathname === "/api/uploadthing" || PUBLIC_PREFIXES.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    );
    const hasSession = Boolean(getSessionCookie(request));

    if (!hasSession && !isPublic) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};

import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PREFIXES = ["/sign-in", "/sign-up", "/api/auth"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
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

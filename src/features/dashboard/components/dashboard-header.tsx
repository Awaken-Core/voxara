"use client";

import { useSession } from "@/lib/auth-client";

export function DashboardHeader() {
    const { data: session, isPending } = useSession();

    return (
        <div className="w-full text-center font-sans text-white">
            <h1 className="mx-auto max-w-4xl text-[clamp(2.25rem,4.2vw,3.5rem)] font-normal leading-[1.02] tracking-[-0.06em]">
                <span>Nice to see you, {isPending ? "..." : (session?.user.name?.split(" ")[0] ?? "there")}.</span>{" "}
                <span>What&apos;s new?</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/55">
                Turn an idea, script, or story into polished speech in seconds.
            </p>
        </div>
    );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { Coins, Crown, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

export function AccountStatusButton({ className }: { className?: string }) {
    const trpc = useTRPC();
    const credits = useQuery(trpc.generations.getCredits.queryOptions());
    const isPremium = credits.data?.isPremium ?? false;
    const totalCredits = credits.data?.totalCredits ?? 0;

    return (
        <Button asChild size="sm" variant="outline" className={cn(
            "group h-9",
            isPremium
                ? "border-amber-400/35 bg-gradient-to-r from-amber-500/15 via-yellow-400/10 to-orange-500/15 text-amber-700 shadow-[0_0_24px_-10px_rgba(245,158,11,0.8)] hover:border-amber-400/60 hover:bg-amber-500/20 dark:text-amber-200"
                : "border-violet-400/30 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 hover:border-violet-400/55 hover:bg-violet-500/15",
            className,
        )}>
            <Link href="/pricing" aria-label={`${totalCredits} credits, ${isPremium ? "Premium" : "Free"} account`}>
                {isPremium
                    ? <Crown className="fill-amber-400/25 text-amber-500 transition-transform group-hover:-rotate-6 dark:text-amber-300" />
                    : <Sparkles className="text-violet-500 dark:text-violet-300" />}
                <span className="font-semibold">{credits.isPending ? "—" : isPremium ? "Premium" : "Free"}</span>
                <span className="h-4 w-px bg-current opacity-20" />
                <Coins className="size-3.5 opacity-80" />
                <span className="tabular-nums">{credits.isPending ? "—" : totalCredits}</span>
                <span className="hidden text-xs opacity-65 sm:inline">credits</span>
            </Link>
        </Button>
    );
}

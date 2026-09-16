"use client";

import { Headphones, ThumbsUp } from "lucide-react";
import Link from "next/link";

import { AccountStatusButton } from "@/components/account-status-button";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { ModeToggle } from "@/theme-toggle";

export function DashboardHeader() {
    const { data: session, isPending } = useSession();

    return (
        <div className="flex items-start justify-between font-sans">
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nice to see you</p>
                <h1 className="text-2xl font-semibold tracking-[-0.8px] text-foreground lg:text-3xl">
                    {isPending ? "..." : (session?.user.name ?? "there")}
                </h1>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
                <AccountStatusButton className="hidden lg:inline-flex" />
                <span className="hidden lg:inline-flex"><ModeToggle /></span>
                <Button variant="outline" size="sm" className="hidden lg:inline-flex" asChild>
                    <Link href="mailto:mehulprajapati7456e@gmail.com">
                        <ThumbsUp />
                        <span>Feedback</span>
                    </Link>
                </Button>
                <Button variant="outline" size="sm" className="hidden lg:inline-flex" asChild>
                    <Link href="mailto:mehulprajapati7456e@gmail.com">
                        <Headphones />
                        <span>Need help?</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}

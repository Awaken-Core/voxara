"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";
import { GoogleLogo } from "./google-logo";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isSignUp = mode === "sign-up";

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsPending(true);
        setError(null);

        const form = new FormData(event.currentTarget);
        const email = String(form.get("email"));
        const password = String(form.get("password"));

        try {
            const result = isSignUp
                ? await signUp.email({
                    name: String(form.get("name")),
                    email,
                    password,
                    callbackURL: "/",
                })
                : await signIn.email({ email, password, callbackURL: "/" });

            if (result.error) {
                setError(result.error.message ?? "Authentication failed. Please try again.");
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setError("Could not reach the authentication service. Please try again.");
        } finally {
            setIsPending(false);
        }
    }

    async function handleGoogleSignIn() {
        setIsPending(true);
        setError(null);
        try {
            const result = await signIn.social({ provider: "google", callbackURL: "/" });
            if (result.error) {
                setError(result.error.message ?? "Could not continue with Google.");
            }
        } catch {
            setError("Could not reach the authentication service. Please try again.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {isSignUp ? "Create your account" : "Welcome back"}
                </h2>
                <p className="text-sm text-white/60">
                    {isSignUp ? "Start creating voices in a few seconds." : "Sign in to continue to Voxara."}
                </p>
            </div>

            <Button type="button" variant="outline" className="w-full" disabled={isPending} onClick={handleGoogleSignIn}>
                <GoogleLogo width={20} height={20} /> <span>Continue with Google</span>
            </Button>

            <div className="flex items-center gap-3 text-xs text-white/40">
                <span className="h-px flex-1 bg-white/10" />
                OR
                <span className="h-px flex-1 bg-white/10" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {isSignUp && (
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" autoComplete="name" required disabled={isPending} />
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" autoComplete="email" required disabled={isPending} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        minLength={8}
                        required
                        disabled={isPending}
                    />
                </div>
                {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                <Button className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="animate-spin" />}
                    {isSignUp ? "Create account" : "Sign in"}
                </Button>
            </form>

            <p className="text-center text-sm text-white/60">
                {isSignUp ? "Already have an account?" : "New to Voxara?"}{" "}
                <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="text-white underline underline-offset-4">
                    {isSignUp ? "Sign in" : "Create an account"}
                </Link>
            </p>
        </div>
    );
}

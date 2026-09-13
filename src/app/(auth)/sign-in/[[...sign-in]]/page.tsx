import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignInPage() {
    return (
        <AuthShell headline="Turn your words into voices worth hearing.">
            <AuthForm mode="sign-in" />
        </AuthShell>
    );
}

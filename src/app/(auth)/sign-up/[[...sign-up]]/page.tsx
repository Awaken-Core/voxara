import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignUpPage() {
    return (
        <AuthShell headline="Your next great voice starts here.">
            <AuthForm mode="sign-up" />
        </AuthShell>
    );
}

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-[70dvh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <CheckCircle2 className="mx-auto size-10" />
        <h1 className="mt-5 text-2xl">Payment received</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Your plan will update as soon as Dodo Payments confirms the subscription. This usually takes a few seconds.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild><Link href="/pricing">View plan</Link></Button>
          <Button variant="outline" asChild><Link href="/">Go to dashboard</Link></Button>
        </div>
      </div>
    </main>
  );
}

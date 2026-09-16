"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { useTRPC } from "@/trpc/client";

export function PricingView() {
  const trpc = useTRPC();
  const plans = useQuery(trpc.subscriptions.getPlans.queryOptions());
  const checkout = useMutation(
    trpc.subscriptions.createCheckout.mutationOptions({
      onSuccess: ({ checkoutUrl }) => window.location.assign(checkoutUrl),
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <div className="min-h-full">
      <PageHeader title="Pricing" />
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary">Simple pricing</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Buy credits when you need them</h1>
          <p className="mt-3 text-muted-foreground">You currently have {plans.data?.totalCredits ?? 0} credits. Purchased credits are added to your balance.</p>
        </div>

        {plans.isPending ? (
          <div className="flex min-h-80 items-center justify-center"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
        ) : plans.isError ? (
          <div className="mx-auto mt-10 max-w-md rounded-xl border border-destructive/30 p-6 text-center">
            <p className="text-sm text-destructive">Could not load pricing.</p>
            <Button variant="outline" className="mt-4" onClick={() => plans.refetch()}>Try again</Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {plans.data.plans.map((plan) => {
              const isCheckingOut = checkout.isPending && checkout.variables?.pricingId === plan.id;
              return (
                <article key={plan.id} className="relative flex min-h-96 flex-col rounded-xl border bg-card p-6">
                  <h2 className="text-xl font-semibold">{plan.credits} credits</h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">Generate up to {plan.credits} audio clips.</p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="text-4xl font-semibold tracking-tight">{plan.currency === "USD" ? "$" : `${plan.currency} `}{plan.price}</span>
                    <span className="pb-1 text-sm text-muted-foreground">one time</span>
                  </div>
                  <ul className="mt-7 mb-4 space-y-3">
                    {plan.benefits.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm"><Check className="size-4" />{feature}</li>)}
                  </ul>
                  <Button
                    className="mt-auto w-full"
                    variant="outline"
                    disabled={checkout.isPending}
                    onClick={() => checkout.mutate({ pricingId: plan.id })}
                  >
                    {isCheckingOut && <Loader2 className="animate-spin" />}
                    Buy {plan.credits} credits
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

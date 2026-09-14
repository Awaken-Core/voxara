"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const descriptions = {
  FREE: "Explore Voxara and start creating.",
  PREMIUM: "For creators producing regularly.",
  PRO: "For teams and demanding workflows.",
} as const;

const planRank = { FREE: 0, PREMIUM: 1, PRO: 2 } as const;

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
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Choose the plan that fits your voice</h1>
          <p className="mt-3 text-muted-foreground">Start free and upgrade whenever you need more generations and professional tools.</p>
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
              const isCurrent = plans.data.currentPlanId === plan.id;
              const currentPlan = plans.data.plans.find((item) => item.id === plans.data.currentPlanId);
              const isLowerTier = currentPlan
                ? planRank[plan.planType] < planRank[currentPlan.planType]
                : false;
              const isFeatured = plan.planType === "PREMIUM";
              const isCheckingOut = checkout.isPending && checkout.variables?.planId === plan.id;
              return (
                <article key={plan.id} className={cn("relative flex min-h-96 flex-col rounded-xl border bg-card p-6", isFeatured && !isCurrent && "border-foreground/40")}>
                  {isCurrent && <Badge className="absolute right-5 top-5">Current plan</Badge>}
                  {!isCurrent && isFeatured && <Badge variant="outline" className="absolute right-5 top-5">Popular</Badge>}
                  <h2 className="text-xl font-semibold capitalize">{plan.planType.toLowerCase()}</h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{descriptions[plan.planType]}</p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="text-4xl font-semibold tracking-tight">${plan.price}</span>
                    <span className="pb-1 text-sm text-muted-foreground">/ {plan.totalDuration} days</span>
                  </div>
                  <ul className="mt-7 mb-4 space-y-3">
                    {plan.benefits.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm"><Check className="size-4" />{feature}</li>)}
                    {plan.nonBenefits.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground"><X className="size-4" />{feature}</li>)}
                  </ul>
                  <Button
                    className="mt-auto w-full"
                    variant={isFeatured ? "default" : "outline"}
                    disabled={isCurrent || isLowerTier || plan.planType === "FREE" || !plan.canCheckout || checkout.isPending}
                    onClick={() => checkout.mutate({ planId: plan.id })}
                  >
                    {isCheckingOut && <Loader2 className="animate-spin" />}
                    {isCurrent ? "Current plan" : isLowerTier ? `Included in ${currentPlan?.planType.toLowerCase()}` : !plan.canCheckout && plan.planType !== "FREE" ? "Not configured" : `Purchase ${plan.planType.toLowerCase()}`}
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

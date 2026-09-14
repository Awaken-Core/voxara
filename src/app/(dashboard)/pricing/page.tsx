import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

const plans = [
  {
    name: "Free",
    description: "Explore Voxara and start creating.",
    price: "$0",
    features: ["Core text to speech", "Starter voice library", "Personal workspace"],
    action: "Current plan",
  },
  {
    name: "Premium",
    description: "For creators producing regularly.",
    price: "$19",
    features: ["More monthly generations", "Custom voice cloning", "Commercial usage"],
    action: "Upgrade to Premium",
    featured: true,
  },
  {
    name: "Pro",
    description: "For teams and demanding workflows.",
    price: "$49",
    features: ["Highest usage limits", "Priority processing", "Priority support"],
    action: "Upgrade to Pro",
  },
] as const;

export default function PricingPage() {
  return (
    <div className="min-h-full">
      <PageHeader title="Pricing" />
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary">Simple pricing</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Choose the plan that fits your voice</h1>
          <p className="mt-3 text-muted-foreground">Start free and upgrade whenever you need more generations and professional tools.</p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className={`relative flex min-h-96 flex-col rounded-2xl border bg-card p-6 shadow-sm ${"featured" in plan ? "border-violet-500 ring-1 ring-violet-500" : ""}`}>
              {"featured" in plan && <Badge className="absolute right-5 top-5 bg-violet-600 text-white">Popular</Badge>}
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
              <div className="mt-5 flex items-end gap-1"><span className="text-4xl font-semibold tracking-tight">{plan.price}</span><span className="pb-1 text-sm text-muted-foreground">/ month</span></div>
              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm"><Check className="size-4 text-violet-500" />{feature}</li>)}
              </ul>
              <Button className="mt-auto w-full" variant={plan.name === "Free" ? "outline" : "default"} disabled={plan.name === "Free"}>{plan.action}</Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

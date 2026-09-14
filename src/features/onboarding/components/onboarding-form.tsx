"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Headphones,
  Loader2,
  Mic2,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const useCases = [
  { value: "PERSONAL", label: "Personal projects", icon: UserRound },
  { value: "OFFICE", label: "Work or business", icon: BriefcaseBusiness },
  { value: "STUDENT", label: "School or learning", icon: GraduationCap },
  { value: "FREELANCE", label: "Freelance work", icon: UsersRound },
  { value: "OTHERS", label: "Something else", icon: Sparkles },
] as const;

const faqs = [
  ["What can I create with Voxara?", "Turn scripts, articles, lessons, and ideas into natural-sounding speech, or create a custom voice for your projects."],
  ["Can I change these answers later?", "Yes. These answers only help personalize your starting experience and can be updated later."],
  ["What does the Free plan include?", "The Free plan lets you explore Voxara's core text-to-speech experience before choosing a paid plan."],
  ["Can I use Voxara commercially?", "Commercial use depends on your plan and your rights to the source text and voice. Always use content you own or have permission to use."],
  ["Is my voice data private?", "Your voice assets are scoped to your account. Only upload recordings you own or are authorized to use."],
  ["Where can I get help?", "You can reach the Voxara team from the app whenever you need help with setup or a project."],
] as const;

type UseCase = (typeof useCases)[number]["value"];

export function OnboardingForm() {
  const router = useRouter();
  const trpc = useTRPC();
  const [step, setStep] = useState<1 | 2>(1);
  const [usingFor, setUsingFor] = useState<UseCase>("PERSONAL");
  const [primaryGoals, setPrimaryGoals] = useState("Create natural voiceovers for my content");
  const [noteForUs, setNoteForUs] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);
  const currentPlan = useQuery(trpc.onboarding.getCurrentPlan.queryOptions());

  const completeOnboarding = useMutation(
    trpc.onboarding.complete.mutationOptions({
      onError: (mutationError) => {
        setError(mutationError.message || "Could not finish setup. Please try again.");
      },
    }),
  );

  function continueToFaq(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (primaryGoals.trim().length < 3) {
      setError("Tell us a little about what you want to create.");
      return;
    }
    setStep(2);
  }

  function finish() {
    setError(null);
    completeOnboarding.mutate(
      {
        usingFor,
        primaryGoals,
        noteForUs: noteForUs || undefined,
        continueWithPlanType: "FREE",
      },
      {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    );
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black px-5 py-6 font-sans text-zinc-50 antialiased sm:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-5xl flex-col">
        <header className="flex h-8 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Voxara" width={28} height={28} className="rounded-md grayscale brightness-[2.5]" />
            <span className="text-[15px] font-semibold tracking-[-0.02em]">Voxara</span>
          </div>
          <span className="font-mono text-[11px] text-zinc-500">STEP {step} OF 2</span>
        </header>

        <div className="mt-5 grid grid-cols-2 gap-2" aria-label={`Step ${step} of 2`}>
          <div className="h-px bg-white" />
          <div className={cn("h-px transition-colors duration-300", step === 2 ? "bg-white" : "bg-zinc-800")} />
        </div>

        <section className="flex flex-1 justify-center py-12 sm:py-16">
          <div className="w-full max-w-4xl">
            {step === 1 ? (
              <form onSubmit={continueToFaq} className="space-y-8">
                <div className="space-y-3 text-center">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">Workspace setup</p>
                  <h1 className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">What brings you here?</h1>
                  <p className="mx-auto max-w-lg text-sm leading-6 text-zinc-500">A few quick details help us shape your workspace.</p>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md border border-zinc-800 bg-black text-zinc-400">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">Current plan</p>
                      <p className="mt-0.5 font-semibold capitalize">{currentPlan.isPending ? "Loading…" : `${(currentPlan.data?.planType ?? "FREE").toLowerCase()} plan`}</p>
                    </div>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setPricingOpen(true)} className="border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-900 hover:text-white">
                    View pricing
                    <ArrowRight />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Label>How will you mainly use Voxara?</Label>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {useCases.map(({ value, label, icon: Icon }) => {
                      const selected = usingFor === value;
                      return (
                        <button key={value} type="button" onClick={() => setUsingFor(value)} aria-pressed={selected} className={cn("relative flex h-28 flex-col items-start rounded-lg border p-4 text-left transition-colors duration-150", selected ? "border-zinc-400 bg-zinc-900" : "border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900/70")}>
                          <Icon className={cn("size-4 shrink-0", selected ? "text-white" : "text-zinc-500")} />
                          <span className="mt-auto flex min-h-10 items-end text-sm font-medium leading-5">{label}</span>
                          {selected && <Check className="absolute right-3 top-3 size-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-7">
                  <div className="space-y-2">
                    <Label htmlFor="primary-goals" className="text-sm font-medium px-1">What&apos;s your primary goal?</Label>
                    <Textarea id="primary-goals" value={primaryGoals} onChange={(event) => setPrimaryGoals(event.target.value)} maxLength={500} required className="h-24 min-h-24 resize-none border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:border-zinc-500 focus-visible:ring-zinc-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-for-us" className="text-sm font-medium px-1">Anything else we should know? <span className="font-normal text-white/35">(optional)</span></Label>
                    <Textarea id="note-for-us" value={noteForUs} onChange={(event) => setNoteForUs(event.target.value)} maxLength={1000} placeholder="Tell us about your workflow, team, or ideas…" className="h-24 min-h-24 resize-none border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:border-zinc-500 focus-visible:ring-zinc-500/20" />
                  </div>
                </div>

                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                <div className="flex justify-end">
                  <Button size="lg" className="h-11 rounded-lg bg-white px-5 text-black hover:bg-white/90">Continue <ArrowRight /></Button>
                </div>
              </form>
            ) : (
              <div className="space-y-7 w-[90%] mx-auto">
                <div className="space-y-2 text-center">
                  <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400"><Headphones className="size-4" /></div>
                  <h1 className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">A few things worth knowing</h1>
                  <p className="text-sm leading-6 text-zinc-500">Quick answers before you start creating.</p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 sm:px-7">
                  <Accordion type="single" collapsible>
                    {faqs.map(([question, answer], index) => (
                      <AccordionItem key={question} value={`faq-${index}`} className="border-white/10">
                        <AccordionTrigger className="py-4.5 text-white hover:no-underline">{question}</AccordionTrigger>
                        <AccordionContent className="max-w-2xl leading-6 text-white/55">{answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)} disabled={completeOnboarding.isPending} className="text-white/65 hover:bg-white/10 hover:text-white"><ArrowLeft /> Back</Button>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" size="lg" onClick={finish} disabled={completeOnboarding.isPending} className="h-11 rounded-lg bg-white px-5 text-black hover:bg-white/90">
                      {completeOnboarding.isPending ? <Loader2 className="animate-spin" /> : <Mic2 />}
                      Continue with free account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <Dialog open={pricingOpen} onOpenChange={setPricingOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto border-zinc-800 bg-black p-5 text-white sm:max-w-4xl sm:p-7">
          <DialogHeader className="pr-8 text-left">
            <DialogTitle className="text-2xl tracking-[-0.03em]">Choose what works for you</DialogTitle>
            <DialogDescription className="text-zinc-500">You can stay on Free now and upgrade at any time.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2 md:grid-cols-3">
            {[
              { name: "Free", price: "$0", description: "Explore the essentials", features: ["Core text to speech", "Starter voice library", "Personal workspace"] },
              { name: "Premium", price: "$19", description: "For regular creators", features: ["More generations", "Custom voice cloning", "Commercial usage"], popular: true },
              { name: "Pro", price: "$49", description: "For demanding workflows", features: ["Highest usage limits", "Priority processing", "Priority support"] },
            ].map((plan) => (
              <article key={plan.name} className={cn("relative flex min-h-72 flex-col rounded-lg border bg-zinc-950 p-5", plan.popular ? "border-zinc-400" : "border-zinc-800")}>
                {plan.popular && <span className="absolute right-4 top-4 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-[10px] text-zinc-300">POPULAR</span>}
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-white/45">{plan.description}</p>
                <p className="mt-5"><span className="text-3xl font-semibold tracking-tight">{plan.price}</span><span className="text-sm text-white/40"> / month</span></p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-zinc-300"><Check className="size-4 text-white" />{feature}</li>)}
                </ul>
                <p className="mt-auto pt-6 text-xs text-white/40">{plan.name === "Free" ? "Selected for onboarding" : "Available after setup"}</p>
              </article>
            ))}
          </div>

          <div className="flex justify-end">
            <DialogClose asChild>
              <Button className="h-10 bg-white px-5 text-black hover:bg-white/90">Back to onboarding</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

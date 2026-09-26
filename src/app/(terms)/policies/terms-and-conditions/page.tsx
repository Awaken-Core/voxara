import {terms} from "@/lib/policies";

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-border pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Legal</p>
        <h1 className="mt-3 text-3xl text-foreground sm:text-4xl">Terms and Conditions</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          These terms explain the rules for accessing and using Voxara and its voice-generation services.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Last updated: September 26, 2026</p>
      </header>

      <ol className="divide-y divide-border">
        {terms.map((term, index) => (
          <li key={term.title} className="grid gap-3 py-6 sm:grid-cols-[2.5rem_1fr] sm:gap-4">
            <span className="text-sm font-medium tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="text-base text-foreground">{term.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{term.description}</p>
            </div>
          </li>
        ))}
      </ol>
      </div>
    </main>
  );
}

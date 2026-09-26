import { PageHeader } from "@/components/page-header";
import { HeroPattern } from "@/features/dashboard/components/hero-pattern";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { TextInputPanel } from "@/features/dashboard/components/text-input-panel";
import { QuickActionsPanel } from "@/features/dashboard/components/quick-actions-panel";

export function DashboardView() {
  return (
    <div className="relative min-h-0 flex-1 overflow-y-auto bg-[#090909] lg:overflow-hidden">
      <PageHeader title="Dashboard" className="lg:hidden" />
      <HeroPattern />
      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-5xl flex-col items-center justify-center px-4 py-10 sm:px-8 lg:h-full lg:min-h-0 lg:py-8">
        <DashboardHeader />
        <div className="mt-8 w-full max-w-4xl">
          <TextInputPanel />
          <QuickActionsPanel />
        </div>
        <p className="mt-8 text-center text-xs leading-5 text-white/35">
          AI-generated audio may contain mistakes. Review your content before publishing.
        </p>
      </div>
    </div>
  );
};

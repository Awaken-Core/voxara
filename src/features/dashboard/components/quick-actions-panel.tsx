import { quickActions } from "@/features/dashboard/data/quick-actions";
import Link from "next/link";

export function QuickActionsPanel() {
  return (
    <div className="mt-5">
      <p className="mb-2.5 text-center text-xs font-normal text-white/40">Start with an idea</p>
      <div className="flex flex-wrap justify-center gap-2">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="rounded-full border border-white/16 bg-white/[0.07] px-3.5 py-1.5 text-sm font-normal text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,.05),0_1px_2px_rgba(0,0,0,.2)] backdrop-blur-xl transition-colors hover:border-white/30 hover:bg-white/[0.12] hover:text-white"
          >
            {action.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

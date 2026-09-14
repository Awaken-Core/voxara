import type { Metadata } from "next";

import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Set up your Voxara workspace.",
};

export default function OnboardingPage() {
  return <OnboardingForm />;
}

interface PolicyDefinition {
  type: string;
  title: string;
  message: string;
}

export type PolicyTypeSet = "ONBOARD" | "MONEY";

export const policiesList: Record<PolicyTypeSet, PolicyDefinition> = {
  ONBOARD: {
    type: "ONBOARD",
    title: "test",
    message: "test",
  },
  MONEY: {
    type: "MONEY",
    title: "test",
    message: "test",
  }
} as const satisfies Record<string, PolicyDefinition>;

export type PoliciesTypeSet = keyof typeof policiesList;

export const terms = [
  {
    title: "Acceptance of terms",
    description: "By creating an account or using Voxara, you agree to these Terms and Conditions. If you do not agree, you must not access or use the service.",
  },
  {
    title: "Account responsibilities",
    description: "You must provide accurate account information, keep your login credentials secure, and promptly notify us if you suspect unauthorized access to your account.",
  },
  {
    title: "Acceptable use",
    description: "You may not use Voxara for unlawful, fraudulent, abusive, deceptive, or harmful activity, or to violate another person’s privacy, publicity, or intellectual-property rights.",
  },
  {
    title: "Voice cloning and consent",
    description: "You may upload, clone, or generate a voice only when you own the necessary rights or have clear permission from the person whose voice is being used.",
  },
  {
    title: "Your content",
    description: "You retain ownership of content you submit to Voxara. You grant us only the limited rights required to process that content and provide, maintain, and secure the service.",
  },
  {
    title: "Generated content",
    description: "You are responsible for reviewing generated audio before publishing or distributing it and for ensuring that your use complies with applicable laws and third-party rights.",
  },
  {
    title: "Plans, credits, and payments",
    description: "Paid features, usage credits, billing periods, renewals, and applicable taxes are presented when you purchase a plan. Fees are non-refundable except where required by law or expressly stated otherwise.",
  },
  {
    title: "Service availability",
    description: "We work to keep Voxara reliable, but the service may occasionally be interrupted, changed, or discontinued for maintenance, security, legal, or operational reasons.",
  },
  {
    title: "Suspension and termination",
    description: "We may restrict or terminate access when these terms are violated, the service is misused, payment is overdue, or continued access creates legal or security risk.",
  },
  {
    title: "Changes to these terms",
    description: "We may update these terms as Voxara evolves. Material changes will be communicated through the service or another reasonable channel, and continued use means you accept the revised terms.",
  },
] as const;
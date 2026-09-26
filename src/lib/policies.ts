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
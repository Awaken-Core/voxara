interface PoliciesType {
  title: string;
  message: string;
}

type PoliciesTypeSet = "ONBOARD";

export const policiesList: Record<PoliciesTypeSet, PoliciesType> = {
  ONBOARD: {
    title: "test",
    message: "test",
  },
};
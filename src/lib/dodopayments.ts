import DodoPayments from "dodopayments";
import { env } from "./env";

export const dodopayments = new DodoPayments({
  environment: env.DODO_PAYMENTS_ENVIRONMENT,
  bearerToken: env.DODO_PAYMENTS_API_KEY,
  webhookKey: env.DODO_PAYMENTS_WEBHOOK_KEY,
});

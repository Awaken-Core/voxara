import { createTRPCRouter } from '../init';
import { generationsRouter } from './generations';
import { voicesRouter } from './voices';
import { onboardingRouter } from './onboarding';
import { subscriptionsRouter } from './subscriptions';
export const appRouter = createTRPCRouter({
  voices: voicesRouter,
  generations: generationsRouter,
  onboarding: onboardingRouter,
  subscriptions: subscriptionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

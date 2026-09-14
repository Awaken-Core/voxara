import { createTRPCRouter } from '../init';
import { generationsRouter } from './generations';
import { voicesRouter } from './voices';
import { onboardingRouter } from './onboarding';
export const appRouter = createTRPCRouter({
  voices: voicesRouter,
  generations: generationsRouter,
  onboarding: onboardingRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

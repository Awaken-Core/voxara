import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth-session";
import { prisma } from "@/lib/db";

export default async function OnboardingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (!session?.user.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isOnboarded: true },
  });

  if (user?.isOnboarded) {
    redirect("/");
  }

  return children;
}

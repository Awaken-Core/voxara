import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
    SidebarInset,
    SidebarProvider
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { getServerSession } from "@/lib/auth-session";
import { prisma } from "@/lib/db";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const session = await getServerSession();

    if (!session) {
        redirect("/sign-in");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isOnboarded: true },
    });

    if (!user?.isOnboarded) {
        redirect("/onboarding");
    }
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen} className="h-svh">
            <DashboardSidebar />
            <SidebarInset className="min-h-0 min-w-0">
                <main className="flex min-h-0 flex-1 flex-col">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
};


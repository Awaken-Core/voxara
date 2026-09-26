import { PageHeader } from "@/components/page-header";

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <PageHeader title="Terms and Conditions" />
            {children}
        </div>
    );
};

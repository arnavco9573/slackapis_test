import Sidebar from '@/components/core/sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-(--Primary-800)">
            <Sidebar />
            <main className="flex-1 ml-20 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}

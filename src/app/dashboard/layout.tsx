import SideBar from '@/components/core/sidebar';
import TopBar from '@/components/core/top-bar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <SideBar />
            <TopBar />
            <main className="flex-1 h-screen pl-20 pt-[126px] transition-all duration-300 ease-in-out w-full overflow-hidden max-w-[100vw] bg-(--Primary-800)">
                {children}
            </main>
        </div>
    );
}

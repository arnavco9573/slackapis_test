import SideBar from '@/components/core/sidebar';
import TopBar from '@/components/core/top-bar';

export default function LearnLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <SideBar />
            <TopBar />
            <main className="flex-1 px-2 pl-24 pt-[126px] transition-all duration-300 ease-in-out w-full max-w-[100vw] bg-(--Primary-800)">
                {children}
            </main>
        </div>
    );
}

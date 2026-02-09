import Sidebar from '@/components/core/sidebar';
import TopBar from '@/components/core/top-bar';

export default function CommunicationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-(--Primary-800)">
            <Sidebar />
            <TopBar />
            <main className="flex-1 ml-20 h-screen overflow-y-auto transition-all duration-300 pt-32 pb-10 px-4">
                {children}
            </main>
        </div>
    );
}

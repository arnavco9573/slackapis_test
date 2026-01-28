import Sidebar from '@/components/core/sidebar';

export default function CommunicationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-(--Primary-800)">
            <Sidebar />
            <main className="flex-1 ml-20 mt-10 mb-10 h-full flex flex-col overflow-y-auto transition-all duration-300">
                {children}
            </main>
        </div>
    );
}

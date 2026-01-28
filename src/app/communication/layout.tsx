import Sidebar from '@/components/core/sidebar';

export default function CommunicationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
            <Sidebar />
            <main className="flex-1 ml-20 h-full flex flex-col overflow-hidden transition-all duration-300">
                {children}
            </main>
        </div>
    );
}

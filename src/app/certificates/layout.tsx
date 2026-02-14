import SideBar from '@/components/core/sidebar';
import TopBar from '@/components/core/top-bar';

export default function CertificatesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SideBar />
            <TopBar />
            <div className="flex min-h-screen">
                <main className="flex-1 pt-26 ml-20 w-full relative overscroll-none flex flex-col bg-(--Primary-800)">
                    {children}
                </main>
            </div>
        </>
    );
}

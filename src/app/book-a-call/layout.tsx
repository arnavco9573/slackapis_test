import SideBar from '@/components/core/sidebar';
import TopBar from '@/components/core/top-bar';
import { checkTeamMembersExist } from './actions/checkTeamMembers';
import SyncOverlay from './_components/SyncOverlay';
import { redirect } from 'next/navigation';
import SyncFlowWrapper from './_components/SyncFlowWrapper';

export default async function BookCallLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side check
    const { success, exists, masterId } = await checkTeamMembersExist()

    // const showOverlay = true;

    const showOverlay = !exists || !success

    return (
        <div className="flex min-h-screen">
            <SideBar />
            <TopBar />

            {/* Main Content Area */}
            <main className="flex-1 h-screen pl-20 pt-[126px] transition-all duration-300 ease-in-out w-full max-w-[100vw] flex flex-col relative overflow-hidden bg-(--Primary-800)">
                {showOverlay ? (
                    <SyncFlowWrapper masterId={masterId || ''} />
                ) : (
                    <div className="flex-1 h-full">
                        {children}
                    </div>
                )}
            </main>
        </div>
    );
}



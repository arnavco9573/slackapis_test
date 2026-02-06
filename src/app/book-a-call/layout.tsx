import Sidebar from '@/components/core/sidebar';
import TopBar from '@/components/core/top-bar';
import { checkTeamMembersExist } from './actions/checkTeamMembers';
import SyncOverlay from './_components/SyncOverlay';
import { redirect } from 'next/navigation';
import SyncFlowWrapper from './_components/SyncFlowWrapper';

export default async function CommunicationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side check
    const { success, exists, masterId } = await checkTeamMembersExist()

    // const showOverlay = true;

    const showOverlay = !exists || !success

    return (
        <div className="flex h-screen w-full overflow-hidden bg-(--Primary-800)">
            <Sidebar />
            <TopBar />

            {/* Main Content Area */}
            <main className="flex-1 ml-20 pt-28 h-full w-full max-w-[100vw] flex flex-col relative overflow-hidden transition-all duration-300 ease-in-out">
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



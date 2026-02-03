'use client'

import { useRouter } from 'next/navigation'
import SyncOverlay from './SyncOverlay'

export default function SyncFlowWrapper({ masterId }: { masterId: string }) {
    const router = useRouter()

    const handleComplete = () => {
        router.refresh()
    }

    return <SyncOverlay masterId={masterId} onComplete={handleComplete} />
}

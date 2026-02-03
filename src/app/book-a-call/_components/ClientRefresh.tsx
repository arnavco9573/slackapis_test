'use client'

import { useRouter } from 'next/navigation'

export default function ClientRefresh({ children }: { children: (onComplete: () => void) => React.ReactNode }) {
    const router = useRouter()

    const handleComplete = () => {
        router.refresh()
    }

    return (
        <>
            {children(handleComplete)}
        </>
    )
}

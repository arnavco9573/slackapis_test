'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Users, RefreshCw } from 'lucide-react'
import { syncTeamMembers } from '../actions/syncTeamMembers'

export default function SyncTeamButton({ masterId }: { masterId: string }) {
    const [isSyncing, setIsSyncing] = useState(false)

    const handleSync = async () => {
        setIsSyncing(true)
        try {
            // Call the Server Action
            const result = await syncTeamMembers(masterId)

            if (result.success) {
                toast.success(`Success! Synced ${result.count} team members.`)
                // Reload page to show the new rows in the table
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            } else {
                toast.error("Sync Failed: " + result.message)
            }
        } catch (e) {
            toast.error("Something went wrong connecting to the server.")
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-[#1C1C1C] text-white px-4 py-2 rounded-lg hover:bg-gray-800 border border-[#333] transition-all disabled:opacity-50"
        >
            {isSyncing ? (
                <>
                    <RefreshCw className="animate-spin" size={18} />
                    Syncing...
                </>
            ) : (
                <>
                    <Users size={18} />
                    Sync Team from Google
                </>
            )}
        </button>
    )
}
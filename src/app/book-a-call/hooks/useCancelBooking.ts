'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelBooking } from '../actions/cancelBooking'
import { toast } from 'sonner'

export const useCancelBooking = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: cancelBooking,
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ['master-pending-requests'] })
            } else {
                throw new Error(data.message)
            }
        },
        onError: (error: any) => {
            console.error("Cancellation Failed:", error)
        }
    })
}

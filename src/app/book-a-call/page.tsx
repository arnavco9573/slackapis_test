'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { usePendingRequests } from './_components/usePendingRequests'
import BookingSidebar from './_components/BookingSidebar'
import AssignmentModal from './_components/AssignmentModal'
import CalendarView from './_components/CalendarView'
import TeamCalendarSelector from './_components/TeamCalendarSelector'
import EditCalendarModal from './_components/EditCalendarModal'
import EditMeetingModal from './_components/EditMeetingModal'
import { useQuery } from '@tanstack/react-query'
import { fetchTeamCalendar } from './actions/fetchTeamCalendar'
import { fetchSelectedTeamMembers } from './actions/fetchSelectedTeamMembers'
import { fetchTeamCalendarEvents } from './actions/fetchTeamCalendarEvents'
import { assignBooking } from './actions/assignBooking'
import { updateTeamCalendarEvent } from './actions/updateTeamCalendarEvent'
import PageLoader from '@/components/svg/page-loading'
import Button from '@/components/core/button'

export default function BookPage() {
    const { data, isLoading, error, refetch: refetchBookings } = usePendingRequests()
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
    const [isAssigning, setIsAssigning] = useState(false)

    // Calendar State
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Modal State
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>(null)
    const [teamCalendarData, setTeamCalendarData] = useState<any[]>([])
    const [loadingCalendar, setLoadingCalendar] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false) // Track if modal is for editing
    const [selectedMemberForModal, setSelectedMemberForModal] = useState<any | null>(null) // For popover selection

    // Edit Meeting Modal State
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [eventToEdit, setEventToEdit] = useState<any | null>(null)
    const [isSavingEdit, setIsSavingEdit] = useState(false)
    const [editSchedules, setEditSchedules] = useState<any[]>([])
    const [isLoadingEditSchedules, setIsLoadingEditSchedules] = useState(false)

    // Fetch team members
    const { data: teamMembersData, refetch: refetchTeamMembers, isLoading: isLoadingMembers } = useQuery({
        queryKey: ['selectedTeamMembers', data?.masterId],
        queryFn: () => fetchSelectedTeamMembers(data?.masterId || ''),
        enabled: !!data?.masterId,
    })

    const teamMembers = teamMembersData?.data || []

    // Initialize selected members (all active members by default)
    useEffect(() => {
        if (teamMembers.length > 0 && selectedMemberIds.length === 0) {
            setSelectedMemberIds(teamMembers.map((m: any) => m.id))
        }
    }, [teamMembers])

    // Fetch calendar events for selected members
    const { data: calendarEventsData, refetch: refetchCalendarEvents } = useQuery({
        queryKey: ['teamCalendarEvents', selectedMemberIds],
        queryFn: async () => {
            if (selectedMemberIds.length === 0) return { success: true, data: [] }

            const now = new Date()
            const startDate = startOfWeek(now)
            const endDate = addDays(endOfWeek(now), 30) // Fetch for next ~5 weeks

            return fetchTeamCalendarEvents({
                memberIds: selectedMemberIds,
                startDate,
                endDate
            })
        },
        enabled: selectedMemberIds.length > 0,
    })

    const calendarEvents = calendarEventsData?.data || []

    const handleSelectRequest = (id: string) => {
        setSelectedRequestId(prev => prev === id ? null : id)
    }

    const selectedRequest = useMemo(() => {
        if (!data?.requests || !selectedRequestId) return null
        return data.requests.find((r: any) => (r.request_group_id === selectedRequestId) || (r.id === selectedRequestId))
    }, [data, selectedRequestId])

    const groupedRequests = useMemo(() => {
        if (!data?.requests || !selectedRequest) return []
        const groupId = selectedRequest.request_group_id || selectedRequest.id
        return data.requests.filter((r: any) => (r.request_group_id === groupId) || (r.id === groupId))
    }, [data, selectedRequest])

    const handleSlotClick = async (isoTime: string, isEdit = false, member: any = null) => {
        if (!data?.masterId) return

        setSelectedSlotTime(isoTime)
        setIsEditMode(isEdit) // Set edit mode flag
        setSelectedMemberForModal(member)
        setModalOpen(true)
        setLoadingCalendar(true)

        try {
            const date = new Date(isoTime)
            const res = await fetchTeamCalendar(data.masterId, date)
            if (res.success) {
                console.log("Team Calendar Res:", res.data)
                setTeamCalendarData(res.data || [])
            } else {
                toast.error("Failed to fetch team availability")
            }
        } catch (e) {
            toast.error("Error loading calendar")
        } finally {
            setLoadingCalendar(false)
        }
    }

    const handleAssignMember = async (memberId: string, memberName: string) => {
        if (!selectedRequest || !selectedSlotTime) return
        const matchingBooking = groupedRequests.find((r: any) => r.requested_start_time === selectedSlotTime)
        const targetId = matchingBooking ? matchingBooking.id : selectedRequest.id

        setIsAssigning(true)
        try {
            const res = await assignBooking(targetId, memberId, selectedSlotTime)
            if (res.success) {
                toast.success(`Assigned to ${memberName}`)
                setModalOpen(false)
                setSelectedRequestId(null)
                refetchCalendarEvents() // Refresh calendar after assignment
                refetchBookings() // Refresh bookings list to show in Scheduled tab immediately
            } else {
                toast.error(res.message || "Assignment failed")
            }
        } catch (e) {
            toast.error("Error assigning booking")
        } finally {
            setIsAssigning(false)
        }
    }

    const handleEditCalendarSave = () => {
        refetchTeamMembers()
        refetchCalendarEvents()
    }

    const handleEditEvent = async (event: any) => {
        setEventToEdit(event)
        setEditModalOpen(true)
        setEditSchedules([])

        if (!data?.masterId) return

        setIsLoadingEditSchedules(true)
        try {
            // Determine date from event - handle both raw Google event and platform event
            const eventDate = event.start instanceof Date ? event.start : new Date(event.start?.dateTime || event.requested_start_time || new Date())
            const res = await fetchTeamCalendar(data.masterId, eventDate)
            if (res.success) {
                setEditSchedules(res.data || [])
            }
        } catch (e) {
            console.error("Error fetching schedules for edit:", e)
        } finally {
            setIsLoadingEditSchedules(false)
        }
    }

    const handleEditSave = async (data: { title: string, description: string, memberId: string }) => {
        if (!eventToEdit) return

        setIsSavingEdit(true)
        try {
            const res = await updateTeamCalendarEvent(
                eventToEdit.id || eventToEdit.bookingId,
                data.title,
                data.description,
                data.memberId
            )
            if (res.success) {
                toast.success("Meeting updated successfully")
                setEditModalOpen(false)
                setEventToEdit(null)
                refetchCalendarEvents()
                refetchBookings()
            } else {
                toast.error(res.message || "Failed to update meeting")
            }
        } catch (e) {
            toast.error("Error updating meeting")
        } finally {
            setIsSavingEdit(false)
        }
    }

    if (isLoading) return <div className="flex px-20 py-20 text-white"><PageLoader size={40} /></div>
    if (error) return <div className="text-red-500 p-20">Error loading requests</div>

    return (
        <div className="flex h-full w-full">
            <BookingSidebar
                bookings={data?.requests || []}
                onSelectBooking={handleSelectRequest}
                selectedRequestId={selectedRequestId}
                onEditBooking={handleEditEvent}
                masterId={data?.masterId}
                timezone={data?.timezone}
                availability={data?.availability}
            />

            <main className="flex-1 bg-[#14161B] overflow-hidden p-4 relative flex flex-col">
                <div className="flex flex-col h-full gap-2 min-h-0">
                    {/* Calendar View - Scrollable */}
                    <div className="min-h-0 relative flex-1">
                        <CalendarView
                            teamMembers={teamMembers}
                            selectedMemberIds={selectedMemberIds}
                            events={calendarEvents}
                            highlightedSlots={selectedRequest ? groupedRequests.filter((r: any) => r.status === 'requested') : []}
                            onSlotClick={handleSlotClick}
                            onEditEvent={handleEditEvent}
                            timezone={data?.timezone}
                        />
                    </div>

                    {/* Team Calendar Selector - Fixed at Bottom */}
                    <div className="shrink-0 p-4">
                        <TeamCalendarSelector
                            members={teamMembers}
                            selectedMemberIds={selectedMemberIds}
                            onSelectionChange={setSelectedMemberIds}
                            onEditClick={() => setIsEditModalOpen(true)}
                            isLoading={isLoadingMembers}
                        />
                    </div>
                </div>
            </main>

            <AssignmentModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setIsEditMode(false) // Reset edit mode on close
                }}
                slotTime={selectedSlotTime}
                teamMembers={teamCalendarData}
                onAssign={handleAssignMember}
                isAssigning={isAssigning}
                prioritySlots={groupedRequests}
                onSlotSelect={(time) => handleSlotClick(time, isEditMode)} // Preserve edit mode
                isLoading={loadingCalendar}
                isEditMode={isEditMode} // Pass edit mode flag
                initialSelectedMember={selectedMemberForModal}
                timezone={data?.timezone}
            />

            <EditCalendarModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                masterId={data?.masterId || ''}
                onSave={handleEditCalendarSave}
            />

            <EditMeetingModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setEventToEdit(null)
                    setEditSchedules([])
                }}
                event={eventToEdit}
                teamMembers={teamMembers}
                teamSchedules={editSchedules}
                onSave={handleEditSave}
                isSaving={isSavingEdit}
                isLoadingSchedules={isLoadingEditSchedules}
                timezone={data?.timezone}
            />
        </div>
    )
}

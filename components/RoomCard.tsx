"use client"

import { useState, useEffect } from "react"
import { Clock, MessageSquare } from "lucide-react"
import { type Room, delayReasons } from "@/types/room"

interface RoomCardProps {
  room: Room
  onAction: (roomId: number, action: "entry" | "exit" | "note" | "delayReason" | "markOverdue", value?: string) => void
}

export default function RoomCard({ room, onAction }: RoomCardProps) {
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [isNoteOpen, setIsNoteOpen] = useState<boolean>(false)
  const [isDelayReasonOpen, setIsDelayReasonOpen] = useState<boolean>(false)
  const [note, setNote] = useState<string>(room.notes || "")
  const [delayReason, setDelayReason] = useState<string>(room.delayReason || "")

  // Timer for in-progress rooms
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (room.status === "inProgress" && room.startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((new Date().getTime() - room.startTime!) / 60000)
        setElapsedTime(elapsed)

        // Check if cleaning is taking longer than expected
        if (elapsed > room.defaultCleaningTime && room.status !== "overdue") {
          onAction(room.id, "markOverdue")
        }
      }, 1000) // Check every second for debugging
    }

    return () => clearInterval(interval)
  }, [room.status, room.startTime, room.defaultCleaningTime, room.id, onAction])

  const getCardClass = () => {
    switch (room.status) {
      case "notStarted":
        return "room-card-not-started"
      case "inProgress":
        return "room-card-in-progress"
      case "done":
        return "room-card-done"
      case "overdue":
        return "room-card-overdue"
      default:
        return "room-card-not-started"
    }
  }

  const getStatusBadge = () => {
    if (room.status === "overdue" && room.isCompleted) {
      return <span className="status-badge-overdue">Completed Late</span>
    }

    switch (room.status) {
      case "notStarted":
        return <span className="status-badge-not-started">Not Started</span>
      case "inProgress":
        return <span className="status-badge-in-progress">In Progress</span>
      case "done":
        return <span className="status-badge-done">Done</span>
      case "overdue":
        return <span className="status-badge-overdue">Overdue</span>
      default:
        return <span className="status-badge-not-started">Not Started</span>
    }
  }

  const handleSaveNote = () => {
    onAction(room.id, "note", note)
    setIsNoteOpen(false)
  }

  const handleSaveDelayReason = () => {
    onAction(room.id, "delayReason", delayReason)
    setIsDelayReasonOpen(false)
  }

  const handleExitClick = () => {
    // If room is overdue and no delay reason provided, show delay reason modal
    if ((room.status === "overdue" || elapsedTime > room.defaultCleaningTime) && !room.delayReason) {
      setIsDelayReasonOpen(true)
    } else {
      onAction(room.id, "exit")
    }
  }

  return (
    <div className={getCardClass()}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold">Room {room.number}</h3>
        {getStatusBadge()}
      </div>

      {(room.status === "inProgress" || (room.status === "overdue" && !room.isCompleted)) && (
        <div className="flex items-center text-gray-600 mb-2">
          <Clock size={16} className="mr-1" />
          <span className="text-sm">
            {elapsedTime} min
            {elapsedTime > room.defaultCleaningTime && (
              <span className="text-status-overdue ml-1">(Expected: {room.defaultCleaningTime} min)</span>
            )}
          </span>
        </div>
      )}

      {(room.status === "done" || (room.status === "overdue" && room.isCompleted)) && room.completionTime && (
        <div className="flex items-center mb-2">
          <Clock size={16} className="mr-1" />
          <span className={`text-sm ${room.status === "overdue" ? "text-status-overdue" : "text-status-done"}`}>
            Completed in {room.completionTime} min
            {room.status === "overdue" && <span className="ml-1">(Expected: {room.defaultCleaningTime} min)</span>}
          </span>
        </div>
      )}

      {room.notes && (
        <div className="bg-gray-100 p-2 rounded-md mb-3 text-sm">
          <p>{room.notes}</p>
        </div>
      )}

      {room.delayReason && (
        <div className="bg-status-overdue/10 p-2 rounded-md mb-3 text-sm">
          <p className="text-status-overdue font-medium">Delay: {room.delayReason}</p>
        </div>
      )}

      {room.status === "notStarted" && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => onAction(room.id, "entry")} className="btn-entry flex-1">
            Entry
          </button>
          <button onClick={() => setIsNoteOpen(true)} className="btn-note p-3 aspect-square" aria-label="Add note">
            <MessageSquare size={20} />
          </button>
        </div>
      )}

      {(room.status === "inProgress" || (room.status === "overdue" && !room.isCompleted)) && (
        <div className="flex gap-2 mt-3">
          <button onClick={handleExitClick} className="btn-success flex-1 bg-status-done hover:bg-status-done/90">
            Exit
          </button>
          <button onClick={() => setIsNoteOpen(true)} className="btn-note p-3 aspect-square" aria-label="Add note">
            <MessageSquare size={20} />
          </button>
        </div>
      )}

      {/* Note Modal */}
      {isNoteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Add Note for Room {room.number}</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ventura-gold"
              placeholder="Enter note here..."
            />
            <div className="flex gap-2 mt-4">
              <button onClick={handleSaveNote} className="btn-note flex-1">
                Save
              </button>
              <button onClick={() => setIsNoteOpen(false)} className="btn flex-1 bg-gray-500 hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delay Reason Modal */}
      {isDelayReasonOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Cleaning Taking Longer</h3>
            <p className="mb-4 text-sm text-gray-600">
              Please select a reason for the delay in cleaning Room {room.number}:
            </p>
            <select
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-ventura-gold"
            >
              <option value="">Select a reason</option>
              {delayReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  handleSaveDelayReason()
                  // After saving the reason, complete the room
                  if (delayReason) {
                    onAction(room.id, "exit")
                  }
                }}
                className="btn-note flex-1"
                disabled={!delayReason}
              >
                Save & Complete
              </button>
              <button onClick={() => setIsDelayReasonOpen(false)} className="btn flex-1 bg-gray-500 hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


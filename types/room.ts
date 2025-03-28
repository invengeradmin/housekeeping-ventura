export interface Room {
  id: number
  number: string
  status: "notStarted" | "inProgress" | "done" | "overdue"
  notes: string
  startTime?: number
  completionTime?: number
  assignedTo?: string
  defaultCleaningTime: number // in minutes
  delayReason?: string
  isCompleted?: boolean // New flag to track completion separately from status
}

export const delayReasons = [
  "Guest requested late cleaning",
  "Extra cleaning required",
  "Waiting for maintenance",
  "Special request items",
  "Room heavily soiled",
  "Other",
]


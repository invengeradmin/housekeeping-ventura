"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { LogOut } from "lucide-react"
import type { Room } from "@/types/room"
import type { Staff } from "@/types/staff"

// Update the mockRooms array with shorter default cleaning times
const mockRooms: Room[] = [
  {
    id: 1,
    number: "101",
    status: "done",
    notes: "I need extra sheet",
    defaultCleaningTime: 1,
    completionTime: 1,
    assignedTo: "maria",
    isCompleted: true,
  },
  {
    id: 2,
    number: "102",
    status: "overdue",
    notes: "",
    defaultCleaningTime: 1,
    completionTime: 2,
    assignedTo: "maria",
    delayReason: "Extra cleaning required",
    isCompleted: true,
  },
  {
    id: 3,
    number: "103",
    status: "overdue",
    notes: "Extra towels",
    defaultCleaningTime: 1,
    completionTime: 2,
    assignedTo: "john",
    delayReason: "Room heavily soiled",
    isCompleted: true,
  },
  { id: 4, number: "104", status: "notStarted", notes: "", defaultCleaningTime: 1, assignedTo: "john" },
  { id: 5, number: "105", status: "notStarted", notes: "", defaultCleaningTime: 1, assignedTo: "" },
  { id: 6, number: "201", status: "notStarted", notes: "", defaultCleaningTime: 2, assignedTo: "" },
  { id: 7, number: "202", status: "notStarted", notes: "", defaultCleaningTime: 2, assignedTo: "maria" },
  { id: 8, number: "203", status: "notStarted", notes: "", defaultCleaningTime: 2, assignedTo: "john" },
]

const mockStaff: Staff[] = [
  { id: 1, username: "maria", name: "Maria Garcia" },
  { id: 2, username: "john", name: "John Smith" },
  { id: 3, username: "ana", name: "Ana Lopez" },
]

export default function AdminPanel() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)

  const handleAssignStaff = (roomId: number, staffUsername: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => (room.id === roomId ? { ...room, assignedTo: staffUsername } : room)),
    )
  }

  const handleUpdateDefaultTime = (roomId: number, time: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => (room.id === roomId ? { ...room, defaultCleaningTime: time } : room)),
    )
  }

  const getStatusClass = (status: string, isCompleted?: boolean) => {
    if (status === "overdue" && isCompleted) {
      return "bg-status-overdue/20 text-status-overdue"
    }

    switch (status) {
      case "notStarted":
        return "bg-status-notStarted/20 text-status-notStarted"
      case "inProgress":
        return "bg-status-inProgress/20 text-status-inProgress"
      case "done":
        return "bg-status-done/20 text-status-done"
      case "overdue":
        return "bg-status-overdue/20 text-status-overdue"
      default:
        return "bg-gray-100 text-gray-500"
    }
  }

  const getStatusText = (status: string, isCompleted?: boolean) => {
    if (status === "overdue" && isCompleted) {
      return "Completed Late"
    }

    switch (status) {
      case "notStarted":
        return "Not Started"
      case "inProgress":
        return "In Progress"
      case "done":
        return "Done"
      case "overdue":
        return "Overdue"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="Ventura Grand Inn Logo" width={150} height={50} className="h-auto" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-ventura-gold hover:underline">
              Staff View
            </Link>
            <Link href="/" className="p-2 text-gray-600 hover:text-ventura-gold">
              <LogOut size={24} />
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Banner */}
      <div className="bg-ventura-gold text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm opacity-90">Manage room assignments and view cleaning logs</p>
        </div>
      </div>

      {/* Room Assignment Table */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Room Assignments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delay Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(room.status, room.isCompleted)}`}
                      >
                        {getStatusText(room.status, room.isCompleted)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={room.assignedTo || ""}
                        onChange={(e) => handleAssignStaff(room.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ventura-gold"
                      >
                        <option value="">Unassigned</option>
                        {mockStaff.map((staff) => (
                          <option key={staff.id} value={staff.username}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={room.defaultCleaningTime}
                        onChange={(e) => handleUpdateDefaultTime(room.id, Number.parseInt(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ventura-gold"
                      >
                        <option value="1">1 min</option>
                        <option value="2">2 min</option>
                        <option value="5">5 min</option>
                        <option value="10">10 min</option>
                        <option value="15">15 min</option>
                        <option value="20">20 min</option>
                        <option value="25">25 min</option>
                        <option value="30">30 min</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.completionTime ? `${room.completionTime} min` : "-"}
                      {room.completionTime && room.completionTime > room.defaultCleaningTime && (
                        <span className="ml-1 text-status-overdue">
                          (+{room.completionTime - room.defaultCleaningTime})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.notes || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.delayReason || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


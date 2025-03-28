"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { LogOut } from "lucide-react"
import RoomCard from "@/components/RoomCard"
import type { Room } from "@/types/room"

// Update the mockRooms array with shorter default cleaning times
const mockRooms: Room[] = [
  {
    id: 1,
    number: "101",
    status: "done",
    notes: "I need extra sheet",
    defaultCleaningTime: 1,
    completionTime: 1,
    isCompleted: true,
  },
  {
    id: 2,
    number: "102",
    status: "overdue",
    notes: "",
    defaultCleaningTime: 1,
    completionTime: 2,
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
    delayReason: "Room heavily soiled",
    isCompleted: true,
  },
  { id: 4, number: "104", status: "notStarted", notes: "", defaultCleaningTime: 1 },
  { id: 5, number: "105", status: "notStarted", notes: "", defaultCleaningTime: 1 },
  { id: 6, number: "201", status: "notStarted", notes: "", defaultCleaningTime: 2 },
  { id: 7, number: "202", status: "notStarted", notes: "", defaultCleaningTime: 2 },
  { id: 8, number: "203", status: "notStarted", notes: "", defaultCleaningTime: 2 },
]

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const staffName = "Maria"

  const handleRoomAction = (
    roomId: number,
    action: "entry" | "exit" | "note" | "delayReason" | "markOverdue",
    value?: string,
  ) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId) {
          if (action === "entry") {
            return { ...room, status: "inProgress", startTime: new Date().getTime() }
          } else if (action === "exit") {
            const completionTime = room.startTime ? Math.floor((new Date().getTime() - room.startTime) / 60000) : 0
            // If the room is overdue or completion time > default time, keep the overdue status
            const newStatus =
              room.status === "overdue" || completionTime > room.defaultCleaningTime ? "overdue" : "done"
            return {
              ...room,
              status: newStatus,
              completionTime,
              isCompleted: true,
            }
          } else if (action === "note" && value !== undefined) {
            return { ...room, notes: value }
          } else if (action === "delayReason" && value !== undefined) {
            return { ...room, delayReason: value }
          } else if (action === "markOverdue") {
            return { ...room, status: "overdue" }
          }
        }
        return room
      }),
    )
  }

  // Group rooms by floor
  const roomsByFloor = rooms.reduce(
    (acc, room) => {
      const floor = room.number.charAt(0)
      if (!acc[floor]) {
        acc[floor] = []
      }
      acc[floor].push(room)
      return acc
    },
    {} as Record<string, Room[]>,
  )

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="Ventura Grand Inn Logo" width={150} height={50} className="h-auto" />
          </div>
          <Link href="/" className="p-2 text-gray-600 hover:text-ventura-gold">
            <LogOut size={24} />
          </Link>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="bg-ventura-gold text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">👋 Hello, {staffName}!</h1>
          <p className="text-sm opacity-90">Here are your assigned rooms for today</p>
        </div>
      </div>

      {/* Room List by Floor */}
      <div className="container mx-auto px-4 mt-6">
        {Object.entries(roomsByFloor).map(([floor, floorRooms]) => (
          <div key={floor} className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Floor {floor}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {floorRooms.map((room) => (
                <RoomCard key={room.id} room={room} onAction={handleRoomAction} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


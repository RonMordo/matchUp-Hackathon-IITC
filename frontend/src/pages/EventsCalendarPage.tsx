import React, { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import { useUserEventsProtected, useUserParticipatedEvents } from "@/hooks/user.hook";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface MyEvent {
  _id: string;
  title: string;
  description?: string;
  hobby: string;
  creator: string;
  imageUrl?: string;
  location: { type: "Point"; coordinates: [number, number] };
  address: string;
  time: string;
  minParticipants: number;
  maxParticipants: number;
  acceptedParticipants: string[];
  pendingParticipants: string[];
  status: "open" | "closed";
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CalendarEventExtended extends Omit<MyEvent, "time" | "createdAt" | "updatedAt"> {
  start: Date;
  end: Date;
  title: string;
  time: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function EventsCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");

  const [selectedEvent, setSelectedEvent] = useState<CalendarEventExtended | null>(null);

  // שימוש בקריאות API אמיתיות
  const { data: createdEvents = [], isLoading: loadingCreated } = useUserEventsProtected();
  const { data: participatedEvents = [], isLoading: loadingParticipated } = useUserParticipatedEvents();

  // איחוד שני מערכי האירועים
  const allEvents = useMemo(() => {
    const combined = [...(createdEvents || []), ...(participatedEvents || [])];

    // הסרת כפילויות לפי _id
    const uniqueMap = new Map<string, MyEvent>();
    combined.forEach((e) => {
      uniqueMap.set(e._id, e);
    });

    return Array.from(uniqueMap.values()).map((e) => ({
      ...e,
      start: new Date(e.time),
      end: new Date(e.time),
      title: e.title + (e.status === "open" ? " 🟢" : " 🔴"),
      time: new Date(e.time),
      createdAt: new Date(e.createdAt),
      updatedAt: new Date(e.updatedAt),
      status: e.status === "open" ? "open" : "closed",
    })) as CalendarEventExtended[];
  }, [createdEvents, participatedEvents]);

  const loading = loadingCreated || loadingParticipated;

  const dayPropGetter = (date: Date) => {
    const hasEvent = allEvents.some((e) => e.start && isSameDay(e.start, date));
    if (hasEvent)
      return {
        style: {
          backgroundColor: "#d1f0d5",
          borderRadius: "8px",
          transition: "background-color 0.3s ease",
        },
      };
    return {};
  };

  const eventPropGetter = (event: CalendarEventExtended) => {
    const backgroundColor = event.status === "open" ? "#22c55e" : "#ef4444"; // Tailwind green-500 / red-500
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "12px",
        padding: "4px 8px",
        border: "none",
        fontWeight: "600",
        fontSize: "0.85rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        cursor: "pointer",
      },
    };
  };

  if (loading) return <div className="text-center mt-10">Loading events...</div>;

  return (
    <div
      className="w-screen h-screen p-8 bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-300 flex flex-col"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="text-5xl font-extrabold mb-8 text-indigo-900 drop-shadow-md select-none">
        🗓️ Events Calendar
      </h1>

      {/* תאריך מודגש וגדול מחוץ ללוח השנה */}
      <div className="text-center text-indigo-900 font-extrabold text-4xl mb-8 border-b-4 border-indigo-700 pb-4 select-none">
        {format(currentDate, "MMMM yyyy")}
      </div>

      <div
        className="flex-grow rounded-3xl shadow-2xl overflow-hidden border border-indigo-300 bg-white"
        style={{ height: "100%" }}
      >
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          popup
          selectable
          date={currentDate}
          onNavigate={setCurrentDate}
          view={currentView}
          onView={setCurrentView}
          views={["month", "week", "day", "agenda"]}
          onSelectEvent={(event) => setSelectedEvent(event as CalendarEventExtended)}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventPropGetter}
        />
      </div>

      <Dialog open={selectedEvent !== null} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-lg rounded-2xl bg-white shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-indigo-900">
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription className="mt-3 text-gray-700 text-base whitespace-pre-line">
              {selectedEvent?.description || "No description provided."}
            </DialogDescription>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              📍 <span className="font-semibold">{selectedEvent?.address}</span>
              <br />
              ⏰{" "}
              <span className="font-semibold">
                {selectedEvent ? selectedEvent.time.toLocaleString() : "N/A"}
              </span>
              <br />
              Status: <span className="capitalize font-semibold">{selectedEvent?.status}</span>
            </p>
          </DialogHeader>
          <DialogClose asChild>
            <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-3 rounded-lg font-semibold shadow-lg">
              Close
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventsCalendarPage;

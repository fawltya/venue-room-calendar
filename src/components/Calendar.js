import React, { useState, useEffect, useRef } from "react";
import {
  startOfWeek,
  addDays,
  format,
  isEqual,
  startOfDay,
  isSameDay,
} from "date-fns";
import EventModal from "./EventModal";
import { app, database } from "../firebase";
import { ref, onValue, set, remove, push } from "firebase/database";
import MonthlyCalendar from "./MonthlyCalendar";
import { Toggle } from "@radix-ui/react-toggle";

const roomOptions = ["Court Room", "The Open Arms", "The Drawing Room"];
const statusOptions = ["Confirmed", "Hold", "Cancelled"];

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState("weekly"); // Add this line
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    doorsTime: "",
    name: "",
    room: "",
    technicalSpecifications: "",
    accessibilityInfo: "",
    ticketLink: "",
    description: "",
    status: "",
  });

  const firstRender = useRef(true);

  const toggleCalendarView = () => {
    setCalendarView((prevView) =>
      prevView === "weekly" ? "monthly" : "weekly"
    );
  };

  useEffect(() => {
    const eventsRef = ref(database, "events");
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const storedEvents = snapshot.val();
      if (storedEvents) {
        const eventsArray = Object.entries(storedEvents).map(([id, event]) => {
          return {
            id,
            ...event,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime),
          };
        });
        setEvents(eventsArray);
        console.log("Events:", eventsArray);
      } else {
        setEvents([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startTime = new Date(`${formData.date}T${formData.startTime}`);
    const endTime = new Date(`${formData.date}T${formData.endTime}`);
    const eventData = {
      ...formData,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    if (editMode) {
      const eventRef = ref(database, `events/${selectedEventIndex}`);
      set(eventRef, eventData, () => {
        setEvents((prevEvents) => {
          const updatedEvents = [...prevEvents];
          const index = updatedEvents.findIndex(
            (event) => event.id === selectedEventIndex
          );
          updatedEvents[index] = eventData;
          return updatedEvents;
        });
      });
    } else {
      const newEventRef = push(ref(database, "events"));
      set(newEventRef, eventData, () => {
        setEvents((prevEvents) => [
          ...prevEvents,
          { id: newEventRef.key, ...eventData },
        ]);
      });
    }

    setFormData({
      startTime: "",
      endTime: "",
      name: "",
      room: "",
      technicalSpecifications: "",
      accessibilityInfo: "",
      ticketLink: "",
      description: "",
      status: "",
    });

    setShowEventModal(false);
  };

  const handleEventClick = (event, index) => {
    setSelectedEventIndex(event.id);
    setFormData({
      ...event,
      date: format(new Date(event.startTime), "yyyy-MM-dd"),
      startTime: format(new Date(event.startTime), "HH:mm"),
      endTime: format(new Date(event.endTime), "HH:mm"),
    });
    setEditMode(true);
    setShowEventModal(true);
  };

  const handleDelete = () => {
    if (selectedEventIndex !== null) {
      const eventRef = ref(database, `events/${selectedEventIndex}`);
      remove(eventRef);
      setSelectedEventIndex(null);
    }
  };

  const handleDuplicate = (eventId) => {
    const eventToDuplicate = events.find((event) => event.id === eventId);
    if (eventToDuplicate) {
      const newEventRef = push(ref(database, "events"));
      const newEvent = {
        ...eventToDuplicate,
        id: newEventRef.key,
        startTime: new Date(eventToDuplicate.startTime).toISOString(),
        endTime: new Date(eventToDuplicate.endTime).toISOString(),
      };
      set(newEventRef, newEvent, () => {
        setEvents([...events, newEvent]);
      });
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500";
      case "Hold":
        return "bg-orange-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "";
    }
  };

  const renderEvents = (day, room) => {
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      const targetDate = startOfDay(new Date(day));
      return (
        event.startTime &&
        isSameDay(eventDate, targetDate) &&
        event.room === room
      );
    });

    return filteredEvents.map((event, index) => (
      <div
        key={event.id}
        onClick={() => handleEventClick(event, index)}
        className={`border border-gray-200 p-1 mb-1 cursor-pointer ${getStatusClass(
          event.status
        )}`}
      >
        {event.startTime && format(new Date(event.startTime), "HH:mm")} -{" "}
        {event.endTime && format(new Date(event.endTime), "HH:mm")}{" "}
        <strong>{event.name}</strong>
      </div>
    ));
  };

  const renderCalendar = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = Array.from({ length: 14 }, (_, index) =>
      format(addDays(start, index), "yyyy-MM-dd")
    );

    return (
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="w-1/4">Date/Room</th>
            {roomOptions.map((room, index) => (
              <th key={index} className="w-1/4">
                {room}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, index) => (
            <tr key={index}>
              <td className="border border-gray-200 p-2">
                {format(new Date(day), "EEE dd/MM/yy")}
              </td>
              {roomOptions.map((room, index) => (
                <td
                  key={index}
                  className="border border-gray-200 p-2"
                  data-empty="true"
                  onClick={(e) => {
                    if (e.target.getAttribute("data-empty") === "true") {
                      setFormData({
                        startTime: "",
                        endTime: "",
                        doorsTime: "",
                        name: "",
                        room: room,
                        technicalSpecifications: "",
                        accessibilityInfo: "",
                        ticketLink: "",
                        description: "",
                        status: "",
                        date: day,
                      });
                      setShowEventModal(true);
                      setEditMode(false);
                    }
                  }}
                >
                  {renderEvents(day, room)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mx-auto p-4 flex flex-col mt-10">
      <div className="flex justify-center my-6">
        <h1 className="text-3xl font-extrabold uppercase">
          The Court House events
        </h1>
      </div>
      <EventModal
        showEventModal={showEventModal}
        setShowEventModal={setShowEventModal}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        formData={formData}
        roomOptions={roomOptions}
        statusOptions={statusOptions}
        editMode={editMode}
        handleDelete={handleDelete}
        handleDuplicate={handleDuplicate}
      />
      {renderCalendar()}

      <div className="flex justify-between my-6">
        <button
          onClick={() => setCurrentDate((prevDate) => addDays(prevDate, -14))}
          className="bg-slate-900 hover:bg-slate-700 text-white font-bold w-1/5 rounded py-3 px-4 focus:outline-none focus:shadow-outline"
        >
          Previous 2 Weeks
        </button>

        <button
          onClick={() => {
            setShowEventModal(true);
            setEditMode(false);
          }}
          className=" bg-emerald-900 hover:bg-emerald-700 text-white w-2/5  font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Event
        </button>
        <button
          onClick={() => setCurrentDate((prevDate) => addDays(prevDate, 14))}
          className="bg-slate-900 hover:bg-slate-700 text-white font-bold w-1/5 rounded py-3 px-4 focus:outline-none focus:shadow-outline"
        >
          Next 2 Weeks
        </button>
      </div>
    </div>
  );
};

export default Calendar;

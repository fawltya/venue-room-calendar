import React, { useState, useEffect, useRef } from "react";
import { startOfWeek, addDays, format } from "date-fns";
import EventModal from "./EventModal";
import { app, database } from "../firebase";
import { ref, onValue, set, remove, push } from "firebase/database";

const roomOptions = ["Court Room", "The Open Arms", "The Drawing Room"];
const statusOptions = ["Confirmed", "Hold", "Cancelled"];

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [formData, setFormData] = useState({
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

  const firstRender = useRef(true);

  useEffect(() => {
    const eventsRef = ref(database, "events");
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const storedEvents = snapshot.val();
      if (storedEvents) {
        setEvents(Object.values(storedEvents));
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
    const eventData = { ...formData, startTime, endTime };

    if (editMode) {
      const eventRef = ref(database, `events/${selectedEventIndex}`);
      set(eventRef, eventData);
    } else {
      const newEventRef = push(ref(database, "events"));
      set(newEventRef, eventData);
    }

    // resetFormData();
    setShowEventModal(false);
  };

  const handleEventClick = (event, index) => {
    setSelectedEventIndex(Object.keys(events)[index]);
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
    const filteredEvents = events.filter(
      (event) =>
        event.startTime && // add null check for startTime
        format(new Date(event.startTime), "yyyy-MM-dd") === day &&
        event.room === room
    );

    return filteredEvents.map((event, index) => (
      <div
        key={index}
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
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, index) =>
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
              <td className="border border-gray-200 p-2">{day}</td>
              {roomOptions.map((room, index) => (
                <td key={index} className="border border-gray-200 p-2">
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
    <div className="container mx-auto p-4">
      <button
        onClick={() => {
          setShowEventModal(true);
          setEditMode(false);
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Event
      </button>
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
      />

      {renderCalendar()}
    </div>
  );
};

export default Calendar;

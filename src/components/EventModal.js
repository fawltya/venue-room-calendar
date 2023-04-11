import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const inputStyle =
  "w-full h-10 px-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white";

const EventModal = ({
  showEventModal,
  setShowEventModal,
  handleSubmit,
  handleDelete,
  handleInputChange,
  formData,
  roomOptions,
  statusOptions,
  editMode,
}) => {
  const [roomTriggerText, setRoomTriggerText] = useState(
    formData.room || `Select a room`
  );
  const [statusTriggerText, setStatusTriggerText] = useState(
    formData.status || `Select a status`
  );
  useEffect(() => {
    setRoomTriggerText(formData.room || "Select a room");
    setStatusTriggerText(formData.status || "Select a status");
  }, [formData]);

  const renderSelect = (name, options, triggerText, setTriggerText) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          type="button"
          className="w-full h-10 px-3 bg-gray-800 border border-gray-700 rounded text-left text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          {triggerText}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-gray-800 border border-gray-700 rounded">
        {options.map((option, index) => (
          <DropdownMenu.Item
            key={index}
            onSelect={() => {
              handleInputChange({ target: { name, value: option } });
              setTriggerText(option);
            }}
            className="text-white px-2 py-1 hover:bg-gray-700"
          >
            {option}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );

  return (
    <Dialog.Root open={showEventModal} onClose={() => setShowEventModal(false)}>
      <Dialog.Overlay className="fixed z-10 inset-0 bg-black opacity-50" />
      <Dialog.Content
        className="fixed z-20 inset-x-0 top-1/2 transform -translate-y-1/2 bg-black p-8 w-full max-w-md mx-auto rounded shadow-lg"
        as="form"
      >
        <h2 className="text-xl mb-4">
          {editMode ? "Edit Event" : "Add Event"}
        </h2>
        <div className="mb-4">
          <Label.Root className="block text-sm font-bold mb-2">Date</Label.Root>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>
        <div className="mb-4">
          <Label.Root className="block text-sm font-bold mb-2">
            Start Time
          </Label.Root>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>
        <div className="mb-4">
          <Label.Root className="block text-sm font-bold mb-2">
            End Time
          </Label.Root>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>
        <div className="mb-4">
          <Label.Root className="block text-sm font-bold mb-2">
            Event Name
          </Label.Root>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>
        <div className="mb-4">
          <Label.Root className="block text-sm font-bold mb-2">Room</Label.Root>
          {renderSelect(
            "room",
            roomOptions,
            roomTriggerText,
            setRoomTriggerText
          )}
        </div>
        <div className="mb-4">
          <Label.Root className="block text-sm font-bold mb-2">
            Technical Specifications
          </Label.Root>
          <textarea
            name="technicalSpecifications"
            value={formData.technicalSpecifications}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>
        <div className="mb-4">
          <Label.Root className="block text-sm font-bold mb-2">
            Accessibility Info
          </Label.Root>
          <textarea
            name="accessibilityInfo"
            value={formData.accessibilityInfo}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>
        <div className="mb-4">
          <Label.Root className="block text-sm font-bold mb-2">
            Ticket Link
          </Label.Root>
          <input
            type="url"
            name="ticketLink"
            value={formData.ticketLink}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>
        <div className="mb-4">
          <Label.Root className="block text-sm font-bold mb-2">
            Event Description
          </Label.Root>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>
        <div className="mb-4">
          <Label.Root className="block text-sm font-bold mb-2">
            Status
          </Label.Root>
          {renderSelect(
            "status",
            statusOptions,
            statusTriggerText,
            setStatusTriggerText
          )}
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            handleSubmit(event);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            handleDelete(formData.id);
          }}
          className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete
        </button>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EventModal;

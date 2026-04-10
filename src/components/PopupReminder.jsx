// components/PopupReminder.jsx
import React, { useState } from "react";

export default function PopupReminder({ onClose, onSave }) {
  const [reminderText, setReminderText] = useState("");
  const [reminderDate, setReminderDate] = useState("");

  const handleSave = () => {
    if (reminderText && reminderDate) {
      onSave({ text: reminderText, date: reminderDate });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Reminder</h2>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Reminder Text</label>
          <input
            type="text"
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. Follow up with client"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Reminder Date</label>
          <input
            type="date"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

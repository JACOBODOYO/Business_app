import React, { useState } from "react";
const API = import.meta.env.VITE_API_URL;

export default function FollowUp({ leadsId, addFollowUp }) {
  const [followUpStage, setFollowUpStage] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");



  const handleSubmitFollowUp = async () => {
    const newFollowUp = {
      type: followUpStage,
      notes: followUpNotes,
      date: followUpDate,
    };

    await addFollowUp(newFollowUp);

    setFollowUpStage("");
    setFollowUpNotes("");
    setFollowUpDate("");
  };

  return (
    <div className="bg-white rounded-[15px] border-b-4 border-blue-400 p-3">
      <h1 className="font-bold text-lg mb-3">Follow-Up</h1>

      {/* Collection Stage */}
      <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 mb-3">
        <p>Collection stage</p>
        <select
          className="cursor-pointer border rounded p-1"
          value={followUpStage}
          onChange={(e) => setFollowUpStage(e.target.value)}
        >
          <option value="">Select option</option>
          <option value="Out Source Email">Out Source Email</option>
          <option value="No Contact Provided">No Contact Provided</option>
          <option value="Negotiation in progress">Negotiation in progress</option>
          <option value="On Hold">On Hold</option>
          <option value="Phone switched off">Phone switched off</option>
          <option value="Ringing no response">Ringing no response</option>
          <option value="PTP">PTP</option>
          <option value="Not in Service">Not in Service</option>
          <option value="Wrong number">Wrong number</option>
          <option value="Scheduled Payment">Scheduled Payment</option>
          <option value="Field Visit">Field Visit</option>
          <option value="Non Commital">Non Commital</option>
          <option value="Send Email">Send Email</option>
        </select>
      </div>

      {/* Notes */}
      <div className="flex flex-col mb-3">
        <label className="mb-1">Follow-up Notes</label>
        <textarea
          className="w-full h-[100px] border rounded p-2"
          value={followUpNotes}
          onChange={(e) => setFollowUpNotes(e.target.value)}
        />
      </div>

      {/* Next Follow-Up Date */}
      <div className="flex flex-col mb-3">
        <label className="mb-1">Next follow-up Date</label>
        <input
          type="date"
          className="border rounded p-1 w-[50%]"
          value={followUpDate}
          onChange={(e) => setFollowUpDate(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmitFollowUp}
        className="bg-blue-600 p-3 text-white rounded-[10px] hover:bg-blue-700
    transition-all duration-150
    active:scale-95
    active:opacity-80
    active:translate-y-[1px]
    cursor-pointer"
      >
        Submit Follow-up
      </button>
    </div>
  );
}

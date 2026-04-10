import React, { useState, useEffect } from "react";
import axios from "axios";
import PopupModal from "./PopupModal";
import PopupModalActivity from "./PopupModalActivity";
import PopupNotes from "./PopupNotes";
import PopupReminder from "./PopupReminder";
import FollowUp from "./FollowUp";
import PromiseToPay from "./PromiseToPay";
import PromiseToPayHistory from "./PromiseToPayHistory";

export default function ProfileDetails({ leadId }) {
  const [lead, setLead] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [dealStage, setDealStage] = useState("Outsource email");
  const [nextActivity, setNextActivity] = useState("call");
  const [reminderData, setReminderData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [followUps, setFollowUps] = useState([]);

  // Fetch lead details
  useEffect(() => {
    if (!leadId) return;

    axios
      .get(`http://localhost:3001/leads/${leadId}`)
      .then((res) => setLead(res.data))
      .catch((err) => console.error("Failed to fetch lead:", err));
  }, [leadId]);

  // Fetch follow-ups for this lead
  useEffect(() => {
    if (!leadId) return;

    axios
      .get(`http://localhost:3001/followups/${leadId}`)
      .then((res) => setFollowUps(res.data))
      .catch((err) => console.error("Failed to fetch follow-ups:", err));
  }, [leadId]);

  const addFollowUp = async (data) => {
    if (!leadId) {
      console.error("Cannot add follow-up: leadId is undefined");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/followups", {
        lead_id: leadId,
        followup_type: data.type,
        notes: data.notes,
        next_action_date: data.date,
      });

      setFollowUps((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Failed to save follow-up:", err);
    }
  };

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);
  const updateDealStage = (newStage) => setDealStage(newStage);
  const updateNextActivity = (newActivity) => setNextActivity(newActivity);
  const handleAddNote = (newNote) => setNotes((prev) => [newNote, ...prev]);

  return (
    <div className="rounded-lg gap-4">
      <div className="grid grid-cols-2 gap-4 m-3">
        {/* FollowUp Component */}
        <FollowUp addFollowUp={addFollowUp} />

        {/* Promise to Pay */}
        <PromiseToPay />

        {/* Follow-up History */}
        <div className="col-span-2 bg-white border-b-4 border-blue-400 rounded-[10px] p-3">
          <p className="font-bold mb-2">Follow-up History</p>

          {/* Table header */}
          <div className="grid grid-cols-3 font-semibold border-b-2 border-gray-300 pb-2">
            <p>Status</p>
            <p>Follow-up Date</p>
            <p>Notes</p>
          </div>

          {/* Table rows */}
          {followUps.length === 0 ? (
            <p className="text-gray-500 p-2">No follow-up history yet.</p>
          ) : (
            followUps.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-3 border-b border-gray-200 py-2"
              >
                <p>{item.followup_type}</p>
                <p>{new Date(item.next_action_date).toLocaleDateString()}</p>

                <p>{item.notes}</p>
              </div>
            ))
          )}
        </div>
        <PromiseToPayHistory leadId={leadId} />

        {/* Collection Update */}
        <div className="row-start-3 bg-white rounded-[10px] p-3 border-b-4 border-blue-400">
          <p className="font-bold">Collection update</p>
          <p>Date</p>
          <input
            type="date"
            className="border border-black rounded-[5px] p-1 w-[70%]"
          />
          <p className="mt-3">Collection Notes</p>
          <textarea
            type="text"
            className="border border-black rounded-[5px] mt-2 w-[70%] h-[100px]"
            placeholder="Enter text..."
          />
        </div>
        <div className="col-span-2 bg-white border-b-4 border-blue-400 rounded-[10px] p-3">
          <p className="font-bold mb-2">Collection Update History</p>
          <div className="flex flex-col mb-3">
            <label className="mb-1">Follow-up Notes</label>

            <div className="w-full h-[100px] border rounded p-2">
              date: 1-1-2026
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === "PopupModal" && (
        <PopupModal closeModal={closeModal} updateDealStage={updateDealStage} />
      )}
      {activeModal === "PopupModalActivity" && (
        <PopupModalActivity
          closeModal={closeModal}
          updateNextActivity={updateNextActivity}
        />
      )}
      {activeModal === "PopupNotes" && (
        <PopupNotes leadId={leadId} title="Add Note" onClose={closeModal}>
          <textarea
            placeholder="Write your note here..."
            className="w-full p-2 border rounded mb-4"
            rows={4}
          />
          <button
            onClick={closeModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Note
          </button>
        </PopupNotes>
      )}
      {activeModal === "PopupReminder" && (
        <PopupReminder
          onClose={closeModal}
          onSave={(data) => {
            setReminderData(data);
            console.log("Saved Reminder:", data);
          }}
        />
      )}
    </div>
  );
}

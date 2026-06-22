import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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
  const [refreshPTP, setRefreshPTP] = useState(false);

  // =========================
  // FETCH LEAD
  // =========================
  useEffect(() => {
    if (!leadId) return;

    const fetchLead = async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (error) console.error("Lead fetch error:", error);
      else setLead(data);
    };

    fetchLead();
  }, [leadId]);

  // =========================
  // FETCH FOLLOWUPS
  // =========================
  useEffect(() => {
    if (!leadId) return;

    const fetchFollowUps = async () => {
      const { data, error } = await supabase
        .from("followups")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });

      if (error) console.error("Followups fetch error:", error);
      else setFollowUps(data);
    };

    fetchFollowUps();
  }, [leadId]);

  // =========================
  // ADD FOLLOWUP + UPDATE LEAD
  // =========================
  const addFollowUp = async (data) => {
    try {
      // 1. insert followup
      const { error: followErr } = await supabase.from("followups").insert([
        {
          lead_id: leadId,
          followup_type: data.type,
          notes: data.notes,
          next_action_date: data.date,
        },
      ]);

      if (followErr) throw followErr;

      // 2. update lead next_followup
      const { error: leadErr } = await supabase
        .from("leads")
        .update({
          next_followup: data.date,
        })
        .eq("id", leadId);

      if (leadErr) throw leadErr;

      // 3. refresh lead
      const { data: updatedLead } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      setLead(updatedLead);

      // 4. refresh followups
      const { data: updatedFollowups } = await supabase
        .from("followups")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });

      setFollowUps(updatedFollowups);
    } catch (err) {
      console.error("FollowUp error:", err);
    }
  };

  // =========================
  // UI HELPERS
  // =========================
  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);
  const updateDealStage = (newStage) => setDealStage(newStage);
  const updateNextActivity = (newActivity) => setNextActivity(newActivity);
  const handleAddNote = (newNote) =>
    setNotes((prev) => [newNote, ...prev]);

  // =========================
  // RENDER
  // =========================
  return (
    <div className="rounded-lg gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* FOLLOW UP */}
        <FollowUp
          leadId={leadId}
          addFollowUp={addFollowUp}
        />

        {/* PROMISE TO PAY */}
        <PromiseToPay
          leadId={leadId}
          onSaved={() => setRefreshPTP((prev) => !prev)}
        />

        {/* FOLLOWUP HISTORY */}
        <div className="col-span-2 bg-white border-b-4 border-blue-400 rounded-[10px] p-3">
          <p className="font-bold mb-2">Follow-up History</p>

          <div className="grid grid-cols-3 font-semibold border-b-2 border-gray-300 pb-2">
            <p>Status</p>
            <p>Follow-up Date</p>
            <p>Notes</p>
          </div>

          {followUps.length === 0 ? (
            <p className="text-gray-500 p-2">No follow-up history yet.</p>
          ) : (
            followUps.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-3 border-b border-gray-200 py-2"
              >
                <p>{item.followup_type}</p>
                <p>
                  {new Date(item.next_action_date).toLocaleDateString()}
                </p>
                <p>{item.notes}</p>
              </div>
            ))
          )}
        </div>

        <PromiseToPayHistory
          leadId={leadId}
          refresh={refreshPTP}
        />

        {/* COLLECTION UPDATE (UI ONLY FOR NOW) */}
        <div className="row-start-3 bg-white rounded-[10px] p-3 border-b-4 border-blue-400">
          <p className="font-bold">Collection update</p>

          <p>Date</p>
          <input
            type="date"
            className="border border-black rounded-[5px] p-1 w-[70%]"
          />

          <p className="mt-3">Collection Notes</p>
          <textarea
            className="border border-black rounded-[5px] mt-2 w-[70%] h-[100px]"
          />
        </div>

        <div className="col-span-2 bg-white border-b-4 border-blue-400 rounded-[10px] p-3">
          <p className="font-bold mb-2">Collection Update History</p>
          <div className="w-full h-[100px] border rounded p-2">
            date: 1-1-2026
          </div>
        </div>

      </div>

      {/* MODALS */}
      {activeModal === "PopupModal" && (
        <PopupModal
          closeModal={closeModal}
          updateDealStage={updateDealStage}
        />
      )}

      {activeModal === "PopupModalActivity" && (
        <PopupModalActivity
          closeModal={closeModal}
          updateNextActivity={updateNextActivity}
        />
      )}

      {activeModal === "PopupNotes" && (
        <PopupNotes
          leadId={leadId}
          title="Add Note"
          onClose={closeModal}
        />
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
import React, { useEffect, useState } from "react";
import axios from "axios";
import SmsReminder from "./SmsReminder";
import DemandLetter from "./DemandLetter";

export default function CallButton({ phoneNumber, company, lead }) {
  const [status, setStatus] = useState("idle");
  const [showSms, setShowSms] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openDemandLetter = () => {
    setShowModal(true);
  };

  const handleCall = async () => {
    try {
      setStatus("calling...");

      const res = await axios.post("http://localhost:3001/make-call", {
        phoneNumber,
      });

      console.log(res.data);
      setStatus("call initiated");
    } catch (err) {
      console.error(err);
      setStatus("call failed");
    }
  };

  

  return (
    <div>
      <button
        onClick={handleCall}
        className="bg-green-600 text-white px-4 py-2 rounded mr-2 ml-3"
      >
        Call {phoneNumber}
      </button>

      <button
        
        className="bg-red-600 text-white px-4 py-2 rounded mr-2"
      >
        Hang Up
      </button>

      <button
        onClick={() => setShowSms(!showSms)}
        className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
      >
        SMS
      </button>

      {showSms && (
        <SmsReminder phone={phoneNumber} company={company} />
      )}

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-4 py-2 rounded mr-2"
      >
        WhatsApp
      </a>

      {/* Demand Letter */}
      <button
        onClick={openDemandLetter}
        className="bg-red-600 text-white px-4 py-2 rounded mr-2"
      >
        Demand Letter
      </button>

      {/* MODAL */}
      <DemandLetter
        show={showModal}
        onClose={() => setShowModal(false)}
        data={{
          customerName: lead?.name || "N/A",
          email: lead?.email || "N/A",
          accountNo: lead?.account_number || "N/A",
          amount: lead?.balance || "0",
        }}
      />

      <p>Status: {status}</p>
    </div>
  );
}
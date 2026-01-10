import React, { useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";
import axios from "axios";

export default function CallButton({ phoneNumber, agentId }) {
  const [device, setDevice] = useState(null);
  const [status, setStatus] = useState("disconnected");

  useEffect(() => {
    const initTwilio = async () => {
      try {
        const res = await axios.get("http://localhost:3001/token", {
          params: { identity: agentId || "agent001" },
        });
        const token = res.data.token;

        // Create a new Twilio Device
        const twilioDevice = new Device(token, {
          debug: true,
          enableRingingState: true,
        });

        // Event handlers
        twilioDevice.on("registered", () => setStatus("ready"));
        twilioDevice.on("error", (err) => console.error("Twilio error:", err));
        twilioDevice.on("connect", () => setStatus("in call"));
        twilioDevice.on("disconnect", () => setStatus("ready"));
        twilioDevice.on("incoming", (conn) => {
          console.log("Incoming call:", conn.parameters.From);
        });

        setDevice(twilioDevice);
      } catch (error) {
        console.error("Failed to initialize Twilio:", error);
      }
    };

    initTwilio();
  }, [agentId]);

  const handleCall = () => {
    if (!device) return;
    device.connect({ params: { To: phoneNumber } });
  };

  const handleHangup = () => {
    if (!device) return;
    device.disconnectAll();
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
        onClick={handleHangup}
        className="bg-red-600 text-white px-4 py-2 rounded mr-2"
      >
        Hang Up
      </button>
      <button
        onClick={handleHangup}
        className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
      >
        SMS
      </button>
      <a
        href="https://wa.me/254796154129?text=Hello,%20I%20am%20interested%20in%20your%20services."
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success bg-green-600 text-white px-4 py-2 rounded d-flex align-items-center mr-2"
      >
        <i className="bi bi-whatsapp me-2"></i>
        WhatsApp Us
      </a>
      <button
        onClick={handleHangup}
        className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
      >
        Email
      </button>
      <button
        onClick={handleHangup}
        className="bg-black text-white px-4 py-2 rounded mr-2"
      >
        Statement
      </button>
      <button
        onClick={handleHangup}
        className="bg-black text-white px-4 py-2 rounded mr-2"
      >
        Debt Card
      </button>
      <button
        onClick={handleHangup}
        className="bg-red-600 text-white px-4 py-2 rounded mr-2"
      >
        Demand Letter
      </button>

      <p>Status: {status}</p>
    </div>
  );
}

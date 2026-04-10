import { useState } from "react";
import axios from "axios";

export default function SmsReminder({ phone, company }) {
  const [message, setMessage] = useState("");

  const sendSms = async () => {
    if (!phone) {
      alert("Phone number is missing!");
      return;
    }

    // Make sure the phone number starts with '+'
    let formattedPhone = phone.toString().trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+" + formattedPhone;
    }

    try {
      console.log("Sending SMS to:", formattedPhone, "Message:", message);

      await axios.post("http://localhost:3001/send-sms", {
        phone: formattedPhone,
        message
      });

      alert("SMS sent successfully");
    } catch (error) {
      console.error("SMS ERROR:", error.response?.data || error);
      alert("SMS failed");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-3">Send SMS Reminder</h2>
      <p className="mb-2">Debtor: {company}</p>

      <textarea
        className="border p-2 w-full mb-3"
        rows="4"
        placeholder="Type reminder message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={sendSms}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send Reminder
      </button>
    </div>
  );
}
import { useState } from "react";
import axios from "axios";

export default function PromiseToPay({ leadId }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:3001/promise-to-pay",
        {
          lead_id: leadId,
          promised_amount: amount,
          promised_date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Promise to pay logged successfully");

      setAmount("");
      setDate("");
    } catch (error) {
      console.error("Error saving PTP:", error);
    }
  };

  return (
    <div className="bg-white rounded-[10px] shadow border-b-4 border-blue-400">
      <h2 className="p-3 text-lg font-semibold mb-4">Promise to pay</h2>

      <div className="flex flex-col items-start justify-between p-5 border-b border-gray-200">
        <p>PTP AMOUNT</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-1 rounded-[5px] w-[70%]"
        />
      </div>

      <div className="flex flex-col items-start justify-between p-3 border-b border-gray-200">
        <p>PTP Date</p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-1 rounded-[5px] w-[70%]"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 rounded-[6px] mt-3 text-white ml-3 p-2"
      >
        Log Promise to Pay
      </button>
    </div>
  );
}

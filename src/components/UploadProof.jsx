import { useState } from "react";
import axios from "axios";

export default function UploadProof({ leadId, refreshLead }) {

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async () => {

    const formData = new FormData();
    formData.append("amount_paid", amount);
    formData.append("payment_date", date);
    formData.append("proof", file);

    try {

      await axios.put(
        `http://localhost:3001/leads/payment/${leadId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Payment uploaded successfully");

      setAmount("");
      setDate("");
      setFile(null);

      refreshLead(); // refresh profile data

    } catch (error) {
      console.error("Upload error", error);
    }
  };

  return (
    <div className="row-start-2 col-start-4 row-start-2 bg-white rounded-[10px] shadow p-4 border-b-4 border-blue-400">

      <h1 className="p-3 font-bold text-lg border-b">
        Upload Proof of Payment
      </h1>

      <div className="space-y-4 p-2">

        <div>
          <p className="font-medium mb-1">Payment amount (Ksh):</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <p className="font-medium mb-1">Payment date:</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <p className="font-medium mb-1">Upload POP:</p>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white rounded-[6px] p-3 w-full"
        >
          Upload POP
        </button>

      </div>
    </div>
  );
}
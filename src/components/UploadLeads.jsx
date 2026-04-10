import { useState } from "react";
import axios from "axios";

export default function UploadLeads() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:3001/upload-leads",
        formData
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-3">Upload Leads</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {result && (
        <div className="mt-4">
          <p>Total: {result.total}</p>
          <p className="text-green-600">Success: {result.success}</p>
          <p className="text-red-600">Failed: {result.failed}</p>
        </div>
      )}
    </div>
  );
}
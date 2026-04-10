import { useEffect, useState } from "react";
import axios from "axios";
import MonthlyPaymentReports from "./MonthlyPaymentReports";

export default function Reports() {
  const [reportData, setReportData] = useState({
    totalClients: 0,
    totalLoans: 0,
    totalCollected: 0,
    outstandingBalance: 0,
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3001/reports");
      setReportData(res.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const exportCSV = () => {
    const data = [
      ["Metric", "Value"],
      ["Total Clients", reportData.totalClients],
      ["Total Loans", reportData.totalLoans],
      ["Total Collected", reportData.totalCollected],
      ["Outstanding Balance", reportData.outstandingBalance],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "system_report.csv";
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="overflow-auto h-full p-4">
      
      <h2 className="text-2xl font-bold mb-6">System Reports</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-gray-500">Total Clients</h3>
          <p className="text-xl font-bold">{reportData.totalClients}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3 className="text-gray-500">Total Loans</h3>
          <p className="text-xl font-bold">{reportData.totalLoans}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3 className="text-gray-500">Total Collected</h3>
          <p className="text-xl font-bold">
            KES {reportData.totalCollected}
          </p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3 className="text-gray-500">Outstanding Balance</h3>
          <p className="text-xl font-bold text-red-500">
            KES {reportData.outstandingBalance}
          </p>
        </div>

      </div>

      <button
        onClick={exportCSV}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Export Report (CSV)
      </button>

    <MonthlyPaymentReports />
    </div>
  );
}
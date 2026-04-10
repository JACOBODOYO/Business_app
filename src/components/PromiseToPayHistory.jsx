import { useEffect, useState } from "react";
import axios from "axios";

export default function PromiseToPayHistory({ leadId }) {
  const [ptpList, setPtpList] = useState([]);

  useEffect(() => {
    fetchPTP();
  }, [leadId]);

  const fetchPTP = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:3001/promise-to-pay/${leadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPtpList(res.data);
    } catch (error) {
      console.error("Error fetching PTP:", error);
    }
  };

  return (
    <div className="bg-white shadow rounded-[10px] mt-4 border-b-4 border-blue-400">
      <h2 className="p-3 font-semibold border-b">Promise To Pay History</h2>

      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Promise Date</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {ptpList.map((ptp) => (
            <tr key={ptp.id} className="border-t">
              <td className="p-2">{ptp.amount}</td>
              <td className="p-2">{ptp.promise_date}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    ptp.status === "paid"
                      ? "bg-green-500"
                      : ptp.status === "broken"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {ptp.status || "pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
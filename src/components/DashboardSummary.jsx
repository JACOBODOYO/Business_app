import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export default function DashboardSummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:3001/dashboard-summary");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching dashboard summary", err);
    }
  };

  if (!data) return <p className="p-4">Loading summary...</p>;

  const portfolio = Number(data.portfolio.total_portfolio || 0);
  const collected = Number(data.portfolio.total_collected || 0);
  const today = Number(data.today.today_collections || 0);

  const progress = portfolio ? (collected / portfolio) * 100 : 0;

  return (
    <div className="grid grid-cols-4 gap-6 mb-6 pl-4 pr-4">

      {/* Total Portfolio */}
      <div className="bg-white p-4 rounded-lg shadow border-b-4 border-blue-400">
        <p className="text-gray-500">Total Portfolio</p>
        <h2 className="text-2xl font-bold">
          Ksh {portfolio.toLocaleString()}
        </h2>
      </div>

      {/* Total Collected */}
      <div className="bg-white p-4 rounded-lg shadow border-b-4 border-blue-400">
        <p className="text-gray-500">Total Collected</p>
        <h2 className="text-2xl font-bold text-green-600">
          Ksh {collected.toLocaleString()}
        </h2>
      </div>

      {/* Today's Collections */}
      <div className="bg-white p-4 rounded-lg shadow border-b-4 border-blue-400">
        <p className="text-gray-500">Today's Collections</p>
        <h2 className="text-2xl font-bold text-blue-600">
          Ksh {today.toLocaleString()}
        </h2>
      </div>

      {/* Collection Progress */}
      <div className="bg-white p-4 rounded-lg shadow border-b-4 border-blue-400">
        <p className="text-gray-500 mb-2">Collection Progress</p>

        <div className="w-full bg-gray-200 h-4 rounded">
          <div
            className="bg-green-500 h-4 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="mt-2 text-sm">{progress.toFixed(1)}%</p>
      </div>

      {data && (
  <LineChart width={700} height={300} data={data.daily}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="payment_date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="total" stroke="#2563eb" />
  </LineChart>
)}

    </div>
  );
}
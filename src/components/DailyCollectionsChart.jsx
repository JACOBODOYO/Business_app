import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function DailyCollectionsChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:3001/dashboard/daily-collections")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));

  }, []);

  return (

    <div className="bg-white p-4 rounded shadow border-b-4 border-blue-400">

      <h2 className="font-bold mb-3">
        Daily Collections
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="payment_date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#4f46e5"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );
}
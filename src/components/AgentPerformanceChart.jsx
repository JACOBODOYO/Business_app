import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function AgentPerformanceChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:3001/dashboard/agent-performance")
      .then((res) => setData(res.data));

  }, []);

  return (

    <div className="bg-white p-4 rounded shadow border-b-4 border-blue-400">

      <h2 className="font-bold mb-3">
        Agent Performance
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="total_collected" fill="#22c55e" />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
}
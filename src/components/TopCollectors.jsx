import { useEffect, useState } from "react";
import axios from "axios";

export default function TopCollectors() {

  const [collectors, setCollectors] = useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:3001/dashboard/top-collectors")
      .then((res) => setCollectors(res.data))
      .catch((err) => console.error("Leaderboard error:", err));

  }, []);

  return (

    <div className="bg-white rounded-[10px] shadow p-4 m-4 border-b-4 border-blue-400">
      Daily report of top performing collectors based on total collections for the current month. This helps identify high performers and areas for improvement.
      <h2 className="font-bold text-lg mb-4">
        🏆  Collectors Performance 
      </h2>

      {collectors.length === 0 ? (
        <p className="text-gray-500">No collection data yet</p>
      ) : (

        collectors.map((collector, index) => (

          <div
            key={collector.id}
            className="flex justify-between border-b py-2"
          >

            <p className="font-medium">
              {index + 1}. {collector.name}
            </p>

            <p className="text-green-600 font-semibold">
              Ksh {Number(collector.total).toLocaleString()}
            </p>

          </div>

        ))

      )}

    </div>
  );
}
import { useEffect, useState } from "react";
import axios from "axios";

export default function ActivityTimeline({ leadId }) {

  const [activities, setActivities] = useState([]);

  useEffect(() => {

    if (!leadId) return;

    axios
      .get(`http://localhost:3001/leads/${leadId}/activity`)
      .then((res) => setActivities(res.data))
      .catch((err) => console.error("Activity error:", err));

  }, [leadId]);

  const getIcon = (type) => {

    if (type === "payment") return "💰";
    if (type === "followup") return "📞";
    if (type === "note") return "📝";

    return "📌";
  };

  return (

    <div className="bg-white rounded-[10px] p-4 m-4 border-b-4 border-blue-400">

      <h2 className="font-bold mb-4">
        Account Activity Timeline
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-500">
          No activity yet
        </p>
      ) : (

        activities.map((item, index) => (

          <div
            key={index}
            className="flex gap-3 border-b py-3"
          >

            <div className="text-xl">
              {getIcon(item.type)}
            </div>

            <div>

              <p className="font-medium">
                {item.description}
              </p>

              {item.amount && (
                <p className="text-green-600">
                  Ksh {Number(item.amount).toLocaleString()}
                </p>
              )}

              <p className="text-gray-500 text-sm">
                {new Date(item.date).toLocaleDateString()}
              </p>

            </div>

          </div>

        ))

      )}

    </div>
  );
}
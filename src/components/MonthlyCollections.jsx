import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function MonthlyCollections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${API}/monthly-collections`);
      setCollections(res.data);
    } catch (error) {
      console.error("Error fetching collections", error);
    }
  };

  return (
    <div className="px-2 sm:px-4 py-4">
      <div className="bg-white rounded-xl shadow border-b-4 border-blue-400 p-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="font-semibold text-lg">
            MONTHLY COLLECTIONS
          </h2>

          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Show details
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] border">
            <thead>
              <tr>
                <th className="border bg-gray-300 p-3 text-left">
                  USERS
                </th>
                <th className="border bg-gray-300 p-3 text-left">
                  AMOUNT COLLECTED
                </th>
              </tr>
            </thead>

            <tbody>
              {collections.map((item, index) => (
                <tr key={index}>
                  <td className="border p-3">
                    {item.name}
                  </td>

                  <td className="border p-3">
                    KES{" "}
                    {Number(item.total_collected).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
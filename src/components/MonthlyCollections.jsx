import { useEffect, useState } from "react";
import axios from "axios";

export default function MonthlyCollections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await axios.get("http://localhost:3001/monthly-collections");
      setCollections(res.data);
    } catch (error) {
      console.error("Error fetching collections", error);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0 ">
      <div className="bg-white rounded-[10px] m-5 h-auto pb-6 border-b-4 border-blue-400">
        <div className="flex flex-row mt-5 ml-5">
          <p className="mr-4 font-semibold">MONTHLY COLLECTIONS</p>
          <p className="text-blue-600 hover:text-blue-800 cursor-pointer">
            Show details
          </p>
        </div>

        <table className="ml-7 mt-8 w-2/3 border">
          <thead>
            <tr>
              <th className="border bg-gray-300 h-12 pl-4 text-start">
                USERS
              </th>
              <th className="border bg-gray-300 h-12 pl-4 text-start">
                AMOUNT COLLECTED
              </th>
            </tr>
          </thead>

          <tbody>
            {collections.map((item, index) => (
              <tr key={index} className="border">
                <td className="pl-4 py-2">{item.name}</td>
                <td className="pl-4 py-2">
                  {Number(item.total_collected).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
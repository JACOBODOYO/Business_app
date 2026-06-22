import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function Overdue() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOverdueLeads = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .lt("next_followup", today) // overdue only
          .order("next_followup", { ascending: true });

        if (error) throw error;

        setLeads(data || []);
      } catch (err) {
        console.error("Error fetching overdue leads:", err);
      }
    };

    fetchOverdueLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const regex = new RegExp(searchTerm, "i");
    return Object.values(lead).some((value) =>
      regex.test(String(value || ""))
    );
  });

  return (
    <div>
      <p>Total overdue followups: {filteredLeads.length}</p>

      <hr className="border-t-2 border-gray-300 my-4" />

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border-b border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1200px] divide-y divide-gray-200">
          <thead className="bg-red-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Next Follow Up</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Balance</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-100">
                <td className="px-6 py-4">
                  <Link
                    to={`/profile/${lead.id}`}
                    className="text-blue-600"
                  >
                    {lead.company}
                  </Link>
                </td>

                <td className="px-6 py-4">{lead.title}</td>

                <td className="px-6 py-4">{lead.phone}</td>

                <td className="px-6 py-4 text-red-600 font-semibold">
                  {new Date(lead.next_followup).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  {Number(lead.amount).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {(
                    Number(lead.amount) -
                    Number(lead.amount_paid || 0)
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
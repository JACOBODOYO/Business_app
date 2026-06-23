import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DueToday() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState(10);
  const API = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();



        const response = await axios.get(`${API}/leads/due-today`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const today = new Date().toLocaleDateString("en-CA"); // gives YYYY-MM-DD

        const normalizeDate = (dateString) => {
          if (!dateString) return null;
          return dateString.split("T")[0];
        };

        const dueToday = response.data.filter(
          (lead) => normalizeDate(lead.next_followup) === today
        );

        const sorted = dueToday.sort((a, b) =>
          a.company.localeCompare(b.company)
        );

        setLeads(sorted);
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    fetchLeads();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLeads = leads.filter((lead) => {
    const regex = new RegExp(searchTerm, "i");

    return Object.values(lead).some((value) =>
      regex.test(String(value ?? ""))
    );
  });

  const displayedLeads = filteredLeads.slice(0, entries);


  return (
    <div>

      <p>Total Due Today: {leads.length}</p>

      <p>
        Total pipeline amount:{" "}
        {leads
          .reduce((acc, lead) => acc + Number(lead.amount), 0)
          .toLocaleString("en-KE", {
            style: "currency",
            currency: "KES",
          })}
      </p>

      <hr className="border-t-2 border-gray-300 my-4" />

      <select
        className="border mb-4"
        value={entries}
        onChange={(e) => setEntries(Number(e.target.value))}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>

      <div className="flex justify-end mb-4">
        <p className="mr-2">Search</p>
        <input
          type="text"
          placeholder="search"
          className="border-b border-gray-600"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="h-96 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="hidden px-6 py-3 text-xs uppercase">#</th>
              <th className="px-6 py-3 text-xs uppercase">Company</th>
              <th className="px-6 py-3 text-xs uppercase">Title</th>
              <th className="px-6 py-3 text-xs uppercase">Phone</th>
              <th className="px-6 py-3 text-xs uppercase">Mail</th>
              <th className="px-6 py-3 text-xs uppercase">Address</th>
              <th className="px-6 py-3 text-xs uppercase">Deal Stage</th>
              <th className="px-6 py-3 text-xs uppercase">Product</th>
              <th className="px-6 py-3 text-xs uppercase">Tags</th>
              <th className="px-6 py-3 text-xs uppercase">Interest</th>
              <th className="px-6 py-3 text-xs uppercase">Probability</th>
              <th className="px-6 py-3 text-xs uppercase">Username</th>
              <th className="px-6 py-3 text-xs uppercase">Next Followup</th>
              <th className="px-6 py-3 text-xs uppercase">Next Activity</th>
              <th className="px-6 py-3 text-xs uppercase">Amount</th>
              <th className="px-6 py-3 text-xs uppercase">Amount Paid</th>
              <th className="px-6 py-3 text-xs uppercase">Balance</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {displayedLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-200">

                <td className="hidden px-6 py-4">{lead.id}</td>

                <td className="px-6 py-4 text-blue-800">
                  <Link to={`/profile/${lead.id}`}>{lead.company}</Link>
                </td>

                <td className="px-6 py-4">{lead.title}</td>

                <td className="px-6 py-4">{lead.phone}</td>

                <td className="px-6 py-4">{lead.mail}</td>

                <td className="px-6 py-4">{lead.address}</td>

                <td className="px-6 py-4">{lead.deal_stage}</td>

                <td className="px-6 py-4">{lead.product}</td>

                <td className="px-6 py-4">{lead.tags}</td>

                <td className="px-6 py-4">{lead.interest}</td>

                <td className="px-6 py-4">{lead.probability}</td>

                <td className="px-6 py-4">{lead.username}</td>

                <td className="px-6 py-4">
                  {new Date(lead.next_followup).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">{lead.next_activity}</td>

                <td className="px-6 py-4">
                  {Number(lead.amount).toLocaleString("en-KE", {
                    style: "currency",
                    currency: "KES",
                  })}
                </td>

                <td className="px-6 py-4">
                  {Number(lead.amount_paid).toLocaleString("en-KE", {
                    style: "currency",
                    currency: "KES",
                  })}
                </td>

                <td className="px-6 py-4">
                  {(
                    Number(lead.amount || 0) -
                    Number(lead.amount_paid || 0)
                  ).toLocaleString("en-KE", {
                    style: "currency",
                    currency: "KES",
                  })}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
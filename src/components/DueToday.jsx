import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DueToday() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:3001/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const today = new Date().toLocaleDateString("en-CA"); // gives YYYY-MM-DD

        const normalizeDate = (dateString) => {
          if (!dateString) return null;
          return new Date(dateString).toISOString().split("T")[0];
        };

        const dueToday = response.data.filter(
  (lead) => lead.next_followup === today
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
    return Object.values(lead).some((value) => regex.test(value));
  });

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

      <p>
        Show{" "}
        <select className="border">
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>{" "}
        entries
      </p>

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
            {filteredLeads.map((lead) => (
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

                <td className="px-6 py-4">{lead.amount}</td>

                <td className="px-6 py-4">{lead.amount_paid}</td>

                <td className="px-6 py-4">
                  {lead.amount - lead.amount_paid}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import DueToday from "./DueToday";
import { Link } from "react-router-dom";
import Profile from "./Profile";

export default function AllOpen() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dueTodayLeads, setDueTodayLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get("http://localhost:3001/leads/");
        const sortedData = response.data.sort((a, b) =>
          a.company.localeCompare(b.company)
        );
        setLeads(sortedData);

        const today = new Date().toISOString().split("T")[0];
        const dueToday = sortedData.filter(
          (lead) => lead.next_followup === today
        );
        setDueTodayLeads(dueToday);
      } catch (error) {
        console.error("Error fetching data:", error);
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
      <p>Total open Leads: {leads.length}</p>
      <p>
        Total pipeline amount: KSH{" "}
        {leads.reduce((acc, lead) => acc + lead.amount, 0).toLocaleString()}
      </p>
      <hr className="border-t-2 border-gray-300 my-4" />

      <p>
        Show{" "}
        <select className="border">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
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
      <div className="bg-gray-800 h-96 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 h-100 w-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deal Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Probability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Followup
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount Paid
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-6 py-4 whitespace-nowrap text-blue-800">
                  {lead.id}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  <Link to={`/profile/${lead.id}`}>{lead.company}</Link>{" "}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.title}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.phone}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.mail}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.address}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.deal_stage}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.product}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.tags}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.interest}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.probability}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.username}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.next_followup}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.next_activity}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.amount}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-800
                "
                >
                  {lead.amount_paid}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*{dueTodayLeads && <DueToday leads={dueTodayLeads} />} {/* Ensure dueTodayLeads is passed */}
    </div>
  );
}

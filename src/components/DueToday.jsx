import React from "react";
import { json, Link } from "react-router-dom";

export default function DueToday({ leads = [] }) {
  return (
    <>
      <p>Due Today: {leads.length}</p>

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

      <div className="h-96 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 h-100 w-100">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Deal Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Interest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Probability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Next Followup
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Next Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Amount Paid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-200">
                <td className="hidden px-6 py-4 whitespace-nowrap text-blue-800">
                  {lead.id}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-blue-800">
                  <Link to={`/profile/${lead.id}`}>{lead.company}</Link>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.title}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.phone}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.mail}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.address}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.deal_stage}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.product}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.tags}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.interest}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.probability}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.username}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.next_followup}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.next_activity}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.amount}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.amount_paid}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.amount - lead.amount_paid}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

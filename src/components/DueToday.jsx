import React from "react";

export default function DueToday({ leads = [] }) { // Add default value
  return (
    <>
      <p>Due Today : {leads.length}</p>

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

      <div className="bg-gray-800 h-96 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-6 py-4 whitespace-nowrap">{lead.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

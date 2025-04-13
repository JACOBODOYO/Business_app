import { useEffect, useState } from "react";
import axios from "axios";

export default function SearchLeads() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);

  const clients = ["Freshtake Investment", "Konekt", "JAFARI CREDIT",'Platinum'];

  useEffect(() => {
    // Fetch all leads once
    axios
      .get("http://localhost:3001/leads")
      .then((res) => setLeads(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleClientClick = (client) => {
    setSelectedClient(client === selectedClient ? null : client);
    const matchedLeads = leads.filter(
      (lead) => lead.company.toLowerCase() === client.toLowerCase()
    );
    setFilteredLeads(matchedLeads);
  };

  return (
    <div className="overflow-auto h-full p-4">
      <header className="bg-white shadow mb-4">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-gray-200 rounded-lg min-h-96 p-4">
            <div className="flex flex-col space-y-3">
              <p className="text-lg font-semibold">Clients</p>
              {clients.map((client, index) => (
                <p
                  key={index}
                  onClick={() => handleClientClick(client)}
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  {client}
                </p>
              ))}
            </div>

            {selectedClient && filteredLeads.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">
                  {selectedClient} Details
                </h2>
                <table className="min-w-full divide-y divide-gray-200 border text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Principle</th>
                      <th className="px-4 py-2">Duration</th>
                      <th className="px-4 py-2">Commision</th>
                      <th className="px-4 py-2">Debit</th>
                      <th className="px-4 py-2">Credit</th>
                      <th className="px-4 py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="px-4 py-2">{lead.title}</td>
                        <td className="px-4 py-2">{lead.amount}</td>
                        <td className="px-4 py-2">3 months</td>
                        <td className="px-4 py-2">{lead.interest}</td>
                        <td className="px-4 py-2">{lead.amount_paid}</td>
                        <td className="px-4 py-2">{lead.amount}</td>
                        <td className="px-4 py-2">
                          {lead.amount - lead.amount_paid}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedClient && filteredLeads.length === 0 && (
              <p className="mt-4 text-red-600">No leads found for this client.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

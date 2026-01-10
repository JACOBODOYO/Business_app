import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function SearchLeads() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);

  const [clients, setClients] = useState([
    "Freshtake Investment",
    "Konekt",
    "JAFARI CREDIT",
    "Platinum",
    "STIMA SACCO M-PAWA"
  ]);

  const [newClientName, setNewClientName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/leads")
      .then((res) => setLeads(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleClientClick = (client) => {
    const newSelection = client === selectedClient ? null : client;
    setSelectedClient(newSelection);
    const matchedLeads = leads.filter(
      (lead) => lead.company.toLowerCase() === client.toLowerCase()
    );
    setFilteredLeads(newSelection ? matchedLeads : []);
  };

  useEffect(() => {
  axios.get("http://localhost:3001/clients")
    .then(res => setClients(res.data.map(c => c.name)))
    .catch(console.error);
}, []);

const handleAddClient = async (newClient) => {
  if (!newClient) return;
  try {
    const res = await axios.post("http://localhost:3001/clients", { name: newClient });
    setClients(prev => [...prev, res.data.name]);
  } catch (err) {
    console.error("Failed to add client:", err);
  }
};


  // Add a new client to the list
  

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(num);

  const getTotalPaid = () => {
    return filteredLeads.reduce(
      (total, lead) => total + Number(lead.amount_paid),
      0
    );
  };

  const getTotalBalance = () => {
    return filteredLeads.reduce(
      (total, lead) => total + (Number(lead.amount) - Number(lead.amount_paid)),
      0
    );
  };
  const getPaymentPercentage = () => {
    const totalAmount = filteredLeads.reduce(
      (sum, lead) => sum + Number(lead.amount),
      0
    );
    const totalPaid = getTotalPaid();
    if (totalAmount === 0) return "0%";
    const percentage = (totalPaid / totalAmount) * 100;
    return `${percentage.toFixed(2)}%`;
  };
  const getTotalCommission = () => {
    return filteredLeads.reduce((total, lead) => {
      const commissionRate = Number(lead.interest) / 100; // e.g., 4% becomes 0.04
      const paidAmount = Number(lead.amount_paid);
      return total + paidAmount * commissionRate;
    }, 0);
  };

  const exportToExcel = () => {
    const data = filteredLeads.map((lead) => ({
      Name: lead.title,
      Principal: lead.amount,
      Paid: lead.amount_paid,
      Balance: lead.amount - lead.amount_paid,
      CommissionRate: `${lead.interest}%`,
      EarnedCommission: (lead.amount_paid * (lead.interest / 100)).toFixed(2),
    }));

    // Add totals row
    data.push({
      Name: "TOTALS",
      Principal: getTotalPaid() + getTotalBalance(),
      Paid: getTotalPaid(),
      Balance: getTotalBalance(),
      CommissionRate: "",
      EarnedCommission: getTotalCommission().toFixed(2),
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${selectedClient} Summary`
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `${selectedClient}_leads_summary.xlsx`);
  };

  return (
    <div className="overflow-auto h-full p-4 bg-blue-400">
      <main className="max-w-7xl mx-auto">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-gray-200  rounded-lg min-h-96 p-4">
            {/* Add New Client */}
            <div className="flex mb-4 gap-2">
              <input
                type="text"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Enter new client name"
                className="p-2 border rounded w-full"
              />
              <button
                onClick={handleAddClient}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Client
              </button>
              
            </div>
            <div className="flex flex-col rounded-lg p-3 bg-white space-y-3 mb-4">
              <p className="text-lg font-semibold">Clients</p>
              {clients.map((client, index) => (
                <p
                  key={index}
                  onClick={() => handleClientClick(client)}
                  className={`px-2 py-1 rounded-md w-fit cursor-pointer transition duration-200 hover:-translate-y-1 ${
                    selectedClient === client
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  {client}
                </p>
              ))}

              
            </div>

            {selectedClient ? (
              filteredLeads.length > 0 ? (
                <div className="mt-6">
                  <div className="bg-white mb-5 rounded-[5px] p-3">
                    <h2 className="text-xl font-bold mb-2 cursor-pointer transform transition duration-200 hover:-translate-y-1">
                      {selectedClient} Details:
                    </h2>
                    <div className="grid grid-cols-3">
                      <div>Email:</div>
                      <div>Phone:</div>
                      <div>Location:</div>
                      <div>Postal Address:</div>
                      <div>Account Number:</div>
                      <div>Contract status:</div>
                      <div>Pay bill number:</div>
                      <div>Till number:</div>
                      <div>Commision rate:</div>
                      <div>Contract start date:</div>
                      <div>Contact status:</div>
                      <div>Total Amount:</div>
                      <div>Amount Payed to date:</div>
                      <div>Balance:</div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border text-left">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1 hover:opacity-200">
                            Name
                          </th>
                          <th className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1 hover:opacity-80">
                            Principal
                          </th>
                          <th className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1 hover:opacity-80">
                            Duration
                          </th>
                          <th className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1 hover:opacity-80">
                            Commission
                          </th>
                          <th className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1 hover:opacity-80">
                            Debit
                          </th>
                          <th className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1 hover:opacity-80">
                            Credit
                          </th>
                          <th className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1 hover:opacity-80">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead, idx) => (
                          <tr
                            key={lead.id}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1">
                              {lead.title}
                            </td>
                            <td className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1">
                              {formatCurrency(lead.amount)}
                            </td>
                            <td className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1">
                              3 months
                            </td>
                            <td className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1">
                              {lead.interest}%
                            </td>
                            <td className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1">
                              {formatCurrency(lead.amount_paid)}
                            </td>
                            <td className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1">
                              {formatCurrency(lead.amount)}
                            </td>
                            <td className="px-4 py-2 cursor-pointer transform transition duration-200 hover:-translate-y-1">
                              {formatCurrency(lead.amount - lead.amount_paid)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-4 text-right font-semibold text-green-700">
                      Total Paid by {selectedClient}:{" "}
                      {formatCurrency(getTotalPaid())}
                    </div>
                    <div className="text-right font-semibold text-red-600">
                      Total Balance for {selectedClient}:{" "}
                      {formatCurrency(getTotalBalance())}
                    </div>
                    <div className="text-right font-semibold text-blue-600">
                      Payment Completion: {getPaymentPercentage()}
                    </div>
                    <div className="font-semibold text-purple-600">
                      Total Commission Earned:{" "}
                      {formatCurrency(getTotalCommission())}
                    </div>

                    <button
                      onClick={exportToExcel}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Export to Excel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-red-600">
                  No leads found for this client.
                </p>
              )
            ) : (
              <p className="mt-4 text-gray-500 italic">
                Please select a client to view details.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

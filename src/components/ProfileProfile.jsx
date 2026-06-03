import axios from "axios";
import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL;
import { useParams, useResolvedPath } from "react-router-dom";
import CallButton from "./CallButton";
import UploadProof from "./UploadProof";
import PaymentHistory from "./PaymentHistory";

export default function ProfileProfile() {
  const [leads, setLeads] = useState([]);
  const { leadId } = useParams();
  const [refreshPayments, setRefreshPayments] = useState(0);

  const lead = leads[0];

  const handleRefreshPayments = () => {
    setRefreshPayments((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${API}/leads/${leadId}`);
        setLeads([response.data]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeads();
  }, [leadId]);

  if (leads.length === 0) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      
      {/* HEADER SECTION */}
      <div className="col-span-1 lg:col-span-4 bg-white rounded-lg border-b-4 border-blue-400 p-4">
        <h2 className="text-lg font-bold">{lead.title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 text-sm">
          <p>Client: {lead.company}</p>
          <p>Total Debt: {lead.amount}</p>
          <p>
            Balance: {Number(lead.amount) - Number(lead.amount_paid || 0)}
          </p>
          <p>Email: {lead.mail}</p>
          <p>Phone: {lead.phone}</p>
        </div>

        <div className="mt-4">
          <CallButton
            phoneNumber={lead?.phone}
            company={lead?.company}
            agentId={lead?.id}
            lead={lead}
          />
        </div>
      </div>

      {/* PERSONAL INFO */}
      <div className="col-span-1 lg:col-span-3 bg-white rounded-lg border-b-4 border-blue-400 p-4">
        <h1 className="font-bold text-lg mb-3">Personal Info</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <p>Full Name: {lead.title}</p>
          <p>Client: {lead.company}</p>
          <p>Phone: {lead.phone}</p>
          <p>Email: {lead.mail}</p>
          <p>Address: {lead.address}</p>
          <p>Agent: {lead.agent_name || "Unassigned"}</p>
        </div>
      </div>

      {/* DEBTS */}
      <div className="col-span-1 lg:col-span-3 bg-white rounded-lg border-b-4 border-blue-400 p-4 overflow-x-auto">
        <h1 className="font-bold text-lg mb-3">Debts</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <p>Product: {lead.product}</p>
          <p>Debt Amount: {lead.amount}</p>
          <p>Address: {lead.address}</p>
        </div>
      </div>

      {/* UPLOAD + PAYMENTS */}
      <div className="col-span-1 lg:col-span-4">
        <UploadProof
          leadId={leadId}
          refreshLead={() => {
            handleRefreshPayments();
          }}
        />
      </div>

      <div className="col-span-1 lg:col-span-4">
        <PaymentHistory
          leadId={leadId}
          refreshKey={refreshPayments}
        />
      </div>

      {/* CALL RECORDS */}
      <div className="col-span-1 lg:col-span-4 bg-white rounded-lg border-b-4 border-blue-400 p-4 overflow-x-auto">
        <h1 className="font-bold mb-3">Call Records</h1>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Direction</th>
              <th className="p-2">Date</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-2">Outbound</td>
              <td className="p-2">2026-01-03</td>
              <td className="p-2">02:15</td>
              <td className="p-2">Answered</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* MESSAGE HISTORY */}
      <div className="col-span-1 lg:col-span-4 bg-white rounded-lg border-b-4 border-blue-400 p-4">
        <h1 className="font-bold mb-3">Message History</h1>

        <div className="flex flex-wrap gap-3">
          <div className="min-w-[120px] p-3 border rounded text-center">
            Total Messages
          </div>

          <div className="min-w-[120px] p-3 bg-green-100 text-green-600 rounded text-center">
            SMS
          </div>

          <div className="min-w-[120px] p-3 bg-blue-100 text-blue-600 rounded text-center">
            Email
          </div>

          <div className="min-w-[120px] p-3 bg-yellow-100 text-yellow-600 rounded text-center">
            WhatsApp
          </div>
        </div>
      </div>

      {/* EVENT LOGS */}
      <div className="col-span-1 lg:col-span-4 bg-white rounded-lg border-b-4 border-blue-400 p-4">
        <h1 className="font-bold mb-3">Event Logs</h1>
        <p className="text-sm text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
}
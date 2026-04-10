import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ProfileAccountDetails() {
  const [leads, setLeads] = useState([]);
  const { leadId } = useParams();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/leads/${leadId}`
        );
        console.log(response.data); // Log the response data for debugging
        console.log("Lead ID:", leadId);

        setLeads([response.data]); // Wrap in an array to maintain mapping
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchLeads();
  }, [leadId]);

  if (leads.length === 0) return <div>Loading...</div>;
  return (
    <div className="border-4 h-[500px] m-3 rounded">
      <h6>account details</h6>
      {leads.map((lead) => (
        <div key={lead.id}>
          <div className="flex gap-4 h-98">
            <div>loan ID: 00789</div>
            <div>loan Amount: {lead.amount}</div>
            <div>Duration</div>
          </div>
          <table className=" min-w-full divide-y divide-gray-200 h-100 w-100">
            <thead className="">
              <tr>
                <th className="">Principle Amount</th>
                <th>Duration</th>
                <th>Interest</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance to date</th>
              </tr>
            </thead>
            <tbody className="">
              <tr>
                <td className="text-center">{lead.amount}</td>
                <td className="text-center">3 months</td>
                <td className="text-center">{lead.interest}</td>
                <td className="text-center">{lead.amount_paid}</td>
                <td className="text-center">{lead.amount}</td>
                <td className="text-center">{lead.amount - lead.amount_paid}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

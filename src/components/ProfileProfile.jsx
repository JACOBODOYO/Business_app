import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProfileProfile() {
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
    <div className="flex w-[98%] rounded-lg gap-4 h-80% border-t mr-0 border-gray-500">
      <div className="w-[48%] h-[80%] mt-10 rounded border border-t-4 border-r-4 border-b-4 border-gray-300">
        <h1>Personal info</h1>
        {leads.map((lead) => (
          <div className="" key={lead.id}>
            <div className="flex gap-6 p-3">
              <p>Name: </p>
              <p>{lead.title}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Phone: </p>
              <p>{lead.phone}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Email: </p>
              <p>{lead.mail}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Job title: </p>
              <p>{lead.jobTitle}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Organization: </p>
              <p>{lead.company}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Address: </p>
              <p>{lead.address}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Website: </p>
              <p>{lead.website}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Created on: </p>
              <p>{new Date(lead.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-[48%] h-[80%] mt-10 rounded border border-t-4 border-r-4 border-b-4 border-gray-300">
        <h1>Lead info</h1>
        {leads.map((lead) => (
          <div key={lead.id}>
            <div className="flex gap-6 p-3">
              <p>Name: </p>
              <p>{lead.company}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>LEAD AMOUNT: </p>
              <p>{lead.amount}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Products: </p>
              <p>{lead.product}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Job title: </p>
              <p>{lead.company}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Organization: </p>
              <p>{lead.company}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Address: </p>
              <p>{lead.address}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Website: </p>
              <p>{lead.website}</p>
            </div>
            <div className="flex gap-6 p-3">
              <p>Created on: </p>
              <p>2023-03-03 00:00:00</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-[48%] h-[80%] mt-10 rounded border border-t-4 border-r-4 border-b-4 border-gray-300">
        <h1>Custom Leads</h1>
        <div className="flex gap-6 p-3">
          <p >PTP DATE (DD/MM/YYYY)</p>
          <p></p>
        </div>
        <div className="flex gap-6 p-3">
          <p >PTP AMOUNT(KSH)</p>
          <p></p>
        </div>
        <div className="flex gap-6 p-3">
          <p>Collection update</p>
          <p></p>
        </div>
        <div className="flex gap-6 p-3">
          <p>Collection fees</p>
          <p></p>
        </div>
        <div className="flex gap-6 p-3">
          <p>ID/PP NO</p>
          <p></p>
        </div>
        <div className="flex gap-6 p-3">
          <p>Collection update date</p>
        </div>
      </div>
    </div>
  );
}

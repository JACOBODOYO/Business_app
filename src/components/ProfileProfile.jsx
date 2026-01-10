import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CallButton from "./CallButton";

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
    <div className="grid grid-cols-4  p-4 md:grid-cols-2 lg:grid-cols-3 gap-6  mx-auto rounded-lg">
      <div className="col-span-4 bg-white rounded-[10px] border-b-4 border-blue-400">
        {leads.map((lead) => (
          <div key={lead.id} className="">
            <h2 className="text-lg font-bold p-3 ">{lead.title}</h2>
            <div className="grid grid-cols-2 pb-2">
              <p className="pl-3"> Client: {lead.company}</p>
              <p className="pl-3">Total Debt:{lead.amount}</p>
              <p className="pl-3">Balance: {lead.amount}</p>
            </div>
            <div className="grid grid-cols-3 ml-3 mb-3">
              <p>Email: {lead.mail}</p>
              <p> Phone: {lead.phone}</p>
              <p>Next follow up: </p>
            </div>
          </div>
        ))}

        <CallButton />
      </div>
      {/* Personal Info */}
      <div className="col-span-3 row-start-2 bg-white rounded-[10px] shadow p-4 border-b-4 border-blue-400">
        <h1 className="p-3 font-bold text-lg border-b">Personal info</h1>
        {leads.map((lead) => (
          <div className="grid grid-cols-3  gap-x-4 p-2" key={lead.id}>
            <div className="m-2">
              <p className="font-medium">Full Name:</p>
              <p>{lead.title}</p>
            </div>
            <div className="m-2">
              <p className="font-medium">Client:</p>
              <p>{lead.company}</p>
            </div>
            <div className="m-2">
              <p className="font-medium">ID:</p>
              <p>{lead.title}</p>
            </div>
            <div className="m-2">
              <p className="font-medium">Phone:</p>
              <p>{lead.phone}</p>
            </div>
            <div className="m-2">
              <p className="font-medium">Email:</p>
              <p>{lead.mail}</p>
            </div>
            <div className="m-2">
              <p className="font-medium">Job title:</p>
              <p>{lead.jobTitle}</p>
            </div>
            <div className="m-2">
              <p className="font-medium">Address:</p>
              <p>{lead.address}</p>
            </div>
            <div className="m-2">
              <p className="font-medium">Website:</p>
              <p>{lead.website}</p>
            </div>
            <div className="m-2">
              <p className="font-medium">Total Debt Amount:</p>
              <p>{lead.amount}</p>
            </div>
            <div className="m-2">
              <p className="font-medium">Total Payments:</p>
              <p>{lead.amount_paid}</p>
            </div>
            <div className="m-2">
              <p className="font-medium">Debt Balance:</p>
              <p></p>
            </div>
            <div className="m-2">
              <p className="font-medium">Assigned Agent:</p>
              <p>Jacob Odoyo</p>
            </div>
          </div>
        ))}
      </div>

      {/* Debts */}
      <div className="col-span-3 col-start-1 row-start-3 bg-white rounded-[10px] shadow p-4 border-b-4 border-blue-400">
        <h1 className="p-3 font-bold text-lg border-b">Debts</h1>
        {leads.map((lead) => (
          <div className="grid grid-cols-2 gap-x-4 p-2" key={lead.id}>
            <p className="font-medium">Product:</p>
            <p>{lead.company}</p>
            <p className="font-medium">Debt Amount:</p>
            <p>{lead.amount}</p>
            <p className="font-medium">Disbursement Date:</p>
            <p>{lead.product}</p>
            <p className="font-medium">Job title:</p>
            <p>{lead.company}</p>
            <p className="font-medium">Collection Rate:</p>
            <p>{lead.company}</p>
            <p className="font-medium">Address:</p>
            <p>{lead.address}</p>
            <p className="font-medium">Closure Probability:</p>
            <p>{lead.website}</p>
          </div>
        ))}
      </div>

      {/* PTP & Updates */}
      <div className="row-start-2 col-start-4 row-start-2 bg-white rounded-[10px] shadow p-4 border-b-4 border-blue-400">
        <h1 className="p-3 font-bold text-lg border-b">
          Upload Proof of Payment
        </h1>

        <div className="space-y-4 p-2">
          <div>
            <p className="font-medium mb-1">Payment amount (Ksh):</p>
            <input
              type="number"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>

          <div>
            <p className="font-medium mb-1">Payment date:</p>
            <input
              type="date"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>

          <div>
            <p className="font-medium mb-1">Upload POP:</p>
            <input
              type="file"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>
          <div className="item-center">
            <button className="bg-blue-500 item-center rounded-[6px] p-3">
              Upload Pop
            </button>
          </div>
        </div>
      </div>
      <div className="col-start-4 row-start-3 bg-white rounded-[10px] border-b-4 border-blue-400">
        <p className="font-bold text-lg">Payment History</p>
        <p>No payment history found for this debtor</p>
      </div>
      <div className=" col-span-3 col-start-1 row-start-4 bg-white rounded-[10px] shadow p-4 border-b-4 border-blue-400">
        <div className="flex justify-between">
          <p>Call Records </p>
          <p>1 call</p>
        </div>
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Direction</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Agent</th>
              <th className="px-4 py-2 text-left">Recording</th>
            </tr>
          </thead>

          <tbody>
            {/* example row */}
            <tr className="border-t">
              <td className="px-4 py-2">Outbound</td>
              <td className="px-4 py-2">2026-01-03</td>
              <td className="px-4 py-2">02:15</td>
              <td className="px-4 py-2">Answered</td>
              <td className="px-4 py-2">+254796123456</td>
              <td className="px-4 py-2">
                <button className="text-blue-500 underline">
                  Recording restricted
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className=" col-span-3 col-start-1 row-start-5 bg-white rounded-[10px] shadow p-4 border-b-4 border-blue-400">
          <div className="flex justify-between">
            <h1>Message History</h1>
            <p>EXPORT</p>
          </div>
          <div className="flex p-5">
            <p className="w-[100px] h-[100px]  border flex items-center rounded-[10px] justify-center pl-2 mr-3 bg-black-100"> total messages</p>
            <p className="w-[100px] h-[100px]  border flex items-center rounded-[10px] justify-center pl-2 mr-3 text-green-400 bg-green-100"> 4 SMS</p>
            <p className="w-[100px] h-[100px]  border flex items-center rounded-[10px] justify-center pl-2 mr-3 text-blue-400 bg-blue-100"> 3 Email</p>
            <p className="w-[100px] h-[100px]  border flex items-center rounded-[10px] justify-center pl-2 mr-3 text-green-400 bg-green-100"> 5 WhatsApp</p>
            <p className="w-[100px] h-[100px]  border flex items-center rounded-[10px] justify-center pl-2 mr-3 text-blue-400 bg-blue-100"> 4 Sent </p>
            <p className="w-[100px] h-[100px]  border flex items-center rounded-[10px] justify-center pl-2 mr-3 text-red-400 bg-red-100"> 5 Failed</p>
          </div>
      </div>
      <div className="col-start-4 row-start-4 bg-white rounded-[10px] border-b-4 border-blue-400">
        <h1>Event Logs</h1>
        <div className="flex justify-between p-5">
          <p>Action</p>
          <p>User Role</p>
          <p>Time Stamp</p>
        </div>
      </div>
    </div>
  );
}

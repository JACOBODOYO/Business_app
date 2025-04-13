import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


export default function DashBoard() {
  const [leads, setLeads] = useState([]);

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
  
  

  if (leads.length === 0) return <div>Loading...</div>;

  return (
    <div className="overflow-auto h-full pl-4 pr-4 ">
      <header className="bg-blue-100 shadow mb-4">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="border-4 border-gray-200 rounded-lg h-40 p-4 bg-yellow-600 flex flex-col justify-between">
              <p className="text-white text-4xl text-bold">{leads.length}</p>
              <p className="text-white">Total Leads</p>
              <Link
                to="/leads-management"
                className="text-white mt-auto self-center bg-yellow-400"
              >
                More info{" "}
              </Link>
            </div>
            <div className="border-4 border-gray-200 rounded-lg h-40 p-4 bg-blue-600 flex flex-col justify-between">
              <p className="text-white text-4xl text-bold">Ksh {leads.reduce((acc, lead) => acc + lead.amount, 0).toLocaleString()}</p>
              <p className="text-white text-size=3">Total Value of Leads</p>
              <Link
                to="/leads-management"
                className="text-white mt-auto self-center bg-blue-400"
              >
                More info{" "}
              </Link>
            </div>
            <div className="border-4 border-gray-200 rounded-lg h-40 p-4 bg-purple-600 flex flex-col justify-between">
              <p className="text-white text-4xl">Ksh {leads.reduce((acc, lead) => acc + lead.amount_paid, 0).toLocaleString()}</p>
              <p className="text-white">Paid to date</p>
              <Link
                to="/won"
                className="text-white mt-auto self-center bg-purple-400"
              >
                More info{" "}
              </Link>
            </div>
            <div className="border-4 border-gray-200 rounded-lg h-40 p-4 bg-green-600 flex flex-col justify-between">
              <p className="text-white text-4xl">kes {leads.filter(lead => lead.amount_paid > 0).length}
              </p>
              <p className="text-white">Leads Paid</p>
              <Link
                to="won"
                className="text-white mt-auto self-center bg-green-400"
              >
                More info{" "}
              </Link>
            </div>
          </div>
      

        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-gray-200 rounded-lg h-48">
            <div className="flex flex-row mt-5 ml-5">
              <p className="mr-4">Due Today - Followups & tasks</p>
              <p className="text-blue-600 hover:text-blue-800 cursor-pointer">
                Show details in Calendar
              </p>
            </div>
            <div className="flex">
              <table className="ml-7 mt-8 w-1/3">
                <thead>
                  <tr>
                    <th className="border bg-gray-300 h-12 pl-4 pt-2 text-start">
                      Follow-ups(0)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-2"></tr>
                </tbody>
              </table>
              <table className="ml-7 mt-8 w-1/3">
                <thead>
                  <tr>
                    <th className="border bg-gray-300 h-12 pl-4 pt-2 text-start">
                      Tasks(0)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td>hello</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="border-4 w-1/2 border-gray-200 rounded-lg h-80">
            <h2 className="p-2">Your Stats</h2>
            <hr />
            <div className="flex p-4">
              <div className="w-3/4">
                <p className="border p-3">Tasks</p>
                <p className="border p-3">Estimates/Quotations</p>
              </div>
              <div>
                <p className="border p-3">3</p>
                <p className="border p-3">3</p>
              </div>
            </div>
          </div>
          <div className="border-4 w-1/2 border-gray-200 rounded-lg h-80">
            <h2 className="p-2">Your recent activities</h2>
            <hr />
          </div>
        </div>
      </main>
    </div>
  );
}

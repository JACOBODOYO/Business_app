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
        
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLeads();
  }, []);
  
  

  if (leads.length === 0) return <div>Loading...</div>;

  return (
    <div className="overflow-auto h-full pl-4 pr-4 ">
      {/* <header className="bg-blue-100 shadow mb-4">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header> */}
      <main className="max-w-7xl mx-auto bg-blue-200">
          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4   mb-6">
            <Link
                to="/leads-management"
                className="text-black mt-auto self-center"
              >
            <div className=" rounded-[10px] m-4 h-40 p-6 bg-white flex flex-col justify-between border-b-4 border-b-blue-300">
              <p className="text-black">Total Accounts Allocation:</p>
              <p className="text-black text-4xl text-bold">{leads.length}</p>
              
            </div>
            </Link>
            <Link
                to="/leads-management"
                className="text-black mt-auto self-center"
              >
            <div className="rounded-[10px] m-4 h-40 p-6 bg-white flex flex-col justify-between border-b-4 border-b-blue-300">
              <p className="text-black text-size=3">Total Value of Accounts</p>
              <p className="text-black text-3xl text-bold">Ksh {leads.reduce((acc, lead) => acc + lead.amount, 0).toLocaleString()}</p>
              
            </div>
            </Link>
            <Link
                to="/won"
                className="text-white mt-auto self-center"
              >
            <div className="rounded-[10px] m-4 h-40 p-6 bg-white flex flex-col justify-between border-b-4 border-b-blue-300">
              <p className="text-black">Amount Paid to date</p>
              <p className="text-black text-4xl">Ksh {leads.reduce((acc, lead) => acc + lead.amount_paid, 0).toLocaleString()}</p>
              
            </div>
            </Link>
            <Link
                to="won"
                className="text-white mt-auto self-center"
              >
            <div className="rounded-[10px] m-4 h-40 p-6 bg-white flex flex-col justify-between border-b-4 border-b-blue-300">
              <p className="text-black">Total number of debtors that have Paid</p>
              <p className="text-black text-4xl"> {leads.filter(lead => lead.amount_paid > 0).length}
              </p>
              
            </div>
            </Link>
          </div>
      

        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-[10px] m-5 h-48">
            <div className="flex flex-row mt-5 ml-5">
              <p className="mr-4">MONTHLY COLLECTIONS</p>
              <p className="text-blue-600 hover:text-blue-800 cursor-pointer">
                Show details
              </p>
            </div>
            <div className="flex">
              <table className="ml-7 mt-8 w-1/3">
                <thead>
                  <tr>
                    <th className="border bg-gray-300 h-12 pl-4 pt-2 text-start">
                      USERS 
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
                      AMOUNT COLLECTED
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
          <div className=" w-1/2 m-5  rounded-[10px] bg-white h-80">
            <h2 className="p-2">Users ON BOARD</h2>
            <hr />
            <div className="flex p-4">
              <div>
                <p>name</p>
                <p></p>
              </div>
            </div>
          </div>
          <div className=" w-1/2  rounded-[10px] bg-white m-5">
            <h2 className="p-2">Clients on board</h2>
            <hr />
          </div>
        </div>
      </main>
    </div>
  );
}

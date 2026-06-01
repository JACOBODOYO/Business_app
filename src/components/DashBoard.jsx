import axios from "axios";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { Link, useParams } from "react-router-dom";
import MonthlyCollections from "./MonthlyCollections";
import DashboardSummary from "./DashboardSummary";
import RecentPayments from "./RecentPayments";
import TopCollectors from "./TopCollectors";
import ActivityTimeline from "./ActivityTimeline";
import SmartDashboard from "./SmartDashboard";
import DailyCollectionsChart from "./DailyCollectionsChart";
import AgentPerformanceChart from "./AgentPerformanceChart";
import RecoveryRate from "./RecoveryRate";
import DailyReport from "./DailyReport";
import UploadLeads from "./UploadLeads";



export default function DashBoard() {
  const [userRole, setUserRole] = useState("user");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  async function loadDashboard() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const user = session.user;

      const [profileResult, leadsResult] = await Promise.all([
        supabase
          .from("users")
          .select("role")
          .eq("email", user.email)
          .maybeSingle(),

        axios.get("http://localhost:3001/leads", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }),
      ]);

      setUserRole(profileResult.data?.role || "user");

      setLeads(
        leadsResult.data.sort((a, b) =>
          a.company.localeCompare(b.company)
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  loadDashboard();
}, []);



  if (loading) {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 bg-gray-200 rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

  if (leads.length === 0) return <div>No accounts assigned</div>;

  return (
    <div className="overflow-auto h-full pl-4 pr-4 ">
      <header className="bg-blue-100 shadow mb-4">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
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
              <p className="text-black text-3xl text-bold">{leads
                .reduce((acc, lead) => acc + Number(lead.amount), 0)
                .toLocaleString("en-KE", {
                  style: "currency",
                  currency: "KES",
                })}</p>

            </div>
          </Link>
          <Link
            to="/won"
            className="text-white mt-auto self-center"
          >
            <div className="rounded-[10px] m-4 h-40 p-6 bg-white flex flex-col justify-between border-b-4 border-b-blue-300">
              <p className="text-black">Amount Paid to date</p>
              <p className="text-black text-4xl">
                Ksh {leads
                  .reduce((acc, lead) => acc + Number(lead.amount_paid), 0)
                  .toLocaleString()}
              </p>
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
        <DailyReport />
        <TopCollectors />
        <ActivityTimeline />
        {userRole === "admin" && (<>
          <MonthlyCollections />
          <DashboardSummary />
          <RecentPayments />


          <SmartDashboard />
          <div className="grid grid-cols-2 gap-6 m-4 pb-4">
            <DailyCollectionsChart />
            <AgentPerformanceChart />
            <RecoveryRate />
            <UploadLeads />
          </div>
        </>)}


        <div className="hidden flex gap-5">
          <div className=" w-1/2 m-5  rounded-[10px] bg-white h-80">
            <h2 className="p-2">Users On Board</h2>
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

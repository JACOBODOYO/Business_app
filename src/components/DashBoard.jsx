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
  const API = import.meta.env.VITE_API_URL;



  useEffect(() => {
    async function loadDashboard() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("SESSION:", session);
        console.log("TOKEN:", session?.access_token);

        if (!session) {
          setLoading(false);
          return;
        }

        const user = session.user;

        const [profileResult, leadsResult] = await Promise.all([
          supabase
            .from("users")
            .select("role")
            .eq("email", user.email)
            .maybeSingle(),

          axios.get(`${API}/leads`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }),
        ]);

        setUserRole(profileResult.data?.role || "user");

        const leadsData = leadsResult?.data || [];

        setLeads(
          leadsData.sort((a, b) =>
            (a.company || "").localeCompare(b.company || "")
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
    <div className="min-h-screen overflow-x-hidden px-2 sm:px-4 md:px-6">
      <header className="bg-blue-100 shadow mb-4">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto bg-blue-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">          <Link
          to="/leads-management"
          className="text-black mt-auto self-center"
        >
          <div className="rounded-lg p-4 sm:p-6 bg-white min-h-[140px] flex flex-col justify-between border-b-4 border-b-blue-300">
            <p className="text-black">Total Accounts Allocation:</p>
            <p className="text-black text-4xl text-bold">{leads.length}</p>

          </div>
        </Link>
          <Link
            to="/leads-management"
            className="text-black mt-auto self-center"
          >
            <div className="rounded-lg p-4 sm:p-6 bg-white min-h-[140px] flex flex-col justify-between border-b-4 border-b-blue-300">
              <p className="text-black text-size=3">Total Value of Accounts</p>
              <p className="text-black text-3xl text-bold">{leads
                .reduce((acc, lead) => acc + Number(lead.amount), 0)
                .toLocaleString("en-KE", {
                  style: "currency",
                  currency: "KES",
                })}</p>

            </div>
          </Link>
          <Link to="/won" className="block">
            <div className="rounded-lg p-4 sm:p-6 bg-white min-h-[140px] flex flex-col justify-between border-b-4 border-b-blue-300 w-full">

              <p className="text-black text-sm sm:text-base">
                Amount Paid to date
              </p>

              <p className="text-black text-xl sm:text-2xl lg:text-3xl font-bold">
                Ksh{" "}
                {leads
                  .reduce((acc, lead) => acc + Number(lead.amount_paid || 0), 0)
                  .toLocaleString("en-KE")}
              </p>

            </div>
          </Link>
          <Link
            to="won"
            className="text-white mt-auto self-center"
          >
            <div className="rounded-lg p-4 sm:p-6 bg-white min-h-[140px] flex flex-col justify-between border-b-4 border-b-blue-300">
              <p className="text-black">Total number of debtors that have Paid</p>
              <p className="text-black text-4xl"> {leads.filter(lead => lead.amount_paid > 0).length}
              </p>

            </div>
          </Link>
        </div>
        
        <TopCollectors />
        <ActivityTimeline />
        {userRole === "admin" && (<>
          <MonthlyCollections />
          <DashboardSummary />
          <RecentPayments />


          <SmartDashboard />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">            <DailyCollectionsChart />
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

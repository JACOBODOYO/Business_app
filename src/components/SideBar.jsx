import { Link } from "react-router-dom";
import React from "react";

export default function SideBar() {
  // Get user role from token
  const token = localStorage.getItem("token");
  let userRole = "user"; // default

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
      userRole = payload.role; // "admin" or "user"
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="w-1/6 bg-purple-600 fixed top-0 left-0 h-full overflow-y-auto">
        <Link to="/dashboard" className="flex rounded-[10px] m-2 hover:bg-purple-800 cursor-pointer">
          <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <circle cx="12" cy="13" r="2" />
            <line x1="13.45" y1="11.55" x2="15.5" y2="9.5" />
            <path d="M6.4 20a9 9 0 1 1 11.2 0Z" />
          </svg>
          <div className="p-3 text-white cursor-pointer">Dashboard</div>
        </Link>

        <Link to="/leads-management" className="flex rounded-[10px] m-2 hover:bg-purple-800 cursor-pointer">
          <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <div className="p-3 text-white cursor-pointer">Debtors</div>
        </Link>

        <Link to="/search-leads" className="flex rounded-[10px] m-2 hover:bg-purple-800 cursor-pointer">
          <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <div className="p-3 text-white cursor-pointer">Clients</div>
        </Link>

        {/* Admin-only links */}
        {userRole === "admin" && (
          <>
            <Link to="/send-reports" className="flex rounded-[10px] m-2 hover:bg-purple-800 cursor-pointer">
              <svg className="h-7 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <div className="p-3 text-white cursor-pointer">Users</div>
            </Link>

            <Link to="/reports" className="flex rounded-[10px] m-2 hover:bg-purple-800 cursor-pointer">
              <svg className="h-7 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              <div className="p-3 text-white cursor-pointer">Reports</div>
            </Link>
          </>
        )}

      </div>

      {/* Main Content */}
      <div className="flex-1 ml-1/6 mt-16 pl-4 overflow-x-hidden"></div>
    </div>
  );
}
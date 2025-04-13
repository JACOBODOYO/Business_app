import React, { useState } from "react";
import AllOpen from "./AllOpen";
import DueToday from "./DueToday"; // Import DueToday component
import Overdue from "./Overdue"; // Import Overdue component
import Won from "./Won"; // Import Won component
import FollowUps from "./FollowUps"; // Import FollowUps component

const LeadsManagement = () => {
  const [view, setView] = useState("all"); // State to track the current view

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="overflow-auto h-full pl-4 pr-4">
      <header className=" shadow mb-4 bg-blue-100">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 text-start">All open leads</h1>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="h-20 ">
            <tr className="flex gap-4 items-center">
              <th className="text-blue-600 border-2">
                <button onClick={() => handleViewChange("dueToday")} className="hover:underline">
                  Due Today
                </button>
              </th>
              <th className="text-blue-600 border-2">
                <button onClick={() => handleViewChange("all")} className="hover:underline">
                  All open leads
                </button>
              </th>
              <th className="text-blue-600 border-2">
                <button onClick={() => handleViewChange("overdue")} className="hover:underline">
                  Overdue
                </button>
              </th>
              <th className="text-blue-600 border-2">
                <button onClick={() => handleViewChange("won")} className="hover:underline">
                  Won
                </button>
              </th>
              <th className="text-blue-600 border-2">
                <button onClick={() => handleViewChange("followUps")} className="hover:underline">
                  Follow-ups Calendar
                </button>
              </th>
              <th className="text-white bg-green-600 border-2">Add leads</th>
              <th className="text-white border-2 bg-green-600">Upload leads</th>
              <th className="border-2 ml-auto">
                <select className="w-full p-2 border rounded pr-1">
                  <option value="">Tabular view</option>
                  <option value="option1">Select view</option>
                  <option value="option2">Tabular view</option>
                  <option value="option3">Detailed view</option>
                </select>
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <hr className="border-t-2 border-gray-300 my-4" />
      
      {/* Render the appropriate component based on the view state */}
      {view === "dueToday" && <DueToday />}
      {view === "overdue" && <Overdue />}
      {view === "won" && <Won />}
      {view === "followUps" && <FollowUps />}
      {view === "all" && <AllOpen />}
    </div>
  );
};

export default LeadsManagement;

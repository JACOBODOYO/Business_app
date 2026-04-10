import React, { useState } from "react";
import AllOpen from "./AllOpen";
import DueToday from "./DueToday"; // Import DueToday component
import Overdue from "./Overdue"; // Import Overdue component

const LeadsManagement = () => {
  const [view, setView] = useState("all"); // State to track the current view

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="overflow-auto h-full pl-4 pr-4">
      

      <div className="overflow-x-auto">
        <table className="min-w-full mt-3 border-collapse">
          <thead className="h-20 ">
            <tr className="flex gap-4 items-center">
              <th className="text-blue-600 rounded-[8px] border-2">
                <button onClick={() => handleViewChange("dueToday")} className="hover:underline m-1">
                  Due Today
                </button>
              </th>
              <th className="text-blue-600 rounded-[8px] border-2">
                <button onClick={() => handleViewChange("all")} className="hover:underline m-1">
                  All open leads
                </button>
              </th>
              <th className="text-blue-600 rounded-[8px] border-2">
                <button onClick={() => handleViewChange("overdue")} className="hover:underline m-1">
                  Overdue
                </button>
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

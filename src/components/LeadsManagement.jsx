import React, { useState } from "react";
import AllOpen from "./AllOpen";
import DueToday from "./DueToday";
import Overdue from "./Overdue";

const LeadsManagement = () => {
  const [view, setView] = useState("all");

  return (
    <div className="w-full px-2 md:px-4 py-4">
      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
        <button
          onClick={() => setView("dueToday")}
          className="px-4 py-2 border-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:bg-purple-800
transition-all duration-150
active:scale-95
active:opacity-80
active:translate-y-[1px]
cursor-pointer"
        >
          Due Today
        </button>

        <button
          onClick={() => setView("all")}
          className="px-4 py-2 border-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:bg-purple-800
transition-all duration-150
active:scale-95
active:opacity-80
active:translate-y-[1px]
cursor-pointer"
        >
          All Open Leads
        </button>

        <button
          onClick={() => setView("overdue")}
          className="px-4 py-2 border-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:bg-purple-800
transition-all duration-150
active:scale-95
active:opacity-80
active:translate-y-[1px]
cursor-pointer"
        >
          Overdue
        </button>
      </div>

      <hr className="border-t-2 border-gray-300 mb-4" />

      <div className="w-full">
        {view === "dueToday" && <DueToday />}
        {view === "overdue" && <Overdue />}
        {view === "all" && <AllOpen />}
      </div>
    </div>
  );
};

export default LeadsManagement;
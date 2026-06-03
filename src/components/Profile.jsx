import React, { useState } from "react";
import ProfileDetails from "./ProfileDetails";
import ProfileProfile from "./ProfileProfile";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { leadId } = useParams();
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div className="w-full px-2 md:px-4 py-4">
      <div className="bg-blue-200 border rounded-lg p-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            className={`px-4 py-2 rounded border transition hover:bg-purple-800
    transition-all duration-150
    active:scale-95
    active:opacity-80
    active:translate-y-[1px]
    cursor-pointer
            ${showDetails
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
              }`}
            onClick={() => setShowDetails(true)}
          >
            Details
          </button>

          <button
            className={`px-4 py-2 rounded border transition hover:bg-purple-800
    transition-all duration-150
    active:scale-95
    active:opacity-80
    active:translate-y-[1px]
    cursor-pointer
            ${!showDetails
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
              }`}
            onClick={() => setShowDetails(false)}
          >
            Profile
          </button>
        </div>

        {/* Content */}
        <div className="w-full overflow-x-auto">
          {showDetails ? (
            <ProfileProfile leadId={leadId} />
          ) : (
            <ProfileDetails leadId={leadId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
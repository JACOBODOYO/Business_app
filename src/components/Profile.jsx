import React, { useState } from "react";
import ProfileDetails from "./ProfileDetails";
import ProfileProfile from "./ProfileProfile";
import ProfileAccountDetails from "./ProfileAccountDetails";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { leadId } = useParams();
  const [showDetails, setShowDetails] = useState(true);

  const toggleDetails = () => {
    setShowDetails(true);
  };
  const toggleProfile = () => {
    setShowDetails(false);
  };

  return (
    <div className="  h-full ml-300 mt-0 px-4">
      <div className="border-gray border-l bg-blue-200 border-t-4 border-r-4 border-b-4 pt-6">
        <div className="w-full h-full  border-gray-400">
          <div className="flex ml-5">
            <div
              className={`w-20 h-10 border mr-5 rounded border-gray-500 p-2 cursor-pointer 
    transition-all duration-150 select-none
    ${showDetails ? "bg-blue-500 text-white" : "bg-blue-200 text-black"} 
    active:scale-95 active:bg-blue-600`}
              onClick={toggleDetails}
            >
              Details
            </div>

           <div
  className={`w-20 h-10 border rounded border-gray-500 p-2 cursor-pointer
    transition-all duration-150 select-none
    ${!showDetails ? "bg-blue-500 text-white" : "bg-blue-200 text-black"}
    active:scale-95 active:bg-blue-600`}
  onClick={toggleProfile}
>
  Profile
</div>

          </div>
          {showDetails ? (
            <ProfileProfile leadId={leadId} />
          ) : (
            <ProfileDetails leadId={leadId} />
          )}
          {/* <ProfileAccountDetails className="mt-5 hidden" /> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;

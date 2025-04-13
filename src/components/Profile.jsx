import React, { useState } from "react";
import ProfileDetails from "./ProfileDetails";
import ProfileProfile from "./ProfileProfile";
import ProfileAccountDetails from "./ProfileAccountDetails";

const Profile = () => {
  const [showDetails, setShowDetails] = useState(true);

  const toggleDetails = () => {
    setShowDetails(true);
  };
  const toggleProfile = () => {
    setShowDetails(false);
  };

  return (
    <div className="  h-full ml-300 mt-0 px-4">
      <header className="bg-blue-100 shadow mb-4">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
          <h1 className="text-3xl font-bold text-gray-900">
            Details & profile
          </h1>
        </div>
      </header>
      <div className="border-gray border-l border-t-4 border-r-4 border-b-4 pt-6">
        <div className="w-full h-full  border-gray-400">
          <div className="flex ">
            <div
              className={`w-20 h-10 border rounded border-gray-500 p-2 cursor-pointer ${
                showDetails ? "bg-blue-500 text-white" : ""
              }`}
              onClick={toggleDetails}
            >
              Details
            </div>
            <div
              className={`w-20 h-10 border rounded border-gray-500 p-2 cursor-pointer ${
                !showDetails ? "bg-blue-500 text-white" : ""
              }`}
              onClick={toggleProfile}
            >
              Profile
            </div>
          </div>
          {showDetails ? <ProfileDetails /> : <ProfileProfile />}
          <ProfileAccountDetails/>
        </div>
      </div>
    </div>
  );
};

export default Profile;

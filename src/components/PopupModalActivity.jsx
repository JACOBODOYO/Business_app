import React, { useState } from "react";

const PopupModalActivity = ({ closeModal, updateNextActivity }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateNextActivity(selectedOption);
    closeModal();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center ">
          Change Next Activity
        </h2>
        <hr className="border border- max-w[2xl]" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 mt-4 ">
          <div className="flex gap-20 items-center">
            <p className="w-50">Next Activity?</p>
            <select
              value={selectedOption}
              onChange={handleOptionChange}
              className="border"
            >
              <option value="Select" className="bold">Select</option>
              <option value="CALL" className="text-bold">CALL</option>
              <option value="EMAIL" className="text-bold">EMAIL </option>
              <option value="MEETING">MEETING</option>
              <option value="VISIT">VISIT</option>
              <option value="DEMO">DEMO</option>
              <option value="SET QUATATION/ESTIMATES">
                SET QUATATION/ESTIMATES
              </option>
              <option value="FOLLOWUP-POST PROPOSAL">
                FOLLOWUP-POST PROPOSAL{" "}
              </option>
              <option value="PAYMENT COLLECTION">PAYMENT COLLECTION</option>
              <option value="TEXT">TEXT</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Update
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
          >
            Cancel
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupModalActivity;

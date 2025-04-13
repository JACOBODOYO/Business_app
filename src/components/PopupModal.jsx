import React, { useState } from "react";

const PopupModal = ({ closeModal, updateDealStage }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateDealStage(selectedOption);
    closeModal();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Change deal</h2>
        <hr className="border max-w-[2xl]" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 mt-4">
          <div className="flex gap-20 items-center">
            <p className="w-50">Select Deal stage</p>
            <select
              className="border p-2"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="Select">Select</option>
              <option value="Outsource email">Outsource email</option>
              <option value="No contact provided">No contact provided</option>
              <option value="Request more information">Request more information</option>
              <option value="Invalid email">Invalid email</option>
              <option value="Wrong number">Wrong number</option>
              <option value="Introduction call">Introduction call</option>
              <option value="Out of service">Out of service</option>
              <option value="Not in service">Not in service</option>
              <option value="Phone switched off">Phone switched off</option>
              <option value="Calls dropped">Calls dropped</option>
              <option value="Follow-up email">Follow-up email</option>
              <option value="Ringing no response">Ringing no response</option>
              <option value="Request call back">Request call back</option>
              <option value="Field visit meeting">Field visit meeting</option>
              <option value="Negotiation in progress">Negotiation in progress</option>
              <option value="PTP">PTP</option>
              <option value="Scheduled payments">Scheduled payments</option>
              <option value="One-off payment">One-off payment</option>
              <option value="Payment confirmed by client">Payment confirmed by client</option>
              <option value="Debt settled">Debt settled</option>
              <option value="Non-committal">Non-committal</option>
              <option value="Disputing">Disputing</option>
              <option value="Legal">Legal</option>
              <option value="Not interested">Not interested</option>
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

export default PopupModal;

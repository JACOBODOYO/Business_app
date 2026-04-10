import React from "react";

export default function DemandLetterModal({ show, onClose, data }) {
  if (!show) return null;

  const {
    customerName = "__________",
    email = "__________",
    accountNo = "AAxxx",
    amount = "__________",
    date = new Date().toLocaleDateString(),
    officerName = "Lillian Muriuki",
    officerPhone = "0799795409",
    officerEmail = "Lilian.Muriuki@faulukenya.com",
  } = data || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white w-3/4 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-8">

        {/* HEADER */}
        <div className="mb-6">
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Our Ref:</strong> __________</p>
        </div>

        {/* CUSTOMER DETAILS */}
        <div className="mb-6">
          <p><strong>{customerName}</strong> <i>“Advance copy via email”</i></p>
          <p>{email}</p>
        </div>

        {/* LETTER BODY */}
        <div className="text-sm leading-7">
          <p className="mb-4">Dear Sir/Madam,</p>

          <p className="mb-4 font-bold">
            RE: DEMAND FOR PAYMENT FOR LOAN ACCOUNT NO. {accountNo}
          </p>

          <p className="mb-4">
            The bank notes that you have failed to regularize your loan currently outstanding at 
            <strong> Kshs. {amount}</strong>.
          </p>

          <p className="mb-4">
            You are hereby required to pay the outstanding debt amount in full within 
            <strong> Seven (7) days</strong> from the date of service of this notice.
          </p>

          <p className="mb-4">
            TAKE NOTICE that unless the amount is paid in full within Seven (7) days from the date of this letter,
            the Bank shall proceed to recover the debt amount, including but not limited to instituting proceedings
            against you for the recovery of the said amount at your peril as to costs and other incidentals.
          </p>

          <p className="mb-4">
            Be further advised that the Bank shall proceed to institute recovery measures against you should we
            not receive the aforestated amount and/or an agreeable repayment proposal from you.
          </p>

          <p className="mb-4">
            For purposes of any settlement proposals or any further clarification, please contact the below:
          </p>

          {/* CONTACT TABLE */}
          <div className="mb-6">
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Phone Number</th>
                  <th className="p-2 border">Email Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">{officerName}</td>
                  <td className="p-2 border">{officerPhone}</td>
                  <td className="p-2 border">{officerEmail}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mb-6">
            We urge that you remit the above funds highlighted to avert any adverse action by the Bank against you.
          </p>

          <p className="mb-10">Yours faithfully,</p>

          {/* SIGNATURES */}
          <div className="flex justify-between mt-10">
            <div>
              <p>_________________________</p>
              <p>AUTHORIZED SIGNATORY</p>
            </div>

            <div>
              <p>_________________________</p>
              <p>AUTHORIZED SIGNATORY</p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Close
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Print / Download
          </button>
        </div>
      </div>
    </div>
  );
}
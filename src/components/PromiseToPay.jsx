export default function PromiseToPay() {
  return (
    <div className="bg-white rounded-[10px] shadow border-b-4 border-blue-400">
      <h2 className="p-3 text-lg font-semibold mb-4">Promise to pay</h2>
      <div className="flex flex-col items-start justify-between p-5 border-b border-gray-200">
        <p>PTP AMOUNT</p>
        <input type="number" className="border p-1 rounded-[5px] w-[70%]" />
      </div>
      <div className="flex flex-col items-start justify-between p-3 border-b border-gray-200">
        <p>PTP Date</p>
        <input type="date" className="border p-1 rounded-[5px] w-[70%]" />
      </div>
      <button className="bg-blue-600 rounded-[6px] mt-3 text-white ml-3 p-2">
        Log Promise to Pay
      </button>
    </div>
  );
}

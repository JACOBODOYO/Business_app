import { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentHistory({ leadId, refreshKey }) {

  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {

      const res = await axios.get(
        `http://localhost:3001/payments/${leadId}`
      );

      setPayments(res.data);

    } catch (err) {
      console.error("Failed to fetch payments:", err);
    }
  };

  useEffect(() => {
    if (!leadId) return;
    fetchPayments();
  }, [leadId, refreshKey]);

  return (

    <div className="col-start-4 row-start-3 col-span-2 bg-white border-b-4 border-blue-400 rounded-[10px] p-3 ">

      <p className="font-bold mb-2">Payment History</p>

      <div className="grid grid-cols-3 font-semibold border-b pb-2">
        <p>Date</p>
        <p>Amount</p>
        <p>Notes</p>
      </div>

      {payments.length === 0 ? (
        <p className="text-gray-500 p-2">No payments recorded</p>
      ) : (

        payments.map((p) => (

          <div
            key={p.id}
            className="grid grid-cols-3 border-b py-2"
          >

            <p>
              {new Date(p.payment_date).toLocaleDateString()}
            </p>

            <p className="text-green-600 font-semibold">
              Ksh {Number(p.amount).toLocaleString()}
            </p>

            <p>{p.notes}</p>

          </div>

        ))
      )}

    </div>
  );
}
import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentPayments() {

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:3001/recent-payments");
      setPayments(res.data);
    } catch (error) {
      console.error("Error fetching recent payments:", error);
    }
  };

  return (
    <div className="pl-4 pr-4 bg-white rounded-[10px] m-4 shadow border-b-4 border-blue-400">

      <h2 className="font-semibold mb-4">Recent Payments</h2>

      <table className="w-full text-left">

        <thead>
          <tr className="border-b">
            <th className="pb-2">Client</th>
            <th className="pb-2">Amount</th>
            <th className="pb-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan="3" className="pt-4 text-gray-500">
                No recent payments
              </td>
            </tr>
          ) : (
            payments.map((payment, index) => (
              <tr key={index} className="border-b">

                <td className="py-2">
                  {payment.title}
                </td>

                <td className="py-2 text-green-600 font-semibold">
                  Ksh {Number(payment.amount_paid).toLocaleString()}
                </td>

                <td className="py-2">
                  {new Date(payment.payment_date).toLocaleDateString()}
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>

    </div>
  );
}
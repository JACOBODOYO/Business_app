import { useEffect, useState } from "react";
import axios from "axios";

export default function SmartDashboard() {

  const [ptpToday, setPtpToday] = useState([]);
  const [brokenPtp, setBrokenPtp] = useState([]);
  const [noContact, setNoContact] = useState([]);
  const [highValue, setHighValue] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:3001/dashboard/ptp-today")
      .then(res => setPtpToday(res.data));

    axios.get("http://localhost:3001/dashboard/broken-ptp")
      .then(res => setBrokenPtp(res.data));

    axios.get("http://localhost:3001/dashboard/no-contact")
      .then(res => setNoContact(res.data));

    axios.get("http://localhost:3001/dashboard/high-value")
      .then(res => setHighValue(res.data));

  }, []);

  return (

    <div className="grid grid-cols-2 gap-6 m-4 ">

      {/* PTP Today */}
      <div className="bg-white p-4 rounded shadow border-b-4 border-blue-400">

        <h2 className="font-bold mb-3">
          💰 Promises To Pay Today
        </h2>

        {ptpToday.map(item => (
          <p key={item.id}>
            {item.company} — Ksh {Number(item.amount).toLocaleString()}
          </p>
        ))}

      </div>

      {/* Broken PTP */}
      <div className="bg-white p-4 rounded shadow border-b-4 border-blue-400">

        <h2 className="font-bold mb-3">
          ⚠ Broken Promises
        </h2>

        {brokenPtp.map(item => (
          <p key={item.id}>
            {item.company} — {new Date(item.promise_date).toLocaleDateString()}
          </p>
        ))}

      </div>

      {/* No Contact */}
      <div className="bg-white p-4 rounded shadow border-b-4 border-blue-400">

        <h2 className="font-bold mb-3">
          📞 No Contact 7+ Days
        </h2>

        {noContact.map(item => (
          <p key={item.id}>
            {item.company}
          </p>
        ))}

      </div>

      {/* High Value */}
      <div className="bg-white p-4 rounded shadow border-b-4 border-blue-400">

        <h2 className="font-bold mb-3">
          💎 High Value Accounts
        </h2>

        {highValue.map(item => (
          <p key={item.id}>
            {item.company} — Ksh {Number(item.amount).toLocaleString()}
          </p>
        ))}

      </div>

    </div>

  );
}
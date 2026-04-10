import { useEffect, useState } from "react";
import axios from "axios";

export default function RecoveryRate() {

  const [data, setData] = useState(null);

  useEffect(() => {

    axios
      .get("http://localhost:3001/dashboard/recovery-rate")
      .then((res) => setData(res.data));

  }, []);

  if (!data) return <p>Loading...</p>;

  return (

    <div className="bg-white p-4 rounded shadow border-b-4 border-blue-400">

      <h2 className="font-bold mb-3">
        Portfolio Recovery
      </h2>

      <p>
        Portfolio: Ksh {Number(data.portfolio).toLocaleString()}
      </p>

      <p>
        Collected: Ksh {Number(data.collected).toLocaleString()}
      </p>

      <p className="text-green-600 font-bold text-xl mt-2">
        {data.recoveryRate.toFixed(2)}%
      </p>

    </div>

  );
}
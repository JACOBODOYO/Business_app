import { useEffect, useState } from "react";
import axios from "axios";

const MonthlyPaymentReports = () => {
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:3001/reports/monthly-payments");
      const grouped = groupByMonth(res.data);
      setGroupedData(grouped);
    } catch (err) {
      console.error(err);
    }
  };

  const groupByMonth = (data) => {
  const result = {};

  data.forEach((item) => {
    const month = new Date(item.month).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!result[month]) {
      result[month] = {
        total: 0,
        users: {},
      };
    }

    const amount = Number(item.total);

    result[month].total += amount;
    result[month].users[item.user] = amount;
  });

  return result;
};

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-800 mb-4">
        Monthly Collections Report
      </h1>

      {/* Cards */}
      <div className="space-y-4">
        {Object.keys(groupedData).map((month) => {
          const monthData = groupedData[month];

          return (
            <div
              key={month}
              className="bg-white rounded-xl p-5 border-l-4 border-blue-600 shadow-sm"
            >
              {/* Header Row */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  {month}
                </h2>
                <span className="text-lg font-bold text-green-600">
                  KES {monthData.total.toLocaleString()}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 my-3"></div>

              {/* Users */}
              <div className="space-y-2">
                {Object.keys(monthData.users).map((user) => (
                  <div
                    key={user}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-slate-600">{user}</span>
                    <span className="font-semibold text-slate-900">
                      KES {monthData.users[user].toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyPaymentReports;
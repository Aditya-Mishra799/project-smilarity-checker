import { BarChart, CheckCircle, Hourglass, XCircle } from "lucide-react";

const SessionMetrics = ({ metrics }) => {
  const stats = [
    {
      label: "Pending",
      value: metrics.pending,
      icon: <Hourglass className="text-yellow-500 w-7 h-7" />,
    },
    {
      label: "Accepted",
      value: metrics.accepted,
      icon: <CheckCircle className="text-green-500 w-7 h-7" />,
    },
    {
      label: "Rejected",
      value: metrics.rejected,
      icon: <XCircle className="text-red-500 w-7 h-7" />,
    },
    {
      label: "Total",
      value: metrics.total,
      icon: <BarChart className="text-blue-500 w-7 h-7" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg">
      {stats.map(({ label, value, icon }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center  rounded-lg p-3 bg-gradient-to-br from-white via-white-50 to-gray-50"
        >
          <div className="flex items-center gap-2">{icon}</div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default SessionMetrics;

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ChartsPlaceholder({ data }: { data: any[] }) {
  if (!data.length) {
    return (
      <div className="w-full h-80 bg-gray-900 rounded-xl p-6 flex items-center justify-center text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full h-100 bg-gray-900 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Top Destinations
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import ChartsPlaceholder from "@/components/ChartsPlaceholder";
import PageTransition from "@/components/PageTransition";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import WorldHeatmap from "@/components/WorldHeatMap";
import toast from "react-hot-toast";



export default function AdminDashboard() {
  useAdminGuard();

  // ✅ Hooks MUST be inside component
  const [stats, setStats] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<number[][]>([]);

useEffect(() => {
  api.get("/admin/analytics/heatmap").then(res => setHeatmap(res.data));
}, []);

  useEffect(() => {
    api.get("/admin/analytics/summary").then((res) => {
      setStats(res.data);
    });
  }, []);

  const downloadCSV = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to download reports");
      return;
    }

    const res = await fetch("http://localhost:8000/admin/reports/itineraries", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      toast.error("Failed to download report");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "itineraries_report.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  // ✅ Compute chart data OUTSIDE JSX
  const chartData =
    stats?.top_destinations?.map((d: any) => ({
      name: d._id,
      value: d.count,
    })) || [];

  return (
    <PageTransition>
      <div className="flex bg-gradient-to-b from-slate-900 to-gray-900 text-white min-h-screen">
        <Sidebar />

        {/* Main Content */}
        <div className="ml-64 w-full p-8 md:p-10 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold">Analytics Dashboard</h1>
              <p className="text-gray-400">Monitor user growth, top travel destinations & trends.</p>
            </div>
            <div>
              <button onClick={downloadCSV} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md">
                Export CSV
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Total Users" value={stats?.total_users ?? "—"} />
            <StatsCard
              title="Trips Generated"
              value={stats?.total_trips ?? "—"}
            />
            <StatsCard title="Avg Budget" value={stats?.avg_budget ?? "—"} />
            
          </div>

          {/* Heatmap Section */}
         <section className="bg-gray-800/60 border border-gray-700 rounded-xl p-6">
  <WorldHeatmap points={heatmap} />
</section>


          {/* Charts Section */}
          <ChartsPlaceholder data={chartData} />

          {/* Recent Table */}
          <section className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Trips</h2>
            <p className="text-gray-400">[ Recent Trips Table Placeholder ]</p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

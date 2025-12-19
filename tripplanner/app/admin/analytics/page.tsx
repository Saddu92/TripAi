"use client";

import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import ChartsPlaceholder from "@/components/ChartsPlaceholder";
import PageTransition from "@/components/PageTransition";
import { useAdminGuard } from "@/hooks/useAdminGuard";



export default function AdminDashboard() {
   useAdminGuard();
  return (


    <PageTransition>
  <div className="flex bg-gray-950 text-white min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 w-full p-10 space-y-10">
        {/* Header */}
        <h1 className="text-4xl font-semibold">Analytics Dashboard</h1>
        <p className="text-gray-400">
          Monitor user growth, top travel destinations & trends.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Users" value="13,456" />
          <StatsCard title="Trips Generated" value="2,871" />
          <StatsCard title="Avg Budget" value="$1,200" />
        </div>

        {/* Heatmap Section */}
        <section className="bg-gray-900 rounded-xl p-6 h-96 flex items-center justify-center">
          <p className="text-gray-400">[ World Heatmap Placeholder ]</p>
        </section>

        {/* Charts Section */}
        {/* <section className="bg-gray-900 rounded-xl p-6 h-96 flex items-center justify-center">
          <p className="text-gray-400">[ Bar Chart Placeholder ]</p>
        </section> */}

<ChartsPlaceholder />

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

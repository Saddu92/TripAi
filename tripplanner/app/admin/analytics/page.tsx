"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import WorldHeatmap from "@/components/WorldHeatMap";
import ChartsPlaceholder from "@/components/ChartsPlaceholder";
import PageTransition from "@/components/PageTransition";
import { Download, TrendingUp, Users, Map, DollarSign, Calendar } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<number[][]>([]);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, heatmapRes, tripsRes] = await Promise.all([
          api.get("/admin/analytics/summary"),
          api.get("/admin/analytics/heatmap"),
          api.get("/itineraries?limit=10")
        ]);
        
        setStats(statsRes.data);
        setHeatmap(heatmapRes.data);
        setRecentTrips(tripsRes.data || []);
      } catch (e) {
        console.error("Failed to load analytics data", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const chartData =
    stats?.top_destinations?.map((d: any) => ({ name: d._id, value: d.count })) || [];

  const downloadReport = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        return;
      }

      const res = await fetch("http://localhost:8000/admin/reports/itineraries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Failed to download report");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `itineraries_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download report");
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 w-full max-w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics Dashboard</h1>
            <p className="text-gray-600">Real-time insights into platform usage and trends</p>
          </div>

          <button 
            onClick={downloadReport}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats?.total_users ?? "—"}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users size={24} className="text-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Trips Generated</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats?.total_trips ?? "—"}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <Map size={24} className="text-purple-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-green-600 font-medium">+8.2%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Budget</p>
                <h3 className="text-3xl font-bold text-gray-900">₹ {stats?.avg_budget ?? "—"}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
                <DollarSign size={24} className="text-emerald-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-green-600 font-medium">+5.1%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active This Month</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats?.active_month ?? "—"}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <Calendar size={24} className="text-orange-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-green-600 font-medium">+15.3%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </div>

        {/* Heatmap + Chart Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* World Heatmap - Equal space */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Travel Demand Heatmap</h2>
                <p className="text-sm text-gray-500 mt-1">Geographic distribution of travel destinations</p>
              </div>
            </div>
            <div className="h-[550px] rounded-lg overflow-hidden bg-gray-50">
              <WorldHeatmap points={heatmap} />
            </div>
          </div>

          {/* Top Destinations Chart - Equal space */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Top Destinations</h2>
              <p className="text-sm text-gray-500 mt-1">Most popular travel spots</p>
            </div>
            <div className="h-[550px]">
              <ChartsPlaceholder data={chartData} />
            </div>
          </div>
        </div>

        {/* Recent Trips Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Trips</h3>
                <p className="text-sm text-gray-500 mt-1">Latest itineraries created by users</p>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg">
                Last 30 days
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Budget
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTrips.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Map size={48} className="text-gray-300 mb-3" />
                        <p className="font-medium">No recent trips</p>
                        <p className="text-sm mt-1">Trips will appear here once users create itineraries</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentTrips.map((trip: any) => (
                    <tr key={trip._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{trip.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{trip.start_date} → {trip.end_date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-sm font-medium">
                          {trip.budget ? `₹ ${trip.budget}` : '—'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
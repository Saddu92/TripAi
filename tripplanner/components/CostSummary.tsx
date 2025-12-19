import { useEffect, useState } from "react";

export default function CostSummary() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("itinerary");
      if (!raw) return;
      const it = JSON.parse(raw);
      setSummary(it.budget_summary || { requested_budget: it.budget, estimated_total: 0, allocated_total: 0, per_day: [] });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!summary) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Cost Summary</h2>
        <p className="text-gray-600">No budget information available yet.</p>
      </div>
    );
  }

  const requested = summary.requested_budget;
  const estimated = summary.estimated_total || 0;
  const allocated = summary.allocated_total || 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Cost Summary</h2>

      <div className="text-sm text-gray-600 mb-3">
        {requested ? (
          <div>Budget: <span className="font-medium">{requested}</span></div>
        ) : (
          <div>No budget requested</div>
        )}
      </div>

      <ul className="space-y-2 text-gray-700 mb-3">
        <li>Estimated total: <strong>{estimated}</strong></li>
        <li>Allocated total: <strong>{allocated}</strong></li>
      </ul>

      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-3">
        <div
          className={`h-3 bg-green-400 transition-all duration-300`}
          style={{ width: requested ? `${Math.min(100, (allocated / requested) * 100)}%` : "0%" }}
        />
      </div>

      <div className="text-xs text-gray-500 mb-2">Per-day allocation</div>
      <ul className="space-y-1 text-sm text-gray-700">
        {(summary.per_day || []).map((d: any) => (
          <li key={d.day}>Day {d.day}: <strong>{d.allocated}</strong></li>
        ))}
      </ul>
    </div>
  );
}
  
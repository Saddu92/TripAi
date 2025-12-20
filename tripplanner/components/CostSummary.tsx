"use client";

import { useEffect, useState } from "react";

type ItineraryDay = {
  day?: number;
  places?: any[] | number;
};

type PerDaySummary = {
  day: number;
  places: number;
  allocated: number;
};

type NormalizedSummary = {
  requested_budget: number;
  estimated_total: number;
  allocated_total: number;
  per_day: PerDaySummary[];
};
import { DollarSign, BarChart2 } from "lucide-react";

function useAnimatedNumber(value: number, duration = 700) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf: number | undefined;
    const start = performance.now();
    const from = display;
    const to = value;

    function step(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const v = Math.round(from + (to - from) * t);
      setDisplay(v);
      if (t < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => {
      if (typeof raf !== "undefined") cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return display;
}

export default function CostSummary({ data }: { data?: any }) {
  const [summary, setSummary] = useState<NormalizedSummary | null>(null);

  useEffect(() => {
    if (data) {
      // If server provided a budget_summary, normalize and use it. Otherwise compute a simple allocation
      if (data.budget_summary) {
        const bs = data.budget_summary || {};
        const per_day = Array.isArray(bs.per_day)
          ? bs.per_day.map((d: any, i: number) => ({
              day: d?.day ?? i + 1,
              places: typeof d?.places === "number" ? d.places : 0,
              allocated: Number(d?.allocated ?? d?.amount ?? 0) || 0,
            }))
          : [];

        const requested_budget = Number(bs.requested_budget ?? data.budget ?? 0) || 0;
        const estimated_total = Number(bs.estimated_total ?? data.estimated_total ?? 0) || 0;
        const allocated_total = Number(bs.allocated_total ?? per_day.reduce((s: number, x: PerDaySummary) => s + (Number(x.allocated) || 0), 0)) || 0;

        setSummary({ requested_budget, estimated_total, allocated_total, per_day });
      } else {
        const requested = Number(data.budget ?? 0) || 0;
        const days: ItineraryDay[] = Array.isArray(data.days) ? data.days : [];

        // Determine weights per day: prefer number of places; fall back to equal weights
        const placeCounts = days.map((d: ItineraryDay) => (Array.isArray(d.places) ? (d.places as any[]).length : typeof d.places === "number" ? d.places : 0));
        const totalPlaces = placeCounts.reduce((s, v) => s + v, 0);
        const per_day: PerDaySummary[] = days.map((d: ItineraryDay, i: number) => ({
          day: d.day ?? i + 1,
          places: placeCounts[i] || 0,
          allocated: 0,
        }));

        // If the itinerary provides an estimated total cost, use that as the base to distribute.
        // Otherwise fall back to the requested budget.
        const providedEstimated = typeof data.estimated_total === "number" ? data.estimated_total : undefined;
        const baseAmount = typeof providedEstimated === "number" ? providedEstimated : requested;

        if (baseAmount > 0 && per_day.length > 0) {
          if (totalPlaces > 0) {
            // allocate proportional to places using baseAmount
            let allocatedSum = 0;
            per_day.forEach((pd: PerDaySummary, idx: number) => {
              const share = Math.round((placeCounts[idx] / totalPlaces) * baseAmount);
              pd.allocated = share;
              allocatedSum += share;
            });
            // adjust rounding difference to last day
            const diff = baseAmount - allocatedSum;
            per_day[per_day.length - 1].allocated += diff;
          } else {
            // even split when no places
            const even = Math.floor(baseAmount / per_day.length);
            per_day.forEach((pd: PerDaySummary) => (pd.allocated = even));
            const diff = baseAmount - even * per_day.length;
            if (diff > 0) per_day[per_day.length - 1].allocated += diff;
          }
        }

        const allocated_total = per_day.reduce((s: number, d: PerDaySummary) => s + (d.allocated || 0), 0);
        const estimated_total = Number(baseAmount) || 0;

        setSummary({ requested_budget: requested, estimated_total, allocated_total, per_day });
      }
      return;
    }

    try {
      const raw = localStorage.getItem("itinerary");
      if (!raw) return;
      const it = JSON.parse(raw);
      setSummary(it.budget_summary || { requested_budget: it.budget, estimated_total: 0, allocated_total: 0, per_day: [] });
    } catch (e) {
      // ignore
    }
  }, [data]);

  // derive numbers safely (may be null on first render)
  const requested = summary?.requested_budget ?? 0;
  const estimated = summary?.estimated_total ?? 0;
  const allocated = summary?.allocated_total ?? 0;

  // Call hooks unconditionally to preserve hook order across renders
  const animatedEstimated = useAnimatedNumber(estimated);
  const animatedAllocated = useAnimatedNumber(allocated);

  if (!summary) {
    return (
      <div className="card-style p-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-md"><BarChart2 className="text-indigo-600" size={18} /></div>
          <h2 className="text-lg font-semibold">Cost Summary</h2>
        </div>
        <p className="text-muted-foreground mt-3">No budget information available yet.</p>
      </div>
    );
  }

  const formatCurrency = (v?: number) => {
    const n = typeof v === "number" && !Number.isNaN(v) ? v : 0;
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
    } catch (e) {
      return String(n);
    }
  };

  const pct = requested ? Math.round((allocated / requested) * 100) : 0;

  return (
    <div className="card-style p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-md"><DollarSign className="text-indigo-600" size={18} /></div>
          <div>
            <h2 className="text-lg font-semibold">Cost Summary</h2>
            <div className="text-sm text-muted-foreground">Quick budget overview</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Allocated</div>
          <div className="text-xl font-bold">{formatCurrency(animatedAllocated)}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Requested</div>
          <div className="font-medium">{requested ? formatCurrency(requested) : "—"}</div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
          <div>Estimated</div>
          <div className="font-medium">{formatCurrency(animatedEstimated)}</div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mt-4">
          <div
            className={`h-3 bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700`}
            style={{ width: requested ? `${Math.min(100, pct)}%` : "0%" }}
          />
        </div>

        <div className="text-xs text-muted-foreground mt-2">{requested ? `${Math.min(100, pct)}% of budget used` : "No budget set"}</div>

        <div className="text-xs text-muted-foreground mb-2 mt-4">Per-day allocation</div>
        <ul className="space-y-2">
          {(summary.per_day || []).map((d: PerDaySummary) => (
            <li key={d.day} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors">
              <div className="text-sm text-gray-700">Day {d.day}</div>
              <div className="font-medium">{formatCurrency(d.allocated)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
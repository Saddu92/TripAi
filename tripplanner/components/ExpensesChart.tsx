"use client";

import React from "react";

export default function ExpensesChart({ perDay }: { perDay: Array<{ day: number; allocated: number }> }) {
  const max = Math.max(...perDay.map((p) => p.allocated), 1);

  const formatCurrency = (v: number) => {
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
    } catch (e) {
      return String(v);
    }
  };

  return (
    <div className="card-style p-4">
      <h3 className="text-lg font-semibold mb-3">Daily Budget Breakdown</h3>

      <div className="space-y-3">
        {perDay.map((d) => (
          <div key={d.day} className="flex items-center gap-3">
            <div className="w-12 text-sm text-muted-foreground">Day {d.day}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 bg-gradient-to-r from-indigo-400 to-indigo-600"
                style={{ width: `${Math.round((d.allocated / max) * 100)}%` }}
              />
            </div>
            <div className="w-24 text-right text-sm font-medium">{formatCurrency(d.allocated)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

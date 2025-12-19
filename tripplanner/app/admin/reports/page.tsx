"use client";

export default function ReportsPage() {
  const downloadCSV = () => {
    window.open("http://localhost:8000/admin/reports/itineraries");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <button
        onClick={downloadCSV}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Download Itineraries CSV
      </button>
    </div>
  );
}

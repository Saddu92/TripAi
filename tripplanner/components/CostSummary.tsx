export default function CostSummary() {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Cost Summary</h2>
        <ul className="space-y-2 text-gray-700">
          <li>Flights: ₹35,000</li>
          <li>Stay: ₹20,000</li>
          <li>Food: ₹10,000</li>
          <li>Attractions: ₹15,000</li>
        </ul>
  
        <hr className="my-3" />
  
        <p className="font-bold text-lg">Total: ₹80,000</p>
      </div>
    );
  }
  
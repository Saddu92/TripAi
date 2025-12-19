type Props = {
    title: string;
    value: string;
  };
  
  export default function StatsCard({ title, value }: Props) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 text-center shadow-lg">
        <h3 className="text-gray-400 mb-2">{title}</h3>
        <p className="text-4xl font-bold">{value}</p>
      </div>
    );
  }
  
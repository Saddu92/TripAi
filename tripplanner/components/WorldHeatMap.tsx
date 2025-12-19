import dynamic from "next/dynamic";

const WorldHeatmap = dynamic(
  () => import("./WorldHeatMap.client"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex items-center justify-center text-gray-400 bg-gray-900 rounded-xl">
        Loading map…
      </div>
    ),
  }
);

export default WorldHeatmap;

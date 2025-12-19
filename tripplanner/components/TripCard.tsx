import Image from "next/image";
import { Button } from "./ui/button";

type TripCardProps = {
  id: number;
  title: string;
  destination: string;
  dates: string;
  image: string;
  
};



export default function TripCard({ title, destination, dates, image }: TripCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="h-48 relative">
        <Image
          src={image}
          alt={destination}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">{dates}</p>

        <Button className="w-full mt-3 bg-blue-600">View Itinerary</Button>
      </div>
    </div>
  );
}

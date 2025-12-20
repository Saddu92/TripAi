import Image from "next/image";
import { Button } from "./ui/button";

type TripCardProps = {
  id?: number | string;
  title: string;
  destination?: string;
  dates?: string;
  image?: string;
};

export default function TripCard({ title, destination, dates, image }: TripCardProps) {
  return (
    <article className="card-style overflow-hidden rounded-xl shadow-sm">
      <div className="relative h-44 w-full bg-gray-100">
        {image ? (
          <Image src={image} alt={destination ?? title} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">No image</div>
        )}
        <div className="absolute left-4 top-4 bg-white/80 px-3 py-1 rounded-md text-sm">{destination}</div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {dates && <p className="text-sm text-muted-foreground">{dates}</p>}

        <div className="pt-3">
          <Button className="w-full btn-primary-soft">View Itinerary</Button>
        </div>
      </div>
    </article>
  );
}

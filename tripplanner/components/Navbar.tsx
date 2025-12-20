
import AvatarMenu from "./AvatarMenu";
import Link from "next/link";
export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-4 py-3 bg-white/80 backdrop-blur-sm border-b">
      <Link href="/" className="text-2xl font-bold text-indigo-600">
        AI Travel Buddy ✈️
      </Link>

      <nav className="hidden md:flex gap-6 text-base">
        <Link href="/planner" className="hover:text-indigo-600">Plan Trip</Link>
        <Link href="/trips" className="hover:text-indigo-600">My Trips</Link>
        <Link href="/admin/analytics" className="hover:text-indigo-600">Admin</Link>
      </nav>

      <AvatarMenu />
    </header>
  );
}

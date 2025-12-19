
import AvatarMenu from "./AvatarMenu";
import Link from "next/link";
export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        AI Travel Buddy ✈️
      </Link>

      <nav className="hidden md:flex gap-6 text-lg">
        <Link href="/planner" className="hover:text-blue-600">Plan Trip</Link>
        <Link href="/trips" className="hover:text-blue-600">My Trips</Link>
        <Link href="/admin/analytics" className="hover:text-blue-600">Admin</Link>
      </nav>

      <AvatarMenu />
    </header>
  );
}

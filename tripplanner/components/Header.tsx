// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import UserProfileMenu from "@/components/userProfileMenu";
// import { Button } from "@/components/ui/button";

// export default function Header() {
//   const [mounted, setMounted] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     setIsLoggedIn(!!localStorage.getItem("token"));
//   }, []);

//   if (!mounted) return null;

//   return (
//     <header className="card-style flex justify-between items-center px-6 py-4 mb-8">
//       <div className="flex items-center gap-3">
//         <Link href="/" className="text-xl font-semibold text-gray-900">
//           AI Travel Buddy
//         </Link>
//         <span className="hidden md:block text-sm text-gray-400">
//           Smart itinerary planner
//         </span>
//       </div>

//       <div className="flex items-center gap-4">
//         {!isLoggedIn && (
//           <Link href="/login">
//             <Button className="btn-outline">Login</Button>
//           </Link>
//         )}
//         <UserProfileMenu />
//       </div>
//     </header>
//   );
// }

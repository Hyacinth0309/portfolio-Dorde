"use client"; // Kailangan ito para gumana ang usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname(); // Kinukuha kung nasaang page ka ngayon

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          M&R.
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-400">
          
          {/* HOME LINK */}
          <Link 
            href="/" 
            className={`transition-all duration-300 pb-1 ${
              pathname === "/" ? "text-white border-b-2 border-blue-400" : "hover:text-white"
            }`}
          >
            Home
          </Link>

          {/* PROJECTS LINK */}
          <Link 
            href="/Projects" 
            className={`transition-all duration-300 pb-1 ${
              pathname.startsWith("/Projects") ? "text-white border-b-2 border-blue-400" : "hover:text-white"
            }`}
          >
            Projects
          </Link>

         {/* CONTACT LINK */}
          <Link 
            href="/contact" 
            className={`transition-all duration-300 pb-1 ${
              pathname === "/contact" ? "text-white border-b-2 border-blue-400" : "hover:text-white"
            }`}
          >
            Contact
          </Link>

        </nav>
      </div>
    </header>
  );
}
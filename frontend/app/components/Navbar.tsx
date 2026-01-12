"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // Icons for the button

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State to toggle menu
  const pathname = usePathname();

  // Helper for Desktop Links
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `px-3 py-2 text-sm font-medium transition duration-150 ease-in-out ${
      isActive 
        ? "text-blue-600 font-bold" 
        : "text-gray-500 hover:text-black"
    }`;
  };

  // Helper for Mobile Links (Needs 'block' to take full width)
  const getMobileLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? "bg-blue-50 text-blue-700 font-bold"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* --- LOGO --- */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
              CardioAI
            </Link>
          </div>

          {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
          <div className="hidden sm:flex sm:space-x-8">
            <Link href="/" className={getLinkClass('/')}>
              Home
            </Link>
            <Link href="/diagnose" className={getLinkClass('/diagnose')}>
              Start Diagnosis
            </Link>
            <Link href="/insights" className={getLinkClass('/insights')}>
              Model Insights
            </Link>
          </div>

          {/* --- MOBILE MENU BUTTON (Visible only on Mobile) --- */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-900 p-2 rounded-md focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {/* Only renders when isOpen is true */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className={getMobileLinkClass('/')}
              onClick={() => setIsOpen(false)} // Close menu when clicked
            >
              Home
            </Link>
            <Link 
              href="/diagnose" 
              className={getMobileLinkClass('/diagnose')}
              onClick={() => setIsOpen(false)}
            >
              Start Diagnosis
            </Link>
            <Link 
              href="/insights" 
              className={getMobileLinkClass('/insights')}
              onClick={() => setIsOpen(false)}
            >
              Model Insights
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
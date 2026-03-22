"use client";

import { Home, Search, Bookmark } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 pb-safe md:hidden z-50">
      <ul className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        <li>
          <button className="flex flex-col items-center gap-1.5 text-black">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">홈</span>
          </button>
        </li>
        <li>
          <button className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-black transition-colors">
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-bold">검색</span>
          </button>
        </li>
        <li>
          <button className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-black transition-colors">
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px] font-bold">저장</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

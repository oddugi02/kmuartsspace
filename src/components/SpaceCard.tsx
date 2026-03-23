"use client";

import { useState } from "react";
import { Location } from "@/data/locations";
import { Copy, Check, Instagram, MapPin, Clock, Globe, Heart } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { useAuth } from "@/context/AuthContext";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SpaceCard({ space }: { space: Location }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentUser, toggleBookmark } = useAuth();
  
  const isBookmarked = currentUser?.bookmarks.includes(space.id) || false;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(space.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const mapLink = `https://map.naver.com/p/search/${encodeURIComponent(space.address)}`;

  return (
    <div 
      className="relative bg-white border border-gray-200 rounded-[1.5rem] p-6 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
      onClick={() => setIsOpen(!isOpen)}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); toggleBookmark(space.id); }}
        className="absolute top-5 right-5 z-20 p-2 lg:-mr-2 lg:-mt-2 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-95 bg-white/50 hover:bg-white backdrop-blur-sm"
        aria-label="북마크"
      >
        <Heart className={cn("w-6 h-6 transition-colors drop-shadow-sm", isBookmarked ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-red-400")} />
      </button>

      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-2.5 flex-1 relative group/title">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex w-fit px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold tracking-widest shadow-sm">
              {space.category}
            </div>
            {space.exhibitionStatus && (
              <div 
                className={cn(
                  "inline-flex w-fit px-3 py-1 rounded-full text-xs font-bold tracking-widest shadow-sm border",
                  space.exhibitionStatus === "현재 전시 중" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-orange-50 text-orange-700 border-orange-200"
                )}
              >
                {space.exhibitionStatus}
              </div>
            )}
          </div>
          
          <h3 className="relative text-2xl md:text-[28px] leading-tight font-extrabold tracking-tight text-gray-900 transition-colors inline-block w-fit">
            {space.name}
            
            {/* Hover Floating Image Tooltip */}
            {space.imageUrl && (
              <div 
                className="absolute hidden md:block shrink-0 pointer-events-none z-50 
                           bottom-[105%] left-0
                           w-64 h-40 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] border-2 border-white 
                           overflow-hidden bg-gray-100
                           opacity-0 scale-95 origin-bottom-left group-hover/title:opacity-100 group-hover/title:scale-100 group-hover/title:-translate-y-1
                           transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={space.imageUrl} 
                  alt={space.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
          </h3>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-500 mt-0.5 pr-2 leading-relaxed break-keep">
              {space.description}
            </p>
            {space.designTags && space.designTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                {space.designTags.map(tag => (
                  <span key={tag} className="text-[12px] font-bold text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end shrink-0 pt-1">
        </div>
      </div>

      <div
        className={cn(
          "grid transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0 mt-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-5 text-base text-gray-600 bg-slate-50 p-5 md:p-6 rounded-2xl border border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100 text-blue-500">
                  <Clock className="w-[18px] h-[18px]" />
                </div>
                <span className="font-bold text-gray-800 mt-[7px] text-[15px]">{space.hours}</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100 text-indigo-500">
                  <MapPin className="w-[18px] h-[18px]" />
                </div>
                <div className="flex items-center flex-wrap gap-2.5 mt-1">
                  <span className="font-semibold text-gray-800 text-[15px]">{space.address}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleCopy}
                      aria-label="주소 복사"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[13px] font-bold bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm transition-all active:scale-95"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      {copied ? "복사됨" : "복사"}
                    </button>
                    <a 
                      href={mapLink} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] font-bold text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition-all active:scale-95"
                    >
                      지도 보기 <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {(space.instagram || space.website) && (
                <div className="flex flex-wrap items-center gap-3 mt-1 pl-12">
                  {space.website && (
                    <a 
                      href={space.website} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 font-bold text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-200 bg-white shadow-sm px-3 py-1.5 rounded-lg transition-all active:scale-95"
                    >
                      <Globe className="w-4 h-4 text-gray-500" />
                      Website
                    </a>
                  )}
                  {space.instagram && (
                    <a 
                      href={space.instagram} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 font-bold text-pink-600 hover:text-pink-700 hover:bg-pink-50 border border-pink-100 bg-white shadow-sm px-3 py-1.5 rounded-lg transition-all active:scale-95"
                    >
                      <Instagram className="w-4 h-4 text-pink-500" />
                      Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
            
            {/* Inline image for Mobile specifically */}
            {space.imageUrl && (
              <div className="w-full h-48 md:hidden mt-3 rounded-xl overflow-hidden bg-gray-200 border border-gray-100 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={space.imageUrl} 
                  alt={space.name} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

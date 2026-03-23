"use client";

import { useState, useMemo, useEffect } from "react";
import { locations } from "@/data/locations";
import { SpaceCard } from "@/components/SpaceCard";
import { BottomNav } from "@/components/BottomNav";
import { isOpenNow } from "@/utils/time";
import { useAuth } from "@/context/AuthContext";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export default function Home() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "distance" | "category">("name");
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [activeDesignTag, setActiveDesignTag] = useState<string>("전체");
  const [isTagLoading, setIsTagLoading] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const { currentUser, openAuthModal, logout } = useAuth();

  const allDesignTags = useMemo(() => {
    const tags = new Set<string>();
    locations.forEach(loc => {
      if (loc.designTags) {
        loc.designTags.forEach(t => tags.add(t));
      }
    });
    return ["전체", ...Array.from(tags).sort()];
  }, []);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setShowBookmarksOnly(false);
    }
  }, [currentUser]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("위치 정보를 가져올 수 없습니다. 권한 설정을 확인해주세요.");
        setSortBy("name");
      }
    );
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const displayLocations = useMemo(() => {
    let result = locations;

    if (showBookmarksOnly && currentUser) {
      result = result.filter(loc => currentUser.bookmarks.includes(loc.id));
    }

    if (filterOpen && currentTime) {
      result = result.filter(
        (loc) => isOpenNow(loc.hours, currentTime) && loc.exhibitionStatus !== "전시 준비 중"
      );
    }


    if (activeDesignTag !== "전체") {
      result = result.filter((loc) => loc.designTags?.includes(activeDesignTag));
    }

    // Apply Sorting
    result = [...result].sort((a, b) => {
      // Priority 1: Exhibition Preparing at bottom
      const aIsPreparing = a.exhibitionStatus === "전시 준비 중" ? 1 : 0;
      const bIsPreparing = b.exhibitionStatus === "전시 준비 중" ? 1 : 0;
      if (aIsPreparing !== bIsPreparing) return aIsPreparing - bIsPreparing;

      // Priority 2: Selected Sort
      if (sortBy === "distance" && userLocation) {
        if (!a.lat || !a.lng) return 1;
        if (!b.lat || !b.lng) return -1;
        const distA = getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      }

      if (sortBy === "category") {
        return a.category.localeCompare(b.category, 'ko');
      }

      // Default: name (ㄱㄴㄷ)
      return a.name.localeCompare(b.name, 'ko');
    });

    return result;
  }, [filterOpen, currentTime, activeDesignTag, showBookmarksOnly, currentUser?.bookmarks, sortBy, userLocation]);

  if (!currentTime) return null;

  return (
    <main className="min-h-screen pb-24 md:pb-16 bg-slate-50 selection:bg-blue-200 selection:text-blue-900">
      {/* Header & Sticky Tabs */}
      <header className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur-xl border-b border-gray-200 py-4 md:py-6">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 drop-shadow-sm">
              시디과 여기어때
            </h1>
            <div className="flex flex-col gap-2.5">
              <p className="text-sm md:text-base font-bold text-gray-500 tracking-wide mt-1">
                시디과 학생이라면 방문하기 좋은 문화예술공간 추천집
              </p>
              <div className="inline-flex items-center justify-center px-2.5 py-1 bg-slate-100/80 rounded-md w-fit border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 tracking-tight">
                  {!currentUser ? "💡 로그인하면 특별한 장소들을 스크랩할 수 있어요" : "💡 추천 공간은 정기적으로 업데이트됩니다"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 mt-4 md:mt-0">

            {currentUser ? (
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100">
                <span className="text-sm font-bold text-gray-800">
                  <span className="text-blue-600">{currentUser.name}</span>님 환영합니다✨
                </span>
                <div className="w-px h-3.5 bg-gray-200" />
                <button
                  onClick={() => {
                    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
                      logout();
                    }
                  }}
                  className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 px-5 rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 text-sm"
              >
                로그인 / 회원가입
              </button>
            )}
            {currentUser && (
              <div
                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                className="flex items-center gap-3 cursor-pointer group bg-white border border-gray-200 px-4 py-2.5 rounded-2xl hover:border-pink-300 hover:shadow-sm transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700 select-none group-hover:text-pink-600 transition-colors">
                    내가 찜한 곳
                  </span>
                </div>
                <div
                  className={`relative w-[42px] h-[22px] rounded-full transition-colors duration-400 ease-out border overflow-hidden ${showBookmarksOnly ? "bg-pink-500 border-pink-600" : "bg-gray-200 border-gray-300"
                    }`}
                >
                  <div
                    className={`absolute top-[1.5px] left-[1.5px] bg-white w-4 h-4 rounded-full transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-sm ${showBookmarksOnly ? "translate-x-[18px]" : "translate-x-0"
                      }`}
                  />
                </div>
              </div>
            )}

            <div
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-3 cursor-pointer group bg-white border border-gray-200 px-4 py-2.5 rounded-2xl hover:border-blue-300 hover:shadow-sm transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] active:scale-95"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-700 select-none group-hover:text-black transition-colors">
                  현재 운영 중
                </span>
              </div>
              <div
                className={`relative w-[42px] h-[22px] rounded-full transition-colors duration-400 ease-out border overflow-hidden ${filterOpen ? "bg-blue-500 border-blue-600" : "bg-gray-200 border-gray-300"
                  }`}
              >
                <div
                  className={`absolute top-[1.5px] left-[1.5px] bg-white w-4 h-4 rounded-full transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-sm ${filterOpen ? "translate-x-[18px]" : "translate-x-0"
                    }`}
                />
              </div>
            </div>

          </div>
        </div>

      </header>

      {/* Grid Content */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 md:py-16 min-h-[500px]">
        {isTagLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4 text-center mt-12 animate-in fade-in duration-300">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold mt-2">조건에 맞는 공간을 로딩 중입니다...</p>
          </div>
        ) : displayLocations.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4 text-center mt-12 animate-in fade-in zoom-in-95 duration-500">
            <p className="text-xl font-bold text-gray-500 bg-white px-6 py-3 rounded-2xl border border-gray-200 shadow-sm">
              조건에 맞는 공간이 없습니다.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col gap-3 mb-8 md:mb-12 ml-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 shrink-0">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-2xl inline-block hover:-translate-y-0.5 transition-transform cursor-pointer">
                    추천 공간 리스트
                  </h2>
                  <span className="text-base font-bold text-blue-600 bg-white border border-blue-100 px-3 py-1 rounded-xl shadow-sm">
                    {displayLocations.length}곳
                  </span>
                </div>

                {/* Sorting Dropdown */}
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex items-center gap-3 bg-white px-2 py-2 rounded-2xl border border-gray-200 shadow-sm">
                    <button 
                      onClick={() => setSortBy("name")}
                      className={cn(
                        "px-4 py-1.5 rounded-xl text-sm font-bold transition-all",
                        sortBy === "name" ? "bg-gray-900 text-white shadow-md scale-105" : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      기본순
                    </button>
                    <button 
                      onClick={() => {
                        if (sortBy !== "distance") {
                          setSortBy("distance");
                          requestLocation();
                        }
                      }}
                      className={cn(
                        "px-4 py-1.5 rounded-xl text-sm font-bold transition-all",
                        sortBy === "distance" ? "bg-blue-600 text-white shadow-md scale-105" : "text-gray-500 hover:text-blue-600"
                      )}
                    >
                      가까운순
                    </button>
                  </div>
                  {sortBy === "distance" && (
                    <p className="text-[10px] md:text-xs font-bold text-blue-500/80 pr-2">
                      💡 브라우저 Geolocation API를 연동하여 현재 위치에서의 거리를 km 단위로 표시합니다
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 items-start">
              {displayLocations.map((space) => {
                const distanceText = userLocation && space.lat && space.lng 
                  ? `${getDistance(userLocation.lat, userLocation.lng, space.lat, space.lng).toFixed(1)}km` 
                  : undefined;
                return <SpaceCard key={space.id} space={space} distance={distanceText} />;
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { locations } from "@/data/locations";
import { SpaceCard } from "@/components/SpaceCard";
import { BottomNav } from "@/components/BottomNav";
import { isOpenNow } from "@/utils/time";

type TimeRange = "전체" | "30분 내외" | "30분~1시간" | "1시간~1시간 30분";

const timeTabs: TimeRange[] = [
  "전체",
  "30분 내외",
  "30분~1시간",
  "1시간~1시간 30분",
];

function getTimeCategory(timeStr: string): TimeRange {
  const match = timeStr.match(/(\d+)~(\d+)/);
  let average = 0;

  if (match) {
    average = (parseInt(match[1], 10) + parseInt(match[2], 10)) / 2;
  } else {
    average = parseInt(timeStr, 10);
  }

  if (isNaN(average)) return "전체";

  if (average <= 30) return "30분 내외";
  if (average <= 60) return "30분~1시간";
  return "1시간~1시간 30분";
}

const timeTags: Record<TimeRange, string[]> = {
  "전체": [],
  "30분 내외": ["2-3시간 공강", "가벼운 외출"],
  "30분~1시간": ["오전/오후 공강", "여유로운 날"],
  "1시간~1시간 30분": ["1교시만 있는 날", "공강데이", "주말"]
};

export default function Home() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TimeRange>("전체");
  const [activeDesignTag, setActiveDesignTag] = useState<string>("전체");
  const [isTagLoading, setIsTagLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

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

  const displayLocations = useMemo(() => {
    let result = locations;

    if (filterOpen && currentTime) {
      result = result.filter(
        (loc) => isOpenNow(loc.hours, currentTime) && loc.exhibitionStatus !== "전시 준비 중"
      );
    }

    if (activeTab !== "전체") {
      result = result.filter((loc) => getTimeCategory(loc.timeFromKMU) === activeTab);
    }

    if (activeDesignTag !== "전체") {
      result = result.filter((loc) => loc.designTags?.includes(activeDesignTag));
    }

    return result.sort((a, b) => {
      const getAvg = (str: string) => {
        const m = str.match(/(\d+)~(\d+)/);
        return m ? (parseInt(m[1]) + parseInt(m[2])) / 2 : (parseInt(str) || 0);
      };
      return getAvg(a.timeFromKMU) - getAvg(b.timeFromKMU);
    });
  }, [filterOpen, currentTime, activeTab, activeDesignTag]);

  if (!currentTime) return null;

  return (
    <main className="min-h-screen pb-24 md:pb-16 bg-slate-50 selection:bg-blue-200 selection:text-blue-900">
      {/* Header & Sticky Tabs */}
      <header className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur-xl border-b border-gray-200 py-4 md:py-6">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 drop-shadow-sm">
              Seoul Arts Space
            </h1>
            <p className="text-sm md:text-base font-bold text-gray-500 tracking-wide mt-1">
              국민대 시각디자인 학생들을 위한 큐레이션 스페이스
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 mt-4 md:mt-0">
            {/* Design Tag Filter */}
            <div className="relative">
              <select
                value={activeDesignTag}
                onChange={(e) => {
                  const newTag = e.target.value;
                  if (newTag !== activeDesignTag) {
                    setIsTagLoading(true);
                    setActiveDesignTag(newTag);
                    setTimeout(() => {
                      setIsTagLoading(false);
                    }, 600); // 0.6s fake loading delay
                  }
                }}
                className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-2xl px-4 py-2.5 pr-10 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] cursor-pointer"
              >
                {allDesignTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag === "전체" ? "모든 테마" : tag}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

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

        {/* Time Filter Tabs */}
        <div className="max-w-[1240px] mx-auto px-6 pt-5 md:pt-6">
          <div className="flex overflow-x-auto no-scrollbar gap-3 snap-x pb-2">
            {timeTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-none px-5 py-2.5 rounded-2xl text-[15px] font-bold transition-all snap-start ${activeTab === tab
                  ? "bg-blue-600 border border-blue-700 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] transform -translate-y-0.5"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-gray-800 hover:bg-blue-50/50"
                  }`}
              >
                {tab}
              </button>
            ))}
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
              {timeTags[activeTab] && timeTags[activeTab].length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pl-1 text-blue-500 font-bold text-sm tracking-tight opacity-90">
                  {timeTags[activeTab].map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-white border border-blue-100 rounded-lg shadow-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3.5">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-2xl inline-block hover:-translate-y-0.5 transition-transform cursor-pointer">
                  {activeTab === "전체" ? "모두 보기" : activeTab}
                </h2>
                <span className="text-base font-bold text-blue-600 bg-white border border-blue-100 px-3 py-1 rounded-xl shadow-sm">
                  {displayLocations.length}곳
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 items-start">
              {displayLocations.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

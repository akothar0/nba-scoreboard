"use client";

import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateNavProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getDayLabel(date: Date, today: Date): string {
  const diff = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === -1) return "Yesterday";
  if (diff === 1) return "Tomorrow";
  return "";
}

function generateDates(centerDate: string): Date[] {
  const center = new Date(centerDate + "T12:00:00");
  const dates: Date[] = [];
  for (let i = -7; i <= 7; i++) {
    const d = new Date(center);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function DateNav({ selectedDate, onDateChange }: DateNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLButtonElement>(null);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const dates = generateDates(selectedDate);

  // Scroll to selected date on mount
  useEffect(() => {
    if (todayRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = todayRef.current;
      container.scrollLeft = el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2;
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const goToPrev = () => {
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() - 1);
    onDateChange(formatDate(d));
  };

  const goToNext = () => {
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    onDateChange(formatDate(d));
  };

  return (
    <div className="relative flex items-center gap-1">
      {/* Left arrow — navigate prev day */}
      <button
        onClick={goToPrev}
        className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Scrollable date strip */}
      <div
        ref={scrollRef}
        className="flex-1 flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth py-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dates.map((date) => {
          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedDate;
          const isToday = formatDate(today) === dateStr;
          const dayLabel = getDayLabel(date, today);

          return (
            <button
              key={dateStr}
              ref={isSelected ? todayRef : undefined}
              onClick={() => onDateChange(dateStr)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 min-w-[4rem] transition-all duration-200 flex-shrink-0",
                isSelected
                  ? "bg-foreground text-background shadow-lg scale-105"
                  : isToday
                    ? "bg-muted/80 text-foreground hover:bg-muted"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {dayLabel || DAY_NAMES[date.getDay()]}
              </span>
              <span className={cn("text-lg font-bold font-mono tabular-nums leading-none", isSelected && "text-background")}>
                {date.getDate()}
              </span>
              <span className="text-[10px] opacity-70">
                {MONTH_NAMES[date.getMonth()]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right arrow — navigate next day */}
      <button
        onClick={goToNext}
        className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Next day"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

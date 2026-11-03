import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CalendarView() {
  const { currentUser } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(10); // 10 = November (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Known sample leaves and holidays for Nov 2026
  const getEventsForDay = (day) => {
    if (currentYear === 2026 && currentMonth === 10) {
      if (day === 10) {
        return [{ type: 'holiday', title: 'Hari Pahlawan' }];
      }
      if (day >= 16 && day <= 18) {
        return [{ type: 'user', title: currentUser?.nama?.split(',')[0] || 'Ahmad Fauzi' }];
      }
      if (day >= 20 && day <= 24 && day !== 21 && day !== 22) {
        return [{ type: 'colleague', title: 'Dewi Lestari' }];
      }
    }
    return [];
  };

  // Calculate calendar grid (Monday to Sunday)
  // Day 0: Sun, 1: Mon, ..., 6: Sat
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  // We want Monday as index 0, so: Mon (1) -> 0, ..., Sun (0) -> 6
  const leadingBlanks = (firstDay + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < leadingBlanks; i++) {
    days.push({ blank: true, key: `b-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = (leadingBlanks + d - 1) % 7; // 5 is Sat, 6 is Sun
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    days.push({
      blank: false,
      day: d,
      isWeekend,
      events: getEventsForDay(d),
      key: `d-${d}`
    });
  }

  return (
    <div className="flex-1 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-1">
        <div>
          <h1 className="text-[26px] font-semibold text-[#1c2530] m-0 tracking-tight">
            Kalender unit
          </h1>
          <div className="text-[13px] text-[#5a6472] mt-1.5">
            Cuti rekan satu unit dan libur nasional.
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 text-[15px] font-medium text-[#1c2530]">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Bulan sebelumnya"
            className="px-3 py-1.5 border border-[#b9bfb8] rounded-[6px] text-[#1c2530] hover:bg-[#e8ebe6] transition-colors cursor-pointer"
          >
            ‹
          </button>
          <span className="px-2">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Bulan berikutnya"
            className="px-3 py-1.5 border border-[#b9bfb8] rounded-[6px] text-[#1c2530] hover:bg-[#e8ebe6] transition-colors cursor-pointer"
          >
            ›
          </button>
        </div>
      </div>

      {/* 7-Column Calendar Card */}
      <div className="lawet-card overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-[#dcdfda]">
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
            <div
              key={day}
              className="p-2.5 text-[12px] font-medium text-[#5a6472] text-center sm:text-left"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7">
          {days.map((item) => {
            if (item.blank) {
              return (
                <div
                  key={item.key}
                  className="min-h-[96px] border-r border-b border-[#e8ebe6] bg-[#f9faf9]/40"
                />
              );
            }

            return (
              <div
                key={item.key}
                className={`min-h-[96px] border-r border-b border-[#e8ebe6] p-2 text-[13px] flex flex-col justify-between ${
                  item.isWeekend ? 'bg-[#f7f8f6]' : 'bg-white'
                }`}
              >
                <span className="font-medium text-[#1c2530]">{item.day}</span>

                <div className="flex flex-col gap-1 mt-1">
                  {item.events.map((evt, idx) => {
                    let badgeStyle = 'bg-[#ecece8] text-[#3b4654]';
                    if (evt.type === 'holiday') {
                      badgeStyle = 'bg-[#fbe9e9] text-[#8a1f1f]';
                    } else if (evt.type === 'user') {
                      badgeStyle = 'bg-[#e3eaf1] text-[#173a5e] font-medium';
                    }

                    return (
                      <span
                        key={idx}
                        className={`text-[11px] sm:text-[12px] px-1.5 py-0.5 rounded-[4px] truncate leading-tight ${badgeStyle}`}
                        title={evt.title}
                      >
                        {evt.title}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#5a6472] mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#e3eaf1] border border-[#173a5e]/30 inline-block rounded-xs"></span>
          Cuti Anda
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#ecece8] inline-block rounded-xs"></span>
          Cuti rekan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#fbe9e9] inline-block rounded-xs"></span>
          Libur nasional
        </span>
        <span className="text-[#5a6472]">
          Cuti bersama ditandai tersendiri dan tidak memotong cuti tahunan.
        </span>
      </div>
    </div>
  );
}

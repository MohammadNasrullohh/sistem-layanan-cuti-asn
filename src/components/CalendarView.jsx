import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Building, 
  Sparkles,
  Info
} from 'lucide-react';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // November 2026
  const [eventsData, setEventsData] = useState({ leaves: [], holidays: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/calendar/events');
      const data = await res.json();
      setEventsData(data);
    } catch (err) {
      console.error('Failed to load calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days for the current month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Kalender Cuti Bersama & Cuti Pegawai</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Jadwal Libur & Cuti Terpadu ASN
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Visualisasi cuti pegawai, libur nasional resmi, dan ketetapan Cuti Bersama Republik Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="px-4 py-2 font-bold text-slate-800 text-sm">
            {monthNames[month]} {year}
          </div>
          <button
            onClick={handleNextMonth}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider mb-4">
          <div className="py-2 text-rose-500 bg-rose-50/50 rounded-xl">Minggu</div>
          <div className="py-2 text-slate-600">Senin</div>
          <div className="py-2 text-slate-600">Selasa</div>
          <div className="py-2 text-slate-600">Rabu</div>
          <div className="py-2 text-slate-600">Kamis</div>
          <div className="py-2 text-slate-600">Jumat</div>
          <div className="py-2 text-rose-500 bg-rose-50/50 rounded-xl">Sabtu</div>
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells before 1st day */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[90px] p-2 rounded-2xl bg-slate-50/40 border border-transparent"></div>
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isWeekend = (firstDayIndex + idx) % 7 === 0 || (firstDayIndex + idx) % 7 === 6;

            // Check holidays
            const holiday = eventsData.holidays.find(h => h.tanggal === dateStr);
            // Check leaves
            const dayLeaves = eventsData.leaves.filter(l => {
              return dateStr >= l.tanggal_mulai && dateStr <= l.tanggal_selesai;
            });

            return (
              <div
                key={dayNum}
                className={`min-h-[95px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                  holiday
                    ? 'bg-rose-50/70 border-rose-200'
                    : isWeekend
                    ? 'bg-slate-50/60 border-slate-100'
                    : 'bg-white border-slate-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${
                    holiday || isWeekend ? 'text-rose-600' : 'text-slate-800'
                  }`}>
                    {dayNum}
                  </span>
                  {holiday && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-200 text-rose-800">
                      {holiday.is_cuti_bersama ? 'Cuti Bersama' : 'Libur'}
                    </span>
                  )}
                </div>

                {/* Holiday label */}
                {holiday && (
                  <div className="text-[10px] font-semibold text-rose-700 line-clamp-1 mt-1">
                    {holiday.keterangan}
                  </div>
                )}

                {/* Leaves on this day */}
                <div className="space-y-1 mt-1">
                  {dayLeaves.map(leave => (
                    <div
                      key={leave.id}
                      className="px-1.5 py-0.5 rounded-md text-[10px] bg-orange-100 text-orange-800 font-medium truncate flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                      <span className="truncate">{leave.employee_name} ({leave.jenis_cuti.replace('cuti_', '')})</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span>Cuti Pegawai (Disetujui/Diajukan)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span>Hari Libur Nasional</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-300"></span>
            <span>Cuti Bersama Resmi (Tidak memotong Cuti Tahunan)</span>
          </div>
        </div>

      </div>

    </div>
  );
}

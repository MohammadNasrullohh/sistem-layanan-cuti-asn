import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Calendar, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  MessageSquare, 
  ChevronDown, 
  Clock, 
  Home, 
  LayoutDashboard, 
  CalendarDays, 
  Menu, 
  X, 
  PlusCircle, 
  ShieldCheck, 
  Check, 
  FileSpreadsheet, 
  LogOut,
  ArrowLeft
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenWhatsApp, pendingApprovalCount = 0 }) {
  const { employees, currentUser, switchUser, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return null;

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sisa-cuti', label: 'Sisa Cuti', icon: Clock },
    { id: 'ajukan-cuti', label: 'Ajukan Cuti', icon: PlusCircle },
    // Only show Persetujuan for Atasan, PPK, and Admin
    ...((currentUser.role === 'atasan' || currentUser.role === 'ppk' || currentUser.role === 'admin') ? [
      { id: 'persetujuan', label: 'Persetujuan', icon: CheckSquare, badge: pendingApprovalCount }
    ] : []),
    // Only show Rekapitulasi for Admin & PPK
    ...((currentUser.role === 'admin' || currentUser.role === 'ppk') ? [
      { id: 'rekapitulasi', label: 'Rekapitulasi', icon: FileSpreadsheet }
    ] : []),
    { id: 'kalender', label: 'Kalender', icon: CalendarDays },
    { id: 'buku-saku', label: 'Buku Saku', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Parent Hub Connector & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            <button
              onClick={() => setActiveTab('beranda')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors pr-2.5 sm:pr-3.5 border-r border-slate-200 select-none cursor-pointer"
              title="Kembali ke Dashboard Utama LawetHub"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Dashboard</span>
              <span>LawetHub</span>
            </button>

            <div 
              className="flex items-center gap-2 cursor-pointer shrink-0" 
              onClick={() => setActiveTab('beranda')}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 shrink-0">
                <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">Layanan Cuti</span>
                  <span className="text-[9px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700">
                    Modul ASN
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:inline leading-none font-medium">
                  Peraturan BKN No. 7/2021
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (Smooth horizontal flow, never wraps text) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-nowrap overflow-x-auto no-scrollbar py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 select-none ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 font-bold shadow-2xs ring-1 ring-orange-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shrink-0 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Area: WhatsApp Bot Trigger & User / Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* WhatsApp Chatbot Trigger */}
            <button
              onClick={onOpenWhatsApp}
              className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all whitespace-nowrap shrink-0"
              title="Buka Chatbot WhatsApp Layanan Cuti"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0 fill-current" />
              <span className="hidden sm:inline">Chatbot WA</span>
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </button>

            {/* Role Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100 transition-all text-left shrink-0"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.nama}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                />
                <div className="hidden sm:block text-left max-w-[130px] xl:max-w-[160px]">
                  <div className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {currentUser.nama.split(',')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 leading-none mt-0.5">
                    <span className={`px-1 py-0.2 rounded font-extrabold ${
                      currentUser.jenis_asn === 'PNS' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {currentUser.jenis_asn}
                    </span>
                    <span className="truncate">• {currentUser.role.toUpperCase()}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setShowRoleMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Ganti Akun Simulasi (Role Switcher)
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih peran untuk menguji alur verifikasi & persetujuan:
                    </p>
                  </div>

                  <div className="py-1 max-h-72 overflow-y-auto">
                    {employees.map((emp) => {
                      const isSelected = emp.id === currentUser.id;
                      return (
                        <button
                          key={emp.id}
                          onClick={() => {
                            switchUser(emp);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-orange-50/70' : ''
                          }`}
                        >
                          <img
                            src={emp.avatar}
                            alt={emp.nama}
                            className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 truncate">{emp.nama}</span>
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                                emp.role === 'ppk' ? 'bg-purple-100 text-purple-700' :
                                emp.role === 'atasan' ? 'bg-amber-100 text-amber-700' :
                                emp.role === 'admin' ? 'bg-rose-100 text-rose-700' :
                                emp.jenis_asn === 'PNS' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {emp.role.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">{emp.jabatan}</div>
                            <div className="text-[10px] text-slate-400">NIP: {emp.nip}</div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-orange-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Masa Kerja: {currentUser.masa_kerja_tahun} Thn {currentUser.masa_kerja_bulan} Bln</span>
                      <span className="font-semibold text-orange-600">Aktif</span>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setShowRoleMenu(false);
                        setActiveTab('login');
                      }}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Keluar ke Layar Login (Diagram 2)
                    </button>
                  </div>
                </div>
                </>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-1.5 animate-in fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-auto px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
}

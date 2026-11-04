import React from 'react';
import { useAuth } from '../context/AuthContext';
import CustomDropdown from './CustomDropdown';

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenWhatsApp,
  pendingApprovalCount = 0,
  isMobileOpen = false,
  setIsMobileOpen = () => {}
}) {
  const { currentUser, employees, switchUser, setCurrentUser, logout } = useAuth();

  const isPpk = currentUser?.role === 'ppk';
  const isAtasan = currentUser?.role === 'atasan' || isPpk || currentUser?.role === 'admin';
  const isAdmin = currentUser?.role === 'admin';

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan' },
    { id: 'ajukan-cuti', label: 'Ajukan cuti' },
    { id: 'sisa-cuti', label: 'Saldo dan hak cuti' },
    { id: 'riwayat-cuti', label: 'Riwayat pengajuan' },
    { id: 'kalender', label: 'Kalender unit' },
    { id: 'buku-saku', label: 'Aturan cuti (BKN)' },
  ];

  if (isAtasan) {
    navItems.push({
      id: 'persetujuan',
      label: isPpk ? 'Keputusan PPK' : 'Pertimbangan atasan',
      badge: pendingApprovalCount > 0 ? pendingApprovalCount : null
    });
  }

  if (isAdmin) {
    navItems.push({
      id: 'rekap-admin',
      label: 'Rekap pengajuan'
    });
  }

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  const roleOptions = [
    { value: 'pegawai', label: 'Pegawai' },
    { value: 'atasan', label: 'Atasan' },
    { value: 'ppk', label: 'PPK' },
    { value: 'admin', label: 'Admin BKPSDM' }
  ];

  const handleRoleSwitch = (eOrValue) => {
    const role = typeof eOrValue === 'string' ? eOrValue : eOrValue?.target?.value;
    const target = employees?.find(e => e.role === role);
    if (target && switchUser) {
      switchUser(target);
    } else if (role === 'pegawai') {
      setCurrentUser({
        id: 'emp-pns-1',
        nip: '199208152018021003',
        nama: 'Ahmad Fauzi, S.Kom.',
        jabatan: 'Pranata Komputer Ahli Muda',
        unit_kerja: 'Dinas Komunikasi dan Informatika',
        role: 'pegawai',
        jenis_asn: 'PNS',
        golongan: 'III/c',
        masa_kerja_tahun: 8,
        masa_kerja_bulan: 9,
        jenis_kelamin: 'L',
        no_hp: '081234567890'
      });
    } else if (role === 'atasan') {
      setCurrentUser({
        id: 'emp-atasan-1',
        nip: '197904122005011006',
        nama: 'Bambang Trianto, S.T., M.Eng.',
        jabatan: 'Kepala Bidang Aplikasi dan Informatika',
        unit_kerja: 'Dinas Komunikasi dan Informatika',
        role: 'atasan',
        jenis_asn: 'PNS',
        golongan: 'IV/a',
        masa_kerja_tahun: 21,
        masa_kerja_bulan: 10,
        jenis_kelamin: 'L',
        no_hp: '081328901122'
      });
    } else if (role === 'ppk') {
      setCurrentUser({
        id: 'emp-ppk-1',
        nip: '197009181996031002',
        nama: 'Drs. H. Sukamto, M.Si.',
        jabatan: 'Kepala BKPSDM Kabupaten Kebumen',
        unit_kerja: 'Badan Kepegawaian dan Pengembangan SDM',
        role: 'ppk',
        jenis_asn: 'PNS',
        golongan: 'IV/c',
        masa_kerja_tahun: 28,
        masa_kerja_bulan: 0,
        jenis_kelamin: 'L',
        no_hp: '081122334455'
      });
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'emp-admin-1',
        nip: '198811052010012011',
        nama: 'Dewi Lestari, S.A.P.',
        jabatan: 'Analis Kepegawaian Ahli Muda',
        unit_kerja: 'Bidang Mutasi dan Status Kepegawaian BKPSDM',
        role: 'admin',
        jenis_asn: 'PNS',
        golongan: 'III/c',
        masa_kerja_tahun: 14,
        masa_kerja_bulan: 2,
        jenis_kelamin: 'P',
        no_hp: '089988776655'
      });
    }

    // Defensive tab redirection if current tab not allowed on new role
    if (role === 'pegawai' && (activeTab === 'persetujuan' || activeTab === 'rekap-admin')) {
      setActiveTab('dashboard');
    } else if ((role === 'atasan' || role === 'ppk') && activeTab === 'rekap-admin') {
      setActiveTab('dashboard');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[248px] bg-white border-r border-[#dcdfda] p-3.5 sm:p-4 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-2 pb-4 pt-1">
          <div className="font-semibold text-[17px] text-[#1c2530] tracking-tight">
            LawetHub
          </div>
          <div className="text-[12px] text-[#5a6472] tracking-[0.01em] mt-0.5">
            Layanan Cuti ASN · BKPSDM Kebumen
          </div>
        </div>

        {/* Navigation Items (Scrollable if height is constrained) */}
        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto pr-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-[6px] text-[13.5px] flex items-center justify-between transition-colors min-h-[36px] ${
                  isActive
                    ? 'bg-[#e3eaf1] text-[#173a5e] font-medium'
                    : 'text-[#3b4654] hover:bg-[#e8ebe6]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-[#fbf3e2] text-[#173a5e] text-[11px] font-semibold px-2 py-0.5 rounded-[4px] border border-[#e3cf9c]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Non-collapsing Footer: WhatsApp Action + Profile Card */}
        <div className="mt-auto pt-3 border-t border-[#e8ebe6] flex flex-col gap-2.5 shrink-0">
          {/* WhatsApp Drawer Trigger */}
          <button
            type="button"
            onClick={() => {
              onOpenWhatsApp();
              setIsMobileOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-[6px] text-[13px] text-[#3b4654] hover:bg-[#e8ebe6] transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#173a5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Tanya via WhatsApp</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          </button>

          {/* Profile Card & Role Switcher */}
          <div className="bg-[#f8f9f7] border border-[#e3e6e1] rounded-[6px] p-2.5">
            <div className="text-[13px] font-medium text-[#1c2530] leading-snug break-words">
              {currentUser?.nama || 'Ahmad Fauzi, S.Kom.'}
            </div>
            <div className="text-[11px] text-[#5a6472] leading-snug mt-0.5 truncate" title={currentUser?.unit_kerja}>
              {currentUser?.jenis_asn || 'PNS'} · {currentUser?.unit_kerja || 'Dinas Komunikasi dan Informatika'}
            </div>

            <div className="mt-2 pt-2 border-t border-[#e8ebe6] flex items-center justify-between text-[11px] text-[#5a6472]">
              <span>Peran aktif:</span>
              <CustomDropdown
                value={currentUser?.role || 'pegawai'}
                onChange={handleRoleSwitch}
                options={roleOptions}
                variant="inline"
                direction="top"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="text-left text-[12px] text-[#5a6472] hover:text-[#173a5e] px-1 py-0.5 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}

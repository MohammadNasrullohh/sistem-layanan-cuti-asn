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
  const { currentUser, setCurrentUser, logout } = useAuth();

  const isAtasan = currentUser?.role === 'atasan' || currentUser?.role === 'ppk' || currentUser?.role === 'admin';
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
      label: 'Pertimbangan atasan',
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
    if (role === 'pegawai') {
      setCurrentUser({
        id: 1,
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
        id: 2,
        nip: '198005122005011002',
        nama: 'Bambang Trianto, M.T.',
        jabatan: 'Kepala Bidang Informatika',
        unit_kerja: 'Dinas Komunikasi dan Informatika',
        role: 'atasan',
        jenis_asn: 'PNS',
        golongan: 'IV/a',
        masa_kerja_tahun: 21,
        masa_kerja_bulan: 2,
        jenis_kelamin: 'L',
        no_hp: '081298765432'
      });
    } else if (role === 'ppk') {
      setCurrentUser({
        id: 4,
        nip: '197502111998031001',
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
        id: 5,
        nip: '199501012020121001',
        nama: 'Admin BKPSDM Kebumen',
        jabatan: 'Analis Kepegawaian Muda',
        unit_kerja: 'BKPSDM Kabupaten Kebumen',
        role: 'admin',
        jenis_asn: 'PNS',
        golongan: 'III/b',
        masa_kerja_tahun: 5,
        masa_kerja_bulan: 11,
        jenis_kelamin: 'L',
        no_hp: '089988776655'
      });
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-[232px] bg-white border-r border-[#dcdfda] p-4 sm:p-6 flex flex-col gap-1 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-3 pb-5 pt-1">
          <div className="font-semibold text-[17px] text-[#1c2530] tracking-tight">
            LawetHub
          </div>
          <div className="text-[12px] text-[#5a6472] tracking-[0.01em] mt-0.5">
            Layanan Cuti ASN · BKPSDM Kebumen
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-[6px] text-[14px] flex items-center justify-between transition-colors min-h-[40px] ${
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

          {/* WhatsApp Drawer Trigger */}
          <button
            type="button"
            onClick={() => {
              onOpenWhatsApp();
              setIsMobileOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-[6px] text-[14px] text-[#3b4654] hover:bg-[#e8ebe6] transition-colors min-h-[40px] flex items-center justify-between"
          >
            <span>Tanya via WhatsApp</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>
        </nav>

        {/* Profile Card & Role Switcher */}
        <div className="mt-auto pt-3.5 border-t border-[#e8ebe6]">
          <div className="px-1 mb-2">
            <div className="text-[14px] font-medium text-[#1c2530] truncate">
              {currentUser?.nama || 'Ahmad Fauzi, S.Kom.'}
            </div>
            <div className="text-[12px] text-[#5a6472] truncate">
              {currentUser?.jenis_asn || 'PNS'} · {currentUser?.unit_kerja || 'Dinas Komunikasi dan Informatika'}
            </div>
          </div>

          {/* Quick Role Switcher for seamless test review */}
          <div className="pt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-[#5a6472]">
              <span>Peran aktif:</span>
              <CustomDropdown
                value={currentUser?.role || 'pegawai'}
                onChange={handleRoleSwitch}
                options={roleOptions}
                variant="inline"
                direction="top"
              />
            </div>

            <button
              type="button"
              onClick={logout}
              className="text-left text-[12px] text-[#5a6472] hover:text-[#173a5e] px-1 py-0.5 transition-colors"
            >
              Keluar akun
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

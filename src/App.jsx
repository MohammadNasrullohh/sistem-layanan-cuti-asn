import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LeaveBalanceView from './components/LeaveBalanceView';
import LeaveApplicationForm from './components/LeaveApplicationForm';
import LeaveApprovalView from './components/LeaveApprovalView';
import LeaveExportPrint from './components/LeaveExportPrint';
import CalendarView from './components/CalendarView';
import BknHandbookModal from './components/BknHandbookModal';
import WhatsAppChatbotDrawer from './components/WhatsAppChatbotDrawer';
import LoginPage from './components/LoginPage';
import AdminRecapView from './components/AdminRecapView';
import { MessageSquare, Building2, ShieldCheck, Heart } from 'lucide-react';

function MainApp() {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('beranda'); // 'beranda', 'dashboard', 'sisa-cuti', 'ajukan-cuti', 'persetujuan', 'kalender', 'buku-saku', 'ekspor-cuti'
  const [exportRequestId, setExportRequestId] = useState('cuti-2026-001');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);

  useEffect(() => {
    fetchPendingCount();
  }, [currentUser]);

  const fetchPendingCount = async () => {
    try {
      const res = await fetch('/api/leave-requests');
      const data = await res.json();
      const count = data.filter(d => d.status === 'diajukan' || d.status === 'pertimbangan_atasan').length;
      setPendingApprovalCount(count);
    } catch (err) {
      console.error('Failed to load pending count:', err);
    }
  };

  const handleSelectRequestForExport = (id) => {
    setExportRequestId(id);
    setActiveTab('ekspor-cuti');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-sm font-bold text-slate-700">Memuat Sistem Informasi Cuti ASN LawetHub...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        pendingApprovalCount={pendingApprovalCount}
      />

      {/* Main Content View (Full Widescreen Adaptive Layout - Zero Dead Space) */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-6 pb-14">
        {activeTab === 'beranda' && (
          <LandingPage
            setActiveTab={setActiveTab}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={() => setActiveTab('dashboard')}
            onBackToHome={() => setActiveTab('beranda')}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onSelectRequestForExport={handleSelectRequestForExport}
          />
        )}

        {activeTab === 'sisa-cuti' && (
          <LeaveBalanceView
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'ajukan-cuti' && (
          <LeaveApplicationForm
            setActiveTab={setActiveTab}
            onSelectRequestForExport={handleSelectRequestForExport}
          />
        )}

        {activeTab === 'persetujuan' && (
          (currentUser?.role === 'atasan' || currentUser?.role === 'ppk' || currentUser?.role === 'admin') ? (
            <LeaveApprovalView
              onSelectRequestForExport={handleSelectRequestForExport}
            />
          ) : (
            <Dashboard
              setActiveTab={setActiveTab}
              onSelectRequestForExport={handleSelectRequestForExport}
            />
          )
        )}

        {activeTab === 'rekapitulasi' && (
          (currentUser?.role === 'ppk' || currentUser?.role === 'admin') ? (
            <AdminRecapView
              onSelectRequestForExport={handleSelectRequestForExport}
            />
          ) : (
            <Dashboard
              setActiveTab={setActiveTab}
              onSelectRequestForExport={handleSelectRequestForExport}
            />
          )
        )}

        {activeTab === 'kalender' && (
          <CalendarView />
        )}

        {activeTab === 'buku-saku' && (
          <BknHandbookModal
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'ekspor-cuti' && (
          <LeaveExportPrint
            requestId={exportRequestId}
            onBack={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Floating WhatsApp Chatbot Trigger (Diagram 1) */}
      <div className="no-print fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsWhatsAppOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
          title="Buka Chatbot WhatsApp Cuti ASN"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-current" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
          </div>
          <span className="font-bold text-xs">LawetBot WA</span>
        </button>
      </div>

      {/* Interactive WhatsApp Chatbot Drawer Modal */}
      <WhatsAppChatbotDrawer
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        setActiveTab={setActiveTab}
        onSelectRequestForExport={handleSelectRequestForExport}
      />

      {/* Official Government Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
              KBM
            </div>
            <div>
              <div className="font-black text-slate-900">Pemerintah Kabupaten Kebumen</div>
              <div className="text-[11px] text-slate-500">Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM)</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-semibold">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">SPBE Terintegrasi</span>
            <span>Peraturan BKN No. 7 Tahun 2021</span>
            <span>•</span>
            <span className="text-blue-700 font-bold">BerAKHLAK: Bangga Melayani Bangsa</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}

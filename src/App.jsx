import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
          <LeaveApprovalView
            onSelectRequestForExport={handleSelectRequestForExport}
          />
        )}

        {activeTab === 'rekapitulasi' && (
          <AdminRecapView
            onSelectRequestForExport={handleSelectRequestForExport}
          />
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

      {/* Official Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
              LH
            </div>
            <div>
              <span className="font-bold text-slate-800">LawetHub</span> • Badan Kepegawaian dan Pengembangan SDM Kabupaten Kebumen
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Peraturan BKN No. 7 Tahun 2021</span>
            <span>•</span>
            <span>Buku Saku Kompensasi ASN 2024</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

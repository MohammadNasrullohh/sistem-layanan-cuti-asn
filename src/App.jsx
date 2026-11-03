import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeaveBalanceView from './components/LeaveBalanceView';
import LeaveApplicationForm from './components/LeaveApplicationForm';
import LeaveApprovalView from './components/LeaveApprovalView';
import LeaveExportPrint from './components/LeaveExportPrint';
import LeaveHistoryView from './components/LeaveHistoryView';
import CalendarView from './components/CalendarView';
import BknHandbookModal from './components/BknHandbookModal';
import WhatsAppChatbotDrawer from './components/WhatsAppChatbotDrawer';
import LoginPage from './components/LoginPage';
import AdminRecapView from './components/AdminRecapView';

function MainApp() {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [exportRequestId, setExportRequestId] = useState('cuti-2026-001');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);

  useEffect(() => {
    fetchPendingCount();
  }, [currentUser]);

  const fetchPendingCount = async () => {
    try {
      const res = await fetch('/api/leave-requests');
      if (res.ok) {
        const data = await res.json();
        const count = data.filter(d => d.status === 'diajukan' || d.status === 'pertimbangan_atasan').length;
        setPendingApprovalCount(count);
      }
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
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f3]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-[#173a5e] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-[13px] text-[#5a6472]">Memuat LawetHub...</div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, display login split screen
  if (!isAuthenticated || !currentUser) {
    return (
      <LoginPage
        onLoginSuccess={() => setActiveTab('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f3] flex flex-col lg:flex-row font-sans text-[#1c2530]">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-white border-b border-[#dcdfda] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div>
          <div className="font-semibold text-[16px] text-[#1c2530]">LawetHub</div>
          <div className="text-[11px] text-[#5a6472]">Layanan Cuti ASN</div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 border border-[#b9bfb8] rounded-[6px] text-[#1c2530] text-[13px] hover:bg-[#e8ebe6]"
          aria-label="Menu"
        >
          Menu
        </button>
      </header>

      {/* 232px Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        pendingApprovalCount={pendingApprovalCount}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 lg:p-[32px_40px] max-w-[1400px] w-full overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onSelectRequestForExport={handleSelectRequestForExport}
          />
        )}

        {activeTab === 'ajukan-cuti' && (
          <LeaveApplicationForm
            setActiveTab={setActiveTab}
            onSelectRequestForExport={handleSelectRequestForExport}
          />
        )}

        {activeTab === 'sisa-cuti' && (
          <LeaveBalanceView
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'riwayat-cuti' && (
          <LeaveHistoryView
            setActiveTab={setActiveTab}
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

        {activeTab === 'persetujuan' && (
          <LeaveApprovalView
            onSelectRequestForExport={handleSelectRequestForExport}
          />
        )}

        {activeTab === 'rekap-admin' && (
          <AdminRecapView
            onSelectRequestForExport={handleSelectRequestForExport}
          />
        )}

        {activeTab === 'ekspor-cuti' && (
          <LeaveExportPrint
            requestId={exportRequestId}
            onBack={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* WhatsApp Chatbot Drawer */}
      <WhatsAppChatbotDrawer
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        setActiveTab={setActiveTab}
        onSelectRequestForExport={handleSelectRequestForExport}
      />
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

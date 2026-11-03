import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Storage clear error:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex items-center justify-center p-4 font-sans select-none">
          <div className="max-w-xl w-full bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Republic Ribbon Accent */}
            <div className="h-1 bg-red-600 rounded-full w-full"></div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                  Pemerintah Kabupaten Kebumen • BKPSDM
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Pemulihan Sistem Layanan Cuti ASN
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Terjadi kendala saat memuat antarmuka sistem. Sesi tersimpan Anda mungkin mengalami inkonsistensi data. Silakan klik tombol di bawah untuk menyetel ulang sesi dan memuat ulang halaman.
            </p>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-red-700 overflow-x-auto max-h-36">
                <strong>Error:</strong> {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Sesi & Muat Ulang</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Refresh Halaman</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

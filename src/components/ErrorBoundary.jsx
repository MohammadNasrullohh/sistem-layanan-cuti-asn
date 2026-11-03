import React from 'react';

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
        <div className="min-h-screen bg-[#f4f5f3] text-[#1c2530] flex items-center justify-center p-4 font-sans select-none">
          <div className="max-w-[480px] w-full bg-white border border-[#dcdfda] rounded-[8px] p-6 sm:p-7 shadow-lg flex flex-col gap-4">
            
            <div>
              <div className="text-[12px] text-[#5a6472]">
                Pemerintah Kabupaten Kebumen · BKPSDM
              </div>
              <h1 className="text-[18px] font-semibold text-[#1c2530] mt-1 m-0 tracking-tight">
                Pemulihan Sistem Layanan Cuti ASN
              </h1>
            </div>

            <p className="text-[13px] text-[#5a6472] leading-relaxed m-0">
              Terjadi kendala saat memuat antarmuka sistem. Sesi tersimpan Anda mungkin mengalami inkonsistensi data. Silakan klik tombol di bawah untuk menyetel ulang sesi dan memuat ulang halaman.
            </p>

            {this.state.error && (
              <div className="p-3 bg-[#fbf3e2] border border-[#e3cf9c] rounded-[6px] text-[12px] mono text-[#1c2530] overflow-x-auto max-h-32">
                <b>Error:</b> {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2 border-t border-[#e8ebe6]">
              <button
                type="button"
                onClick={this.handleReset}
                className="lawet-btn"
              >
                Reset Sesi & Muat Ulang
              </button>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="lawet-btn-secondary"
              >
                Refresh Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

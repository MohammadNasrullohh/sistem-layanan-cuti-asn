import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onBackToHome }) {
  const { employees, loginWithNip, loginAsUser } = useAuth();
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('123456');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = loginWithNip(nip, password);
    setLoading(false);

    if (result.success) {
      onLoginSuccess();
    } else {
      // Flowchart step: Login berhasil? -> Tidak: Tampil pesan error
      setErrorMsg(result.message);
    }
  };

  const handleQuickLogin = (emp) => {
    loginAsUser(emp);
    onLoginSuccess();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Information Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Alur Resmi Diagram 2 LawetHub</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Masuk ke Layanan Cuti <span className="text-slate-900 underline decoration-amber-400 underline-offset-4">LawetHub</span>
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Autentikasi akun aparatur sipil negara (PNS & PPPK) untuk mengakses rincian sisa cuti, permohonan izin cuti online, dan penerbitan formulir BKN.
            </p>
          </div>

          {/* Quick Demo Login Section */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                1-Klik Akses Demo Role:
              </span>
              <span className="text-[10px] text-amber-600 font-bold">Simulasi Instan</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {employees.slice(0, 5).map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => handleQuickLogin(emp)}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={emp.avatar}
                      alt={emp.nama}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate group-hover:text-slate-900 transition-colors">
                        {emp.nama.split(',')[0]}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {emp.jenis_asn} • {emp.role.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda Website
          </button>
        </div>

        {/* Right Form Card (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-lg shadow-slate-200/50 space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Formulir Masuk Pegawai</h2>
                <p className="text-xs text-slate-400">Gunakan NIP resmi terdaftar pada SIMPEG BKPSDM</p>
              </div>
            </div>

            {/* Error Alert Box (Flowchart: Login berhasil? -> Tidak) */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Gagal Masuk:</div>
                  <div className="text-[11px] mt-0.5">{errorMsg}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor Induk Pegawai (NIP):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: 199208152018021003"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  NIP Demo: <span className="font-mono font-semibold text-slate-600">199208152018021003</span> (PNS) atau <span className="font-mono font-semibold text-slate-600">199505122023212015</span> (PPPK)
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kata Sandi:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata sandi akun"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Kata sandi demo: <span className="font-mono font-semibold text-slate-600">123456</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs md:text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard LawetHub'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
              BKPSDM Kabupaten Kebumen • Terintegrasi SIASN BKN
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

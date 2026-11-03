import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onLoginSuccess }) {
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
      setErrorMsg(result.message || 'NIP atau kata sandi tidak cocok.');
    }
  };

  const handleQuickLogin = (emp) => {
    loginAsUser(emp);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f5f3] flex flex-col md:grid md:grid-cols-2 text-[#1c2530] font-sans">
      {/* Left Column: Navy Institutional Branding */}
      <section className="bg-[#173a5e] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[320px] md:min-h-screen">
        <div className="text-[14px] text-white/85">
          Pemerintah Kabupaten Kebumen · BKPSDM
        </div>

        <div className="my-8 md:my-0">
          <h1 className="text-[32px] sm:text-[38px] font-semibold leading-[1.2] mb-4 tracking-tight">
            Layanan Cuti ASN
          </h1>
          <p className="text-[15px] sm:text-[16px] leading-[1.6] max-w-[420px] text-white/90 font-normal">
            Cek saldo, ajukan cuti, dan unduh formulir resmi sesuai Peraturan BKN No. 7 Tahun 2021.
          </p>
        </div>

        <div className="text-[13px] text-white/80">
          Terintegrasi SIASN BKN
        </div>
      </section>

      {/* Right Column: Clean White Form */}
      <section className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[360px] flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            <h2 className="text-[22px] font-semibold text-[#1c2530] mb-1">
              Masuk
            </h2>

            {errorMsg && (
              <div className="bg-[#fbf3e2] border border-[#e3cf9c] text-[#1c2530] text-[13px] rounded-[6px] p-3">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#1c2530]">
                NIP
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="18 digit NIP"
                className="w-full border border-[#b9bfb8] rounded-[6px] px-3 py-2.5 text-[14px] font-normal bg-white outline-none focus:border-[#173a5e] mono"
                required
              />
              <span className="text-[12px] text-[#5a6472]">
                Gunakan NIP yang terdaftar di SIMPEG.
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#1c2530]">
                Kata sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#b9bfb8] rounded-[6px] px-3 py-2.5 text-[14px] bg-white outline-none focus:border-[#173a5e]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-center bg-[#173a5e] hover:bg-[#102942] text-white rounded-[6px] py-3 text-[14px] font-medium transition-colors cursor-pointer"
            >
              {loading ? 'Memverifikasi...' : 'Masuk'}
            </button>

            <a
              href="#bantuan"
              onClick={(e) => {
                e.preventDefault();
                alert('Untuk bantuan akun SIMPEG atau reset kata sandi, silakan hubungi Subbag Kepegawaian BKPSDM Kebumen di Gedung Setda Lantai 2.');
              }}
              className="text-[13px] text-[#173a5e] hover:underline"
            >
              Lupa kata sandi? Hubungi admin BKPSDM
            </a>
          </form>

          {/* Quick Demo Switchers */}
          <div className="pt-5 border-t border-[#e8ebe6]">
            <div className="text-[12px] text-[#5a6472] mb-2.5">
              Akses cepat pengujian (1-klik):
            </div>
            <div className="grid grid-cols-2 gap-2">
              {employees && employees.slice(0, 4).map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => handleQuickLogin(emp)}
                  className="text-left p-2.5 border border-[#dcdfda] hover:border-[#173a5e] rounded-[6px] bg-white text-[12px] transition-colors"
                >
                  <div className="font-medium text-[#1c2530] truncate">
                    {emp.nama.split(',')[0]}
                  </div>
                  <div className="text-[11px] text-[#5a6472] uppercase">
                    {emp.role}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

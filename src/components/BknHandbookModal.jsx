import React, { useState } from 'react';

export default function BknHandbookModal({ setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('dasar_hukum');

  const chapters = [
    {
      id: 'dasar_hukum',
      title: 'Dasar hukum dan subjek cuti',
      hal: 'Hal. 1–4',
      content: (
        <div>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Apa itu cuti?</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-5">
            Keadaan tidak bekerja yang diizinkan dalam jangka waktu tertentu bagi aparatur sipil negara.
          </p>

          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Siapa yang berhak?</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-1.5">
            <b>PNS, 7 jenis:</b> tahunan, besar, sakit, melahirkan, alasan penting, bersama, di luar tanggungan negara.
          </p>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-5">
            <b>PPPK, 4 jenis:</b> tahunan, sakit, melahirkan, bersama.
          </p>

          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Dasar Regulasi</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0">
            Peraturan Badan Kepegawaian Negara Republik Indonesia Nomor 7 Tahun 2021 tentang Perubahan atas Peraturan BKN Nomor 24 Tahun 2017 tentang Tata Cara Pemberian Cuti Pegawai Negeri Sipil.
          </p>
        </div>
      )
    },
    {
      id: 'tahunan',
      title: 'Cuti tahunan',
      hal: 'Hal. 5–7',
      content: (
        <div>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Ketentuan Cuti Tahunan</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-3">
            PNS dan Calon PNS yang telah bekerja paling kurang 1 (satu) tahun secara terus-menerus berhak atas cuti tahunan dengan lama <b>12 (dua belas) hari kerja</b>.
          </p>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Akumulasi Hak Cuti (N-1 dan N-2)</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-3">
            Sisa cuti tahunan yang tidak digunakan dalam tahun berjalan dapat digunakan dalam tahun berikutnya paling banyak <b>6 (enam) hari kerja</b>.
          </p>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0">
            Apabila cuti tahunan ditangguhkan oleh Pejabat Yang Berwenang Memberikan Cuti (PPK) karena kepentingan dinas mendesak, hak cuti yang ditangguhkan dapat diakumulasi hingga paling lama <b>24 (dua puluh empat) hari kerja</b> termasuk hak cuti tahun berjalan.
          </p>
        </div>
      )
    },
    {
      id: 'besar',
      title: 'Cuti besar',
      hal: 'Hal. 8–9, 23',
      content: (
        <div>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Syarat & Jangka Waktu Cuti Besar</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-3">
            PNS yang telah bekerja paling singkat 5 (lima) tahun secara terus-menerus berhak atas cuti besar paling lama <b>3 (tiga) bulan</b>.
          </p>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Dampak Terhadap Hak Lain</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-3">
            PNS yang menggunakan hak atas cuti besar tidak berhak lagi atas cuti tahunan dalam tahun yang bersangkutan.
          </p>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0">
            Selama menjalankan cuti besar, PNS tetap menerima penghasilan gaji pokok, tunjangan keluarga, dan tunjangan pangan, namun <b>tidak menerima tunjangan jabatan</b> (Buku Saku Hal. 24).
          </p>
        </div>
      )
    },
    {
      id: 'sakit',
      title: 'Cuti sakit',
      hal: 'Hal. 10–12',
      content: (
        <div>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Ketentuan Cuti Sakit</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-3">
            Setiap PNS yang sakit berhak atas cuti sakit. Untuk sakit lebih dari 1 (satu) hari sampai dengan 14 (empat belas) hari, PNS wajib melampirkan surat keterangan dokter.
          </p>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Jangka Waktu Maksimal</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-3">
            Cuti sakit diberikan untuk waktu paling lama 1 (satu) tahun, dan dapat ditambah paling lama 6 (enam) bulan apabila berdasarkan surat keterangan tim penguji kesehatan yang ditunjuk belum sembuh dari penyakitnya.
          </p>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0">
            PNS yang mengalami gugur kandungan berhak atas cuti sakit paling lama 1 1/2 (satu setengah) bulan.
          </p>
        </div>
      )
    },
    {
      id: 'melahirkan',
      title: 'Cuti melahirkan',
      hal: 'Hal. 13–15',
      content: (
        <div>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Ketentuan Cuti Melahirkan</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-3">
            Untuk kelahiran anak pertama sampai dengan anak ketiga pada saat menjadi PNS, aparatur sipil wanita berhak atas cuti melahirkan selama <b>3 (tiga) bulan</b>.
          </p>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Kelahiran Anak Keempat dan Seterusnya</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0">
            Untuk kelahiran anak keempat dan seterusnya, diberikan cuti besar sesuai ketentuan perundang-undangan (Peraturan BKN 7/2021).
          </p>
        </div>
      )
    },
    {
      id: 'alasan_penting',
      title: 'Cuti karena alasan penting',
      hal: 'Hal. 16–17',
      content: (
        <div>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Kriteria Cuti Karena Alasan Penting</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-3">
            Diberikan apabila: ibu, bapak, isteri/suami, anak, adik, kakak, mertua, atau menantu sakit keras atau meninggal dunia; atau melangsungkan perkawinan; atau mengalami musibah bencana alam.
          </p>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Durasi</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0">
            Lamanya hak atas cuti karena alasan penting ditentukan oleh Pejabat Yang Berwenang Memberikan Cuti, paling lama <b>1 (satu) bulan</b>.
          </p>
        </div>
      )
    },
    {
      id: 'cltn',
      title: 'Cuti di luar tanggungan negara',
      hal: 'Hal. 19–22',
      content: (
        <div>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Ketentuan CLTN</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0 mb-3">
            PNS yang telah bekerja paling singkat 5 (lima) tahun secara terus-menerus karena alasan pribadi dan mendesak dapat diberikan Cuti di Luar Tanggungan Negara paling lama 3 (tiga) tahun.
          </p>
          <h2 className="text-[18px] font-semibold text-[#1c2530] m-0 mb-2">Penghentian Penghasilan & Masa Kerja</h2>
          <p className="text-[15px] text-[#1c2530] leading-[1.6] m-0">
            Selama menjalankan CLTN, PNS tidak berhak menerima penghasilan apa pun dari negara dan masa kerja selama menjalankan CLTN tidak diperhitungkan sebagai masa kerja PNS.
          </p>
        </div>
      )
    }
  ];

  const filteredChapters = chapters.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.hal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChapter = chapters.find(c => c.id === selectedSection) || chapters[0];

  return (
    <div className="flex-1 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold text-[#1c2530] m-0 tracking-tight">
            Buku saku cuti PNS
          </h1>
          <div className="text-[13px] text-[#5a6472] mt-1.5">
            Direktorat Kompensasi ASN, BKN 2024 · Peraturan BKN No. 7 Tahun 2021
          </div>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari aturan cuti..."
          className="lawet-input w-full sm:w-[300px]"
        />
      </div>

      {/* 2-Column Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
        {/* Left Navigation */}
        <nav className="lawet-card overflow-hidden">
          {filteredChapters.map((ch, idx) => {
            const isSelected = ch.id === activeChapter.id;
            const isLast = idx === filteredChapters.length - 1;

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setSelectedSection(ch.id)}
                className={`w-full text-left p-3.5 text-[14px] transition-colors cursor-pointer block ${
                  !isLast ? 'border-b border-[#e8ebe6]' : ''
                } ${
                  isSelected ? 'bg-[#e3eaf1] font-medium text-[#173a5e]' : 'text-[#1c2530] hover:bg-[#f4f5f3]'
                }`}
              >
                <div>{ch.title}</div>
                <div className="text-[12px] text-[#5a6472] mt-0.5">{ch.hal}</div>
              </button>
            );
          })}
        </nav>

        {/* Right Article Body */}
        <article className="lawet-card p-7 text-[15px] leading-[1.6]">
          {activeChapter.content}
        </article>
      </div>
    </div>
  );
}

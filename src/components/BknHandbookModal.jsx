import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  Coins, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export default function BknHandbookModal({ setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('umum');

  const handbookSections = [
    {
      id: 'umum',
      title: 'Dasar Hukum & Subjek Cuti ASN',
      subtitle: 'Halaman 1 - 4 Buku Saku BKN 2024',
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900">
            <h4 className="font-bold text-sm mb-1">Peraturan BKN Nomor 7 Tahun 2021</h4>
            <p>
              Merupakan Perubahan atas Peraturan BKN Nomor 24 Tahun 2017 tentang Tata Cara Pemberian Cuti Pegawai Negeri Sipil. Diterbitkan oleh Direktorat Kompensasi Aparatur Sipil Negara, Badan Kepegawaian Negara.
            </p>
          </div>

          <h4 className="font-bold text-slate-900 text-sm">Apa itu Cuti?</h4>
          <p>
            Keadaan tidak bekerja yang diizinkan dalam jangka waktu tertentu bagi aparatur sipil negara.
          </p>

          <h4 className="font-bold text-slate-900 text-sm">Siapa Yang Berhak Atas Cuti ASN?</h4>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="font-bold text-blue-900 block mb-1">PNS (7 Jenis Cuti):</span>
              <ul className="list-disc pl-4 space-y-0.5 text-blue-800 text-[11px]">
                <li>Cuti Tahunan</li>
                <li>Cuti Besar</li>
                <li>Cuti Sakit</li>
                <li>Cuti Melahirkan</li>
                <li>Cuti Karena Alasan Penting</li>
                <li>Cuti Bersama</li>
                <li>Cuti di Luar Tanggungan Negara</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900 block mb-1">PPPK (4 Jenis Cuti):</span>
              <ul className="list-disc pl-4 space-y-0.5 text-emerald-800 text-[11px]">
                <li>Cuti Tahunan</li>
                <li>Cuti Sakit</li>
                <li>Cuti Melahirkan</li>
                <li>Cuti Bersama</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tahunan',
      title: '1. Cuti Tahunan (12 Hari Kerja)',
      subtitle: 'Halaman 5 - 7 Buku Saku BKN 2024',
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Apa syarat bagi PNS untuk mendapatkan cuti tahunan?</h4>
            <p>PNS dan calon PNS yang telah bekerja paling kurang 1 (satu) tahun secara terus menerus berhak atas cuti tahunan (Hal. 5).</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Berapa lama cuti tahunan yang didapatkan?</h4>
            <p>Lamanya hak atas cuti tahunan adalah <strong>12 (dua belas) hari kerja</strong>.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Bagaimana dengan sisa cuti yang tidak digunakan pada tahun berjalan?</h4>
            <p>Sisa hak atas cuti tahunan yang tidak digunakan dalam tahun bersangkutan dapat digunakan pada tahun berikutnya <strong>paling banyak 6 (enam) hari kerja</strong> (Hal. 6).</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Apakah cuti tahunan dapat ditangguhkan?</h4>
            <p>Dapat ditangguhkan penggunaannya oleh Pejabat Yang Berwenang Memberikan Cuti (PPK) untuk paling lama 1 tahun, apabila terdapat kepentingan dinas mendesak. Hak yang ditangguhkan dapat digunakan tahun berikutnya selama <strong>24 hari kerja</strong> termasuk hak tahun berjalan.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Apakah Guru dan Dosen PNS mendapatkan cuti tahunan di luar libur akademik?</h4>
            <p>PNS yang menduduki jabatan guru pada sekolah dan dosen pada perguruan tinggi yang mendapat liburan menurut peraturan perundang-undangan, <strong>tetap berhak mendapatkan cuti tahunan</strong> (Hal. 7).</p>
          </div>
        </div>
      )
    },
    {
      id: 'besar',
      title: '2. Cuti Besar (Maks. 3 Bulan)',
      subtitle: 'Halaman 8 - 9 & 23 Buku Saku BKN 2024',
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Apa syarat bagi PNS untuk mendapatkan cuti besar?</h4>
            <p>PNS yang telah bekerja paling singkat <strong>5 (lima) tahun secara terus-menerus</strong> berhak atas cuti besar paling lama <strong>3 (tiga) bulan</strong> (Hal. 8).</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Bagaimana dengan cuti tahunan di tahun berjalan saat mengambil cuti besar?</h4>
            <p>PNS yang menggunakan hak atas cuti besar <strong>tidak berhak atas cuti tahunan dalam tahun yang bersangkutan</strong>.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Jika hanya digunakan 1 atau 2 bulan, bagaimana dengan sisa cuti besar?</h4>
            <p>PNS yang menggunakan cuti besar kurang dari 3 bulan, maka <strong>sisa cuti besar yang menjadi haknya hapus/hangus</strong> (Hal. 9).</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">PNS yang akan Ibadah Haji (Hal. 23):</h4>
            <p>Bagi PNS yang akan melaksanakan Ibadah Haji dapat menggunakan cuti besar. PNS yang melaksanakan Ibadah Haji untuk pertama kali <strong>dikecualikan dari syarat masa kerja 5 tahun</strong> sepanjang melampirkan jadwal keberangkatan/kloter resmi.</p>
          </div>
        </div>
      )
    },
    {
      id: 'sakit',
      title: '3. Cuti Sakit (Hingga 1 Tahun + 6 Bulan)',
      subtitle: 'Halaman 10 - 12 Buku Saku BKN 2024',
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Syarat Pengajuan Cuti Sakit:</h4>
            <p>• Sakit 1 hari: menyampaikan surat keterangan dokter kepada atasan langsung.</p>
            <p>• Sakit lebih dari 1 hari: mengajukan permintaan tertulis kepada PPK dengan melampirkan surat keterangan dokter berizin praktek resmi (Hal. 10).</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Perpanjangan Cuti Sakit:</h4>
            <p>Diberikan paling lama 1 tahun dan dapat ditambah paling lama 6 bulan apabila diperlukan berdasarkan surat keterangan tim penguji kesehatan yang ditetapkan Menteri Kesehatan (Hal. 11).</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Keguguran Kandungan (Hal. 12):</h4>
            <p>PNS yang mengalami gugur kandungan berhak atas cuti sakit untuk paling lama <strong>1 1/2 (satu setengah) bulan</strong>.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Kecelakaan Saat Menjalankan Tugas Kedinasan (Hal. 12):</h4>
            <p>Berhak atas cuti sakit <strong>sampai yang bersangkutan sembuh dari penyakitnya</strong>.</p>
          </div>
        </div>
      )
    },
    {
      id: 'melahirkan',
      title: '4. Cuti Melahirkan (Anak 1-3 & Anak ke-4+)',
      subtitle: 'Halaman 13 - 15 Buku Saku BKN 2024',
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Anak Pertama sampai Ketiga:</h4>
            <p>Diberikan hak atas cuti melahirkan selama paling lama <strong>3 (tiga) bulan</strong> dengan penghasilan penuh (Hal. 13).</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Kelahiran Anak Keempat dan Seterusnya:</h4>
            <p>Diberikan <strong>Cuti Besar</strong> dengan ketentuan: tidak dapat ditangguhkan, mengesampingkan syarat 5 tahun kerja, dan durasinya sama dengan cuti melahirkan (3 bulan) (Hal. 15).</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">PNS Laki-laki Istri Melahirkan:</h4>
            <p>Diberikan hak <em>Cuti Karena Alasan Penting (CAP)</em> dengan melampirkan surat keterangan rawat inap dari fasilitas pelayanan kesehatan (Hal. 15).</p>
          </div>
        </div>
      )
    },
    {
      id: 'alasan_penting',
      title: '5. Cuti Karena Alasan Penting (Maks. 1 Bulan)',
      subtitle: 'Halaman 16 - 17 Buku Saku BKN 2024',
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <h4 className="font-bold text-slate-900">Kriteria Alasan Penting (Hal. 16):</h4>
          <ol className="list-decimal pl-5 space-y-1.5 text-[11px]">
            <li>Ibu, bapak, isteri/suami, anak, adik, kakak, mertua, atau menantu sakit keras atau meninggal dunia.</li>
            <li>Mengurus hak-hak dari anggota keluarga yang meninggal dunia.</li>
            <li>Melangsungkan perkawinan (Cuti Nikah).</li>
            <li>PNS laki-laki yang istrinya melahirkan/operasi caesar.</li>
            <li>Mengalami musibah kebakaran rumah atau bencana alam.</li>
            <li>Penempatan perwakilan RI yang rawan/berbahaya untuk pemulihan kondisi kejiwaan.</li>
          </ol>
          <p className="pt-2">Lamanya cuti ditentukan paling lama <strong>1 (satu) bulan</strong> dan tetap menerima penghasilan penuh.</p>
        </div>
      )
    },
    {
      id: 'cltn',
      title: '6. Cuti di Luar Tanggungan Negara (CLTN)',
      subtitle: 'Halaman 19 - 22 Buku Saku BKN 2024',
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Syarat CLTN:</h4>
            <p>PNS yang telah bekerja paling singkat <strong>5 (lima) tahun secara terus-menerus</strong> karena alasan pribadi mendesak (dampingi pasangan tugas dinas/belajar, program keturunan, rawat anak berkebutuhan khusus/ortu uzur) (Hal. 19).</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Durasi & Konsekuensi:</h4>
            <p>Diberikan paling lama 3 tahun (dapat diperpanjang 1 tahun). Mengakibatkan <strong>diberhentikan dari jabatan, masa kerja terhenti, dan TIDAK menerima penghasilan apapun</strong>.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Kewajiban Setelah Selesai:</h4>
            <p>Wajib melaporkan diri tertulis kepada instansi induk paling lama 1 bulan setelah selesai untuk diusulkan pengaktifan kembali (Hal. 21).</p>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = handbookSections.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Direktorat Kompensasi ASN • BKN 2024</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Buku Saku Tata Cara Pemberian Cuti PNS
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Panduan resmi lengkap berdasarkan Peraturan Badan Kepegawaian Negara Nomor 7 Tahun 2021
          </p>
        </div>

        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari regulasi cuti..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {filteredSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                selectedSection === sec.id
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="font-bold text-xs text-slate-900">{sec.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{sec.subtitle}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          ))}
        </div>

        {/* Content Viewer (8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
            {handbookSections.find(s => s.id === selectedSection)?.content}
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Resilient default employees fallback in case of network latency or seed sync
const FALLBACK_EMPLOYEES = [
  {
    id: 'emp-pns-1',
    nip: '199208152018021003',
    nama: 'Ahmad Fauzi, S.Kom.',
    email: 'ahmad.fauzi@kebumenkab.go.id',
    no_hp: '081234567890',
    role: 'pegawai',
    jenis_asn: 'PNS',
    jabatan: 'Pranata Komputer Ahli Muda',
    pangkat_golongan: 'Penata (III/c)',
    unit_kerja: 'Dinas Komunikasi dan Informatika',
    instansi: 'Pemerintah Kabupaten Kebumen',
    tmt_cpns: '2018-02-01',
    masa_kerja_tahun: 8,
    masa_kerja_bulan: 9,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    sisa_cuti_n2: 0,
    sisa_cuti_n1: 6,
    sisa_cuti_n: 12,
    cuti_besar_terakhir: null,
    cuti_sakit_terpakai: 0,
    jumlah_anak_lahir: 2,
    atasan_id: 'emp-atasan-1'
  },
  {
    id: 'emp-atasan-1',
    nip: '197904122005011006',
    nama: 'Bambang Trianto, S.T., M.Eng.',
    email: 'bambang.trianto@kebumenkab.go.id',
    no_hp: '081328901122',
    role: 'atasan',
    jenis_asn: 'PNS',
    jabatan: 'Kepala Bidang Aplikasi dan Informatika',
    pangkat_golongan: 'Pembina (IV/a)',
    unit_kerja: 'Dinas Komunikasi dan Informatika',
    instansi: 'Pemerintah Kabupaten Kebumen',
    tmt_cpns: '2005-01-01',
    masa_kerja_tahun: 21,
    masa_kerja_bulan: 10,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    sisa_cuti_n2: 0,
    sisa_cuti_n1: 6,
    sisa_cuti_n: 12,
    cuti_besar_terakhir: '2021-06-15',
    cuti_sakit_terpakai: 0,
    jumlah_anak_lahir: 3,
    atasan_id: 'emp-ppk-1'
  }
];

export function AuthProvider({ children }) {
  const [employees, setEmployees] = useState(FALLBACK_EMPLOYEES);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch employees list
  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      
      const empList = Array.isArray(data) && data.length > 0 ? data : FALLBACK_EMPLOYEES;
      setEmployees(empList);
      
      // Check saved login session
      const savedId = localStorage.getItem('lawethub_user_id');
      const isLoggedIn = localStorage.getItem('lawethub_is_logged_in');
      
      let userToSet = null;
      if (isLoggedIn === 'false') {
        setCurrentUser(null);
        setIsAuthenticated(false);
      } else if (savedId) {
        userToSet = empList.find(e => e.id === savedId);
        if (userToSet) {
          setCurrentUser(userToSet);
          setIsAuthenticated(true);
        } else {
          userToSet = empList.find(e => e.id === 'emp-pns-1') || empList[0];
          setCurrentUser(userToSet);
          setIsAuthenticated(true);
        }
      } else {
        // Default login for convenience on fresh start
        userToSet = empList.find(e => e.id === 'emp-pns-1') || empList[0];
        setCurrentUser(userToSet);
        setIsAuthenticated(true);
        localStorage.setItem('lawethub_user_id', userToSet.id);
        localStorage.setItem('lawethub_is_logged_in', 'true');
      }
    } catch (err) {
      console.warn('Failed to load employees from API, using resilient fallback:', err);
      setCurrentUser(FALLBACK_EMPLOYEES[0]);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const loginWithNip = (nip, password) => {
    const list = employees.length > 0 ? employees : FALLBACK_EMPLOYEES;
    const found = list.find(e => e.nip === nip.trim());
    if (!found) {
      return { success: false, message: 'NIP tidak ditemukan dalam pangkalan data ASN.' };
    }
    if (password !== '123456' && password !== found.password) {
      return { success: false, message: 'Kata sandi tidak sesuai. (Kata sandi demo: 123456)' };
    }
    setCurrentUser(found);
    setIsAuthenticated(true);
    localStorage.setItem('lawethub_user_id', found.id);
    localStorage.setItem('lawethub_is_logged_in', 'true');
    return { success: true, user: found };
  };

  const loginAsUser = (user) => {
    if (!user) return;
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('lawethub_user_id', user.id);
    localStorage.setItem('lawethub_is_logged_in', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.setItem('lawethub_is_logged_in', 'false');
    localStorage.removeItem('lawethub_user_id');
  };

  const switchUser = (user) => {
    if (!user) return;
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('lawethub_user_id', user.id);
    localStorage.setItem('lawethub_is_logged_in', 'true');
  };

  const refreshCurrentUserData = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/employees/${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      employees: employees.length > 0 ? employees : FALLBACK_EMPLOYEES,
      currentUser: currentUser || FALLBACK_EMPLOYEES[0],
      isAuthenticated,
      loginWithNip,
      loginAsUser,
      logout,
      switchUser,
      refreshCurrentUserData,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return safe fallback if used outside provider
    return {
      employees: FALLBACK_EMPLOYEES,
      currentUser: FALLBACK_EMPLOYEES[0],
      isAuthenticated: true,
      loginWithNip: () => ({ success: true }),
      loginAsUser: () => {},
      logout: () => {},
      switchUser: () => {},
      refreshCurrentUserData: () => {},
      loading: false
    };
  }
  return context;
}

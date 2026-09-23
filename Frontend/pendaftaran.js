let masterDokterData = [];

document.addEventListener('DOMContentLoaded', () => {
  // Load data klinik & dokter saat halaman pertama kali dibuka
  loadMasterData();

  // Event listener saat pilihan klinik/dokter berubah
  document.getElementById('select_klinik').addEventListener('change', () => {
    filterDokterByKlinik();
    hitungNoRegistrasi();
  });

  document.getElementById('select_dokter').addEventListener('change', hitungNoRegistrasi);
});

// 1. Fungsi Ambil Data Master Klinik & Dokter dari Backend
function loadMasterData() {
  fetch('../Backend/get_master_data.php')
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        const selectKlinik = document.getElementById('select_klinik');
        selectKlinik.innerHTML = '<option value="">-- Pilih Klinik --</option>';
        
        data.klinik.forEach(k => {
          selectKlinik.innerHTML += `<option value="${k.kode_klinik}">${k.nama_klinik} (${k.kode_klinik})</option>`;
        });

        masterDokterData = data.dokter;
      }
    })
    .catch(err => console.error('Gagal memuat data master:', err));
}

// 2. Fungsi Filter Dokter Berdasarkan Klinik yang Dipilih
function filterDokterByKlinik() {
  const kodeKlinik = document.getElementById('select_klinik').value;
  const selectDokter = document.getElementById('select_dokter');
  
  selectDokter.innerHTML = '<option value="">-- Pilih Dokter --</option>';

  const filtered = masterDokterData.filter(d => d.kode_klinik === kodeKlinik);
  filtered.forEach(d => {
    selectDokter.innerHTML += `<option value="${d.id_dokter}">${d.nama_dokter}</option>`;
  });
}

// 3. Fungsi Cek Pasien Berdasarkan No RM
function cekPasien() {
  const rmInput = document.getElementById('no_rm').value.trim();
  if (!rmInput) return alert('Masukkan No. RM terlebih dahulu!');

  fetch('../Backend/get_pasien.php?no_rm=' + encodeURIComponent(rmInput))
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') {
        const d = res.data;
        document.getElementById('namaPasien').textContent = d.nama_pasien;
        document.getElementById('ktpPasien').textContent = d.no_ktp;
        document.getElementById('telpPasien').textContent = d.no_telp || '-';
        document.getElementById('alamatPasien').textContent = d.alamat || '-';
        document.getElementById('infoPasien').classList.remove('hidden');
      } else {
        alert('Pasien dengan No. RM tersebut tidak ditemukan!');
        document.getElementById('infoPasien').classList.add('hidden');
      }
    })
    .catch(err => console.error('Gagal mengecek pasien:', err));
}

// 4. Fungsi Generate No. Registrasi & No. Urut (Sesuai Format Papan Tulis)
function hitungNoRegistrasi() {
  const kodeKlinik = document.getElementById('select_klinik').value;
  const idDokter = document.getElementById('select_dokter').value;

  if (!kodeKlinik || !idDokter) {
    document.getElementById('no_registrasi').value = '';
    document.getElementById('no_urut_display').textContent = '-';
    return;
  }

  fetch('../Backend/get_no_urut.php?kode_klinik=' + encodeURIComponent(kodeKlinik))
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') {
        const tgl = new Date();
        const yy = String(tgl.getFullYear()).slice(-2); // 2 digit tahun (contoh: 26)
        const mm = String(tgl.getMonth() + 1).padStart(2, '0');
        const dd = String(tgl.getDate()).padStart(2, '0');
        
        const tglFormat = `${yy}${mm}${dd}`; // Hasil: YYMMDD
        const noUrutPad = String(res.no_urut).padStart(3, '0');

        document.getElementById('no_urut_display').textContent = noUrutPad;
        
        // Format: YYMMDD + KodeKlinik + IdDokter + NoUrut
        // Contoh: 260908 + 0100 + 0101 + 001 = 26090801000101001
        document.getElementById('no_registrasi').value = `${tglFormat}${kodeKlinik}${idDokter}${noUrutPad}`;
      }
    })
    .catch(err => console.error('Gagal menghitung nomor registrasi:', err));
}
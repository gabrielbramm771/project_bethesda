const URUTAN_HARI_JS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
let pasienTerverifikasi = false;

const PROVINSI = ['Aceh','Sumatera Utara','Sumatera Barat','Riau','Kepulauan Riau','Jambi','Sumatera Selatan','Bangka Belitung','Bengkulu','Lampung','DKI Jakarta','Jawa Barat','Banten','Jawa Tengah','DI Yogyakarta','Jawa Timur','Bali','Nusa Tenggara Barat','Nusa Tenggara Timur','Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur','Kalimantan Utara','Sulawesi Utara','Gorontalo','Sulawesi Tengah','Sulawesi Barat','Sulawesi Selatan','Sulawesi Tenggara','Maluku','Maluku Utara','Papua','Papua Barat','Papua Selatan','Papua Tengah','Papua Pegunungan','Papua Barat Daya'];

const YT = [['Y', 'Ya'], ['T', 'Tidak']];

// Definisi field per kelompok. n=name/id, l=label, t=tipe, r=wajib, o=opsi, c=kelas kolom, a=atribut tambahan
const SECTIONS = [
  { j: 'Identitas & Pendaftaran', f: [
    { n: 'tgl_daftar', l: 'Tgl. Daftar', t: 'ro' },
    { n: 'no_rm', t: 'rm' },
    { n: 'nama_pasien', l: 'Nama Lengkap', r: 1, c: 'md:col-span-2' },
    { n: 'jenis_kelamin', l: 'Jenis Kelamin', t: 'pill', r: 1, o: [['L', 'Laki-laki'], ['P', 'Perempuan']] },
    { n: 'tempat_lahir', l: 'Tempat Lahir' },
    { n: 'tgl_lahir', l: 'Tgl. Lahir', t: 'date', r: 1 },
    { n: 'umur', l: 'Umur', t: 'ro' },
    { n: 'no_ktp', l: 'No. KTP / NIK', r: 1, a: 'inputmode="numeric" maxlength="16" pattern="\\d{16}" placeholder="16 digit"' },
    { n: 'no_bpjs', l: 'No. Peserta BPJS', a: 'inputmode="numeric" maxlength="20"' },
  ]},
  { j: 'Demografi & Kontak', baru: true, f: [
    { n: 'agama', l: 'Agama', t: 'select', o: ['Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'] },
    { n: 'kewarganegaraan', l: 'Kewarganegaraan', t: 'select', o: ['WNI', 'WNA'] },
    { n: 'status_kawin', l: 'Status Kawin', t: 'select', o: ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'] },
    { n: 'pendidikan', l: 'Pendidikan', t: 'select', o: ['Tidak Sekolah', 'SD', 'SMP', 'SMA/SMK', 'D3', 'S1/D4', 'S2', 'S3'] },
    { n: 'pekerjaan', l: 'Pekerjaan' },
    { n: 'bahasa', l: 'Bahasa Sehari-hari', t: 'select', o: ['Indonesia', 'Jawa', 'Inggris', 'Lainnya'] },
    { n: 'perlu_penerjemah', l: 'Perlu Penerjemah', t: 'pill', o: YT },
    { n: 'gol_darah', l: 'Gol. Darah', t: 'select', o: ['A', 'B', 'AB', 'O', 'Tidak Tahu'] },
    { n: 'alamat', l: 'Alamat Lengkap', t: 'textarea', r: 1, c: 'md:col-span-2' },
    { n: 'provinsi', l: 'Provinsi', a: 'list="dlProvinsi"' },
    { n: 'kota_kab', l: 'Kota / Kabupaten' },
    { n: 'kecamatan', l: 'Kecamatan' },
    { n: 'kelurahan', l: 'Kelurahan' },
    { n: 'no_telp', l: 'Telepon', t: 'tel', r: 1, a: 'inputmode="tel" placeholder="08xxxxxxxxxx"' },
    { n: 'email', l: 'E-mail', t: 'email' },
    { n: 'pegawai_rs', l: 'Pegawai RS', t: 'pill', o: YT },
  ]},
  { j: 'Penanggung Jawab', baru: true, f: [
    { n: 'nama_wali', l: 'Nama Wali' },
    { n: 'hubungan_wali', l: 'Hubungan dengan Pasien', t: 'select', o: ['Ayah', 'Ibu', 'Suami', 'Istri', 'Anak', 'Saudara', 'Lainnya'] },
    { n: 'nama_ortu', l: 'Nama Orang Tua' },
    { n: 'pekerjaan_wali', l: 'Pekerjaan Wali' },
    { n: 'hambatan', l: 'Hambatan / Disabilitas', t: 'select', c: 'md:col-span-2', o: ['Tidak Ada', 'Tuna Netra', 'Tuna Rungu', 'Tuna Wicara', 'Tuna Daksa', 'Lainnya'] },
  ]},
  { j: 'Tujuan Klinik & Diagnosa', aksi: '<a href="pilih_klinik.html" class="ml-auto text-xs font-semibold text-blue-600 hover:text-blue-700">Ganti klinik/dokter</a>', f: [
    { n: 'klinik_tujuan', l: 'Klinik Tujuan', t: 'ro' },
    { n: 'dokter_tujuan', l: 'Dokter', t: 'ro' },
    { n: 'tgl_periksa', l: 'Tanggal Periksa', t: 'date', r: 1 },
    { n: 'no_registrasi', l: 'No. Registrasi', t: 'ro' },
    { n: 'instansi', l: 'Instansi / Penjamin', t: 'select', o: ['Umum / Mandiri', 'BPJS Kesehatan', 'Asuransi Swasta', 'Perusahaan'] },
    { n: 'sumber_pasien', l: 'Sumber Pasien', t: 'select', o: ['Datang Sendiri', 'Rujukan Puskesmas', 'Rujukan RS Lain', 'Rujukan Dokter/Klinik'] },
    { n: 'diagnosis_awal', l: 'Diagnosis Awal', t: 'textarea', c: 'md:col-span-2', a: 'rows="2"' },
    { n: 'keluhan_utama', l: 'Keluhan Utama', t: 'textarea', r: 1, c: 'md:col-span-2', a: 'rows="3" placeholder="Tuliskan keluhan atau alasan kunjungan singkat..."' },
  ]},
];

const INPUT = 'w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all placeholder:text-slate-400 read-only:bg-slate-100 read-only:text-slate-500';
const LABEL = 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5';
const PILL = 'block text-center px-3 py-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-600 transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderField(f) {
  if (f.t === 'rm') {
    return `
      <div class="md:col-span-2">
        <label for="no_rm" class="${LABEL}">No. Rekam Medis (RM)</label>
        <div class="flex gap-2">
          <input type="text" id="no_rm" name="no_rm" placeholder="Contoh: RM-00123" class="${INPUT}">
          <button type="button" id="btnCek" onclick="cekPasien()"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            Cek
          </button>
        </div>
        <p id="hintRmBaru" class="hidden mt-2 text-xs text-slate-500"></p>
        <div id="infoPasien" class="hidden mt-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3 text-xs font-bold text-blue-900 items-center gap-1.5">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Pasien terverifikasi. Data identitas terisi otomatis dan tidak dapat diubah di sini; hubungi loket pendaftaran bila ada data yang perlu diperbarui.
        </div>
      </div>`;
  }

  const req = f.r ? ' required data-wajib' : '';
  const label = `<label for="${f.n}" class="${LABEL}">${f.l}${f.r ? ' <span class="text-red-500">*</span>' : ''}</label>`;
  const a = f.a || '';
  let el;

  if (f.t === 'select') {
    el = `<select id="${f.n}" name="${f.n}" class="${INPUT}"${req}><option value="">Pilih...</option>${f.o.map(o => `<option>${o}</option>`).join('')}</select>`;
  } else if (f.t === 'pill') {
    el = `<div class="flex gap-2">${f.o.map(([v, t]) => `
      <label class="flex-1 cursor-pointer"><input type="radio" name="${f.n}" value="${v}" class="peer sr-only"${req}><span class="${PILL}">${t}</span></label>`).join('')}</div>`;
  } else if (f.t === 'textarea') {
    el = `<textarea id="${f.n}" name="${f.n}" rows="2" class="${INPUT} resize-none"${req} ${a}></textarea>`;
  } else if (f.t === 'ro') {
    el = `<input type="text" id="${f.n}" name="${f.n}" readonly data-ro placeholder="-" class="${INPUT}">`;
  } else {
    el = `<input type="${f.t || 'text'}" id="${f.n}" name="${f.n}" class="${INPUT}"${req} ${a}>`;
  }

  const peringatan = f.n === 'tgl_periksa' ? '<p id="peringatanJadwal" class="hidden mt-1.5 text-xs text-amber-600 font-semibold"></p>' : '';
  return `<div class="${f.c || ''}">${label}${el}${peringatan}</div>`;
}

function renderSections() {
  document.getElementById('sections').innerHTML = SECTIONS.map((s, i) => `
    <fieldset data-sec="${i}" class="space-y-4 min-w-0">
      <div class="flex items-center gap-2.5 pb-2 border-b border-slate-200">
        <span class="no-sec bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">${i + 1}</span>
        <h2 class="font-bold text-slate-900 text-sm">${s.j}</h2>
        ${s.aksi || ''}
      </div>
      <div class="grid md:grid-cols-2 gap-4">${s.f.map(renderField).join('')}</div>
    </fieldset>`).join('');
  document.getElementById('dlProvinsi').innerHTML = PROVINSI.map(p => `<option value="${p}">`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const data = sessionStorage.getItem('dokterTerpilih');
  if (!data) return tampilkanBelumPilihDokter();

  let dokter;
  try { dokter = JSON.parse(data); } catch (e) { return tampilkanBelumPilihDokter(); }
  tampilkanFormDenganDokter(dokter);
});

function tampilkanBelumPilihDokter() {
  const wrapper = document.getElementById('formWrapper');
  wrapper.innerHTML = '';
  wrapper.appendChild(document.getElementById('templateBelumPilih').content.cloneNode(true));
}

function tampilkanFormDenganDokter(dokter) {
  const wrapper = document.getElementById('formWrapper');
  wrapper.innerHTML = '';
  wrapper.appendChild(document.getElementById('templateForm').content.cloneNode(true));
  renderSections();

  const form = document.getElementById('formDaftar');
  const $ = id => document.getElementById(id);

  // Tampilkan pesan error dari server (?error=...)
  const pesan = { empty: 'Ada isian wajib yang belum diisi.', tanggal: 'Tanggal periksa tidak boleh sudah lewat.', ktp: 'No. KTP harus 16 digit angka.', email: 'Format e-mail tidak valid.', rm: 'No. RM tidak ditemukan. Gunakan "Pasien Baru" bila belum punya.', server: 'Terjadi kesalahan di server. Silakan coba lagi.' };
  const err = new URLSearchParams(location.search).get('error');
  if (err) {
    $('pesanError').textContent = pesan[err] || 'Pendaftaran gagal. Silakan coba lagi.';
    $('pesanError').classList.remove('hidden');
  }

  // Dokter & klinik dari halaman sebelumnya
  $('id_dokter').value = dokter.id_dokter;
  $('kode_klinik').value = dokter.kode_klinik;
  $('klinik_tujuan').value = dokter.nama_klinik;
  $('dokter_tujuan').value = dokter.nama_dokter;

  // Tanggal daftar (hari ini) & rentang tanggal periksa (14 hari)
  const hariIni = new Date();
  const maxTanggal = new Date();
  maxTanggal.setDate(hariIni.getDate() + 13);
  $('tgl_daftar').value = formatTanggalInput(hariIni);
  const inputTanggal = $('tgl_periksa');
  inputTanggal.min = formatTanggalInput(hariIni);
  inputTanggal.max = formatTanggalInput(maxTanggal);
  inputTanggal.value = formatTanggalInput(hariIni);
  $('kewarganegaraan').value = 'WNI';

  inputTanggal.addEventListener('change', () => {
    cekKecocokanJadwal(dokter, inputTanggal.value);
    hitungNoRegistrasi();
  });
  cekKecocokanJadwal(dokter, inputTanggal.value);
  hitungNoRegistrasi();

  // Umur otomatis dari tanggal lahir
  $('tgl_lahir').max = formatTanggalInput(hariIni);
  $('tgl_lahir').addEventListener('change', hitungUmur);

  // Pasien lama / baru
  form.querySelectorAll('[name="tipe_pasien"]').forEach(r => r.addEventListener('change', () => aturTipePasien(r.value)));
  $('no_rm').addEventListener('input', () => {
    if (pasienTerverifikasi) kosongkanDataPasien();
    pasienTerverifikasi = false;
    $('infoPasien').classList.add('hidden');
    $('infoPasien').classList.remove('flex');
  });
  aturTipePasien('lama');

  form.addEventListener('submit', e => {
    if (form.tipe_pasien.value === 'lama' && !pasienTerverifikasi) {
      e.preventDefault();
      $('no_rm').focus();
      return alert('Klik "Cek" untuk memverifikasi No. RM terlebih dahulu.');
    }
    if (form.tipe_pasien.value === 'baru' && !/^\d{16}$/.test(form.no_ktp.value)) {
      e.preventDefault();
      form.no_ktp.focus();
      return alert('No. KTP harus 16 digit angka.');
    }
  });
}

// Pasien baru: tampilkan No. RM berikutnya menurut daftar pasien saat ini.
// Ini perkiraan; nomor final ditetapkan server saat pendaftaran disimpan.
let permintaanRm = 0;
function muatNoRmBaru() {
  const rm = document.getElementById('no_rm');
  const hint = document.getElementById('hintRmBaru');
  const id = ++permintaanRm;
  rm.value = '';
  rm.placeholder = 'Memuat nomor...';
  hint.classList.add('hidden');

  fetch('../Backend/get_no_rm.php')
    .then(res => res.json())
    .then(res => {
      if (id !== permintaanRm) return; // pengguna sudah pindah tipe pasien
      if (res.status !== 'success') throw new Error('gagal');
      rm.value = res.no_rm;
      hint.textContent = res.terakhir
        ? `Nomor terakhir di sistem: ${res.terakhir}. Nomor final dipastikan saat pendaftaran disimpan.`
        : 'Belum ada pasien terdaftar. Nomor final dipastikan saat pendaftaran disimpan.';
      hint.classList.remove('hidden');
    })
    .catch(() => {
      if (id !== permintaanRm) return;
      rm.placeholder = 'Dibuat otomatis oleh sistem';
      hint.textContent = 'Nomor belum bisa ditampilkan, tapi akan dibuat otomatis saat pendaftaran disimpan.';
      hint.classList.remove('hidden');
    });
}

// Kosongkan data pasien (bagian 1-3) agar data pasien lama tidak terbawa ke pasien baru atau sebaliknya.
// Bagian Tujuan Klinik (klinik, dokter, tanggal periksa, nomor registrasi) tetap dipertahankan.
function kosongkanDataPasien() {
  document.querySelectorAll('#sections fieldset').forEach(fs => {
    if (Number(fs.dataset.sec) > 2) return;
    fs.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.id === 'no_rm' || el.id === 'tgl_daftar') return;
      if (el.type === 'radio') el.checked = false;
      else el.value = '';
    });
  });
  const kw = document.getElementById('kewarganegaraan');
  if (kw) kw.value = 'WNI';
}

// Pasien lama: hanya Identitas (baca saja, terisi dari No. RM) + Tujuan Klinik.
// Pasien baru: keempat bagian, semua bisa diisi.
function aturTipePasien(tipe) {
  const baru = tipe === 'baru';
  const rm = document.getElementById('no_rm');
  rm.readOnly = baru;
  rm.required = !baru;
  rm.value = '';
  rm.placeholder = baru ? 'Memuat nomor...' : 'Contoh: RM-00123';
  document.getElementById('hintRmBaru').classList.add('hidden');
  permintaanRm++; // batalkan permintaan nomor yang masih berjalan
  document.getElementById('btnCek').classList.toggle('hidden', baru);
  document.getElementById('infoPasien').classList.add('hidden');
  document.getElementById('infoPasien').classList.remove('flex');
  pasienTerverifikasi = false;

  kosongkanDataPasien();

  let nomor = 0;
  document.querySelectorAll('#sections fieldset').forEach(fs => {
    const tampil = baru || !SECTIONS[fs.dataset.sec].baru;
    fs.classList.toggle('hidden', !tampil);
    fs.disabled = !tampil; // bagian tersembunyi tidak divalidasi dan tidak ikut terkirim
    if (tampil) fs.querySelector('.no-sec').textContent = ++nomor;
  });

  if (baru) muatNoRmBaru();

  document.querySelectorAll('#sections fieldset[data-sec="0"] [name]').forEach(el => {
    if (el.id === 'no_rm' || el.hasAttribute('data-ro')) return;
    if (el.type === 'radio') {
      el.disabled = !baru;
    } else {
      el.readOnly = !baru;
      el.required = baru && el.hasAttribute('data-wajib');
    }
  });
}

function formatTanggalInput(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function hitungUmur() {
  const v = document.getElementById('tgl_lahir').value;
  const out = document.getElementById('umur');
  if (!v) { out.value = ''; return; }
  const lahir = new Date(v + 'T00:00:00'), now = new Date();
  let y = now.getFullYear() - lahir.getFullYear();
  let m = now.getMonth() - lahir.getMonth();
  let d = now.getDate() - lahir.getDate();
  if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  out.value = y < 0 ? '' : `${y} thn ${m} bln ${d} hari`;
}

function namaHariDariTanggal(tglStr) {
  return URUTAN_HARI_JS[new Date(tglStr + 'T00:00:00').getDay()];
}

function cekKecocokanJadwal(dokter, tglPeriksa) {
  const hari = namaHariDariTanggal(tglPeriksa);
  const jadwal = dokter.jadwal || [];
  const peringatan = document.getElementById('peringatanJadwal');
  if (!jadwal.some(j => j.hari === hari)) {
    const tersedia = [...new Set(jadwal.map(j => j.hari))].join(', ') || 'belum ada jadwal';
    peringatan.textContent = `Dokter ini tidak praktek pada hari ${hari}. Hari praktek: ${tersedia}.`;
    peringatan.classList.remove('hidden');
  } else {
    peringatan.classList.add('hidden');
  }
}

// Cek pasien lama berdasarkan No. RM, lalu isi otomatis seluruh field yang tersedia
function cekPasien() {
  const rm = document.getElementById('no_rm').value.trim();
  if (!rm) return alert('Masukkan No. RM terlebih dahulu!');

  fetch('../Backend/get_pasien.php?no_rm=' + encodeURIComponent(rm))
    .then(res => res.json())
    .then(res => {
      if (res.status !== 'success') {
        pasienTerverifikasi = false;
        document.getElementById('infoPasien').classList.add('hidden');
        return alert('Pasien dengan No. RM tersebut tidak ditemukan!');
      }
      Object.entries(res.data).forEach(([k, v]) => {
        if (k === 'no_rm' || v === null) return;
        const radio = document.querySelector(`input[type="radio"][name="${k}"][value="${v}"]`);
        if (radio) {
          if (!radio.closest('fieldset').disabled) radio.checked = true;
          return;
        }
        const el = document.querySelector(`[name="${k}"]:not([type="radio"])`);
        if (el && !el.closest('fieldset').disabled) el.value = v;
      });
      hitungUmur();
      pasienTerverifikasi = true;
      document.getElementById('infoPasien').classList.remove('hidden');
      document.getElementById('infoPasien').classList.add('flex');
    })
    .catch(err => {
      console.error('Gagal mengecek pasien:', err);
      alert('Gagal menghubungi server. Coba lagi.');
    });
}

// Estimasi No. Registrasi (nomor urut antrean ikut menjadi 3 digit terakhir)
function hitungNoRegistrasi() {
  const kodeKlinik = document.getElementById('kode_klinik').value;
  const idDokter = document.getElementById('id_dokter').value;
  const tglPeriksa = document.getElementById('tgl_periksa').value;
  if (!kodeKlinik || !idDokter || !tglPeriksa) return;

  const qs = `kode_klinik=${encodeURIComponent(kodeKlinik)}&id_dokter=${encodeURIComponent(idDokter)}&tgl_periksa=${encodeURIComponent(tglPeriksa)}`;
  fetch('../Backend/get_no_urut.php?' + qs)
    .then(res => res.json())
    .then(res => {
      if (res.status !== 'success') return;
      const tgl = new Date(tglPeriksa + 'T00:00:00');
      const yymmdd = String(tgl.getFullYear()).slice(-2) + String(tgl.getMonth() + 1).padStart(2, '0') + String(tgl.getDate()).padStart(2, '0');
      const urutKlinik = String(res.no_urut).padStart(3, '0');
      document.getElementById('no_registrasi').value = `${yymmdd}${kodeKlinik}${idDokter}${urutKlinik}`;
    })
    .catch(err => console.error('Gagal menghitung nomor registrasi:', err));
}
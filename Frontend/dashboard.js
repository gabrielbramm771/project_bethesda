// ============ FRONTEND ============
// Semua data diambil dari BACKEND lewat fetch(), tidak ada query database di sini.

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function formatTanggal(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function cekSesi() {
  const res = await fetch('../Backend/api_cek_sesi.php');
  const hasil = await res.json();
  if (!hasil.logged_in) {
    window.location.href = 'login.html';
    return null;
  }
  return hasil;
}

function labelStatus(status) {
  const peta = { 'Pending': 'Menunggu', 'ACC': 'Disetujui', 'Ditolak': 'Ditolak', 'Selesai': 'Selesai' };
  return peta[status] || status;
}
function kelasBadge(status) {
  const peta = { 'Pending': 'badge-pending', 'ACC': 'badge-acc', 'Ditolak': 'badge-ditolak', 'Selesai': 'badge-selesai' };
  return peta[status] || 'badge-pending';
}

function hitungUsia(iso) {
  if (!iso) return null;
  const lahir = new Date(iso);
  const sekarang = new Date();
  let usia = sekarang.getFullYear() - lahir.getFullYear();
  const belumUlangTahun =
    sekarang.getMonth() < lahir.getMonth() ||
    (sekarang.getMonth() === lahir.getMonth() && sekarang.getDate() < lahir.getDate());
  if (belumUlangTahun) usia--;
  return usia;
}

async function muatRingkasan() {
  const res = await fetch('../Backend/api_ringkasan_dashboard.php');
  const hasil = await res.json();
  if (!hasil.success) return;

  document.getElementById('statTotal').textContent = hasil.total_hari_ini;
  document.getElementById('statMenunggu').textContent = hasil.menunggu;
  document.getElementById('statSelesai').textContent = hasil.selesai;
}

async function muatDaftarPasien() {
  const res = await fetch('../Backend/api_daftar_pasien.php');
  const hasil = await res.json();
  const tbody = document.getElementById('tabelPasien');

  if (!hasil.success || hasil.data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="kosong">Belum ada pasien terdaftar untuk Anda hari ini.</td></tr>';
    return;
  }

  tbody.innerHTML = hasil.data.map(row => {
    const bisaDiperiksa = row.status !== 'Selesai' && row.status !== 'Ditolak';
    return `
    <tr>
      <td>${row.no_urut}</td>
      <td>
        <div class="row-title">${escapeHtml(row.nama_pasien)}</div>
        <div class="row-meta">No. RM ${escapeHtml(row.no_rm)} · Lahir ${formatTanggal(row.tgl_lahir)} · ${hitungUsia(row.tgl_lahir) ?? '-'} th</div>
      </td>
      <td>${escapeHtml(row.keluhan_utama || '-')}</td>
      <td><span class="badge ${kelasBadge(row.status)}">${labelStatus(row.status)}</span></td>
      <td>
        ${bisaDiperiksa
          ? `<a class="btn-small" href="rekam_medis.html?no_registrasi=${encodeURIComponent(row.no_registrasi)}">Periksa</a>`
          : `<span class="btn-small btn-disabled">${labelStatus(row.status)}</span>`}
      </td>
    </tr>`;
  }).join('');
}

document.getElementById('btnLogout').addEventListener('click', async () => {
  await fetch('../Backend/api_logout.php');
  window.location.href = 'login.html';
});

(async () => {
  const sesi = await cekSesi();
  if (!sesi) return;

  document.getElementById('namaDokter').textContent = sesi.nama_dokter;
  document.getElementById('subJudul').textContent =
    'Dashboard dokter · ' + new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });

  await muatRingkasan();
  await muatDaftarPasien();

  const params = new URLSearchParams(window.location.search);
  if (params.get('sukses')) {
    document.getElementById('pesanSukses').style.display = 'block';
  }
})();

// ============ FRONTEND ============

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function formatTanggal(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const params = new URLSearchParams(window.location.search);
const noRegistrasi = params.get('no_registrasi');

async function cekSesi() {
  const res = await fetch('../Backend/api_cek_sesi.php');
  const hasil = await res.json();
  if (!hasil.logged_in) {
    window.location.href = 'login.html';
    return null;
  }
  return hasil;
}

// ---------- Tabel diagnosis dinamis ----------

function tambahBarisDiagnosis(kode = '', nama = '') {
  const template = document.getElementById('templateBarisDiagnosis');
  const baris = template.content.firstElementChild.cloneNode(true);

  baris.querySelector('.dx-kode').value = kode;
  baris.querySelector('.dx-nama').value = nama;
  baris.querySelector('.btn-hapus-dx').addEventListener('click', () => baris.remove());

  document.getElementById('tabelDiagnosis').appendChild(baris);
}

function ambilDataDiagnosis() {
  const baris = document.querySelectorAll('#tabelDiagnosis tr');
  const hasil = [];
  baris.forEach(tr => {
    const kode = tr.querySelector('.dx-kode').value.trim();
    const nama = tr.querySelector('.dx-nama').value.trim();
    if (kode !== '' || nama !== '') {
      hasil.push({ kode, nama });
    }
  });
  return hasil;
}

document.getElementById('btnTambahDiagnosis').addEventListener('click', () => tambahBarisDiagnosis());

// ---------- Muat detail rekam medis ----------

async function muatDetail() {
  if (!noRegistrasi) {
    window.location.href = 'dashboard.html';
    return;
  }

  const res = await fetch('../Backend/api_rekam_medis.php?no_registrasi=' + encodeURIComponent(noRegistrasi));
  const hasil = await res.json();

  if (!hasil.success) {
    window.location.href = 'dashboard.html';
    return;
  }

  const d = hasil.data;
  document.getElementById('noRegistrasiLabel').textContent = 'No. registrasi ' + d.no_registrasi;
  document.getElementById('rmHeader').innerHTML = `
    <div class="row-title">${escapeHtml(d.nama_pasien)}</div>
    <div class="row-meta">No. RM ${escapeHtml(d.no_rm)} · Lahir ${formatTanggal(d.tgl_lahir)}</div>
    <div class="row-meta">Tanggal periksa: ${formatTanggal(d.tgl_periksa)}</div>
  `;

  document.getElementById('keluhan_utama').value = d.keluhan_utama || '';
  document.getElementById('rps').value = d.rps || '';

  document.getElementById('rpd_tidak_ada').checked  = !!Number(d.rpd_tidak_ada);
  document.getElementById('rpd_hipertensi').checked = !!Number(d.rpd_hipertensi);
  document.getElementById('rpd_asma').checked       = !!Number(d.rpd_asma);
  document.getElementById('rpd_tbc').checked        = !!Number(d.rpd_tbc);
  document.getElementById('rpd_dm').checked         = !!Number(d.rpd_dm);
  document.getElementById('rpd_ginjal').checked     = !!Number(d.rpd_ginjal);
  document.getElementById('rpd_jantung').checked    = !!Number(d.rpd_jantung);

  document.getElementById('riwayat_operasi_ada').value  = d.riwayat_operasi_ada || 'Tidak';
  document.getElementById('riwayat_operasi_ket').value  = d.riwayat_operasi_ket || '';
  document.getElementById('riwayat_alergi_ada').value   = d.riwayat_alergi_ada || 'Tidak';
  document.getElementById('riwayat_alergi_ket').value   = d.riwayat_alergi_ket || '';
  document.getElementById('riwayat_keluarga_ada').value = d.riwayat_keluarga_ada || 'Tidak';
  document.getElementById('riwayat_keluarga_ket').value = d.riwayat_keluarga_ket || '';

  document.getElementById('assesment').value       = d.assesment || '';
  document.getElementById('planning_dokter').value = d.planning_dokter || '';
  document.getElementById('diet').value            = d.diet || '';
  document.getElementById('resep_obat').value      = d.resep_obat || '';

  document.getElementById('tabelDiagnosis').innerHTML = '';
  if (Array.isArray(d.diagnosis) && d.diagnosis.length > 0) {
    d.diagnosis.forEach(dx => tambahBarisDiagnosis(dx.kode, dx.nama));
  } else {
    tambahBarisDiagnosis(); // minimal 1 baris kosong untuk mulai isi
  }
}

// ---------- Simpan ----------

document.getElementById('formRekamMedis').addEventListener('submit', async (e) => {
  e.preventDefault();

  const pesanError = document.getElementById('pesanError');
  pesanError.style.display = 'none';

  const body = {
    no_registrasi: noRegistrasi,
    rps: document.getElementById('rps').value.trim(),

    rpd_tidak_ada:  document.getElementById('rpd_tidak_ada').checked,
    rpd_hipertensi: document.getElementById('rpd_hipertensi').checked,
    rpd_asma:       document.getElementById('rpd_asma').checked,
    rpd_tbc:        document.getElementById('rpd_tbc').checked,
    rpd_dm:         document.getElementById('rpd_dm').checked,
    rpd_ginjal:     document.getElementById('rpd_ginjal').checked,
    rpd_jantung:    document.getElementById('rpd_jantung').checked,

    riwayat_operasi_ada:  document.getElementById('riwayat_operasi_ada').value,
    riwayat_operasi_ket:  document.getElementById('riwayat_operasi_ket').value.trim(),
    riwayat_alergi_ada:   document.getElementById('riwayat_alergi_ada').value,
    riwayat_alergi_ket:   document.getElementById('riwayat_alergi_ket').value.trim(),
    riwayat_keluarga_ada: document.getElementById('riwayat_keluarga_ada').value,
    riwayat_keluarga_ket: document.getElementById('riwayat_keluarga_ket').value.trim(),

    assesment:       document.getElementById('assesment').value.trim(),
    planning_dokter: document.getElementById('planning_dokter').value.trim(),
    diet:            document.getElementById('diet').value.trim(),
    resep_obat:      document.getElementById('resep_obat').value.trim(),

    diagnosis: ambilDataDiagnosis()
  };

  try {
    const res = await fetch('../Backend/api_rekam_medis.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const hasil = await res.json();

    if (hasil.success) {
      window.location.href = 'dashboard.html?sukses=1';
    } else {
      pesanError.textContent = hasil.message || 'Gagal menyimpan';
      pesanError.style.display = 'block';
    }
  } catch (err) {
    pesanError.textContent = 'Tidak bisa menghubungi server';
    pesanError.style.display = 'block';
  }
});

document.getElementById('btnLogout').addEventListener('click', async () => {
  await fetch('../Backend/api_logout.php');
  window.location.href = 'login.html';
});

(async () => {
  const sesi = await cekSesi();
  if (!sesi) return;
  await muatDetail();
})();

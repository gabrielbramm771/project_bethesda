function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

const params = new URLSearchParams(window.location.search);
const kodeKlinik = params.get('kode_klinik');

if (!kodeKlinik) {
  window.location.href = 'pilih_klinik.html';
}

fetch('../Backend/api_dokter_per_klinik.php?kode_klinik=' + encodeURIComponent(kodeKlinik))
  .then(res => res.json())
  .then(hasil => {
    if (hasil.status !== 'success') {
      document.getElementById('dokterContainer').innerHTML = '<p class="text-red-500 text-sm">Gagal memuat data dokter.</p>';
      return;
    }

    document.getElementById('judulKlinik').textContent = hasil.nama_klinik;

    if (hasil.dokter.length === 0) {
      document.getElementById('dokterContainer').innerHTML = '<p class="text-slate-400 text-sm">Belum ada dokter terdaftar di klinik ini.</p>';
      return;
    }

    document.getElementById('dokterContainer').innerHTML = hasil.dokter.map(d => {
      const jadwalHtml = d.jadwal.length > 0
        ? d.jadwal.map(j => `
            <span class="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg">
              ${j.hari} &middot; ${j.jam_mulai.slice(0,5)}-${j.jam_selesai.slice(0,5)}
            </span>`).join('')
        : '<span class="text-xs text-slate-400">Jadwal belum tersedia</span>';

      return `
        <div class="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="font-bold text-slate-900">${escapeHtml(d.nama_dokter)}</div>
            <div class="mt-2 flex flex-wrap gap-1.5">${jadwalHtml}</div>
          </div>
          <button type="button"
            class="btn-pilih-dokter shrink-0 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all active:scale-95"
            data-id-dokter="${d.id_dokter}"
            data-nama-dokter="${escapeHtml(d.nama_dokter)}"
            data-jadwal='${JSON.stringify(d.jadwal)}'>
            Daftar dengan dokter ini
          </button>
        </div>`;
    }).join('');

    document.querySelectorAll('.btn-pilih-dokter').forEach(btn => {
      btn.addEventListener('click', () => {
        const dokterTerpilih = {
          id_dokter: btn.dataset.idDokter,
          nama_dokter: btn.dataset.namaDokter,
          kode_klinik: kodeKlinik,
          nama_klinik: hasil.nama_klinik,
          jadwal: JSON.parse(btn.dataset.jadwal),
        };
        sessionStorage.setItem('dokterTerpilih', JSON.stringify(dokterTerpilih));
        window.location.href = 'pendaftaran.html';
      });
    });
  })
  .catch(err => {
    console.error('Gagal memuat dokter:', err);
    document.getElementById('dokterContainer').innerHTML = '<p class="text-red-500 text-sm">Gagal memuat data dokter.</p>';
  });

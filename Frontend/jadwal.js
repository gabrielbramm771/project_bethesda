const URUTAN_HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

fetch('../Backend/api_jadwal_semua.php')
  .then(res => res.json())
  .then(hasil => {
    const container = document.getElementById('jadwalContainer');

    if (hasil.status !== 'success' || hasil.data.length === 0) {
      container.innerHTML = '<p class="text-slate-400 text-sm">Jadwal belum tersedia.</p>';
      return;
    }

    // Kelompokkan berdasarkan hari
    const perHari = {};
    URUTAN_HARI.forEach(h => perHari[h] = []);
    hasil.data.forEach(row => {
      if (!perHari[row.hari]) perHari[row.hari] = [];
      perHari[row.hari].push(row);
    });

    container.innerHTML = URUTAN_HARI
      .filter(hari => perHari[hari].length > 0)
      .map(hari => `
        <div>
          <h2 class="text-lg font-bold text-slate-900 pb-2 border-b border-slate-200">${hari}</h2>
          <div class="mt-3 grid sm:grid-cols-2 gap-3">
            ${perHari[hari].map(d => `
              <div class="border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <div class="font-semibold text-slate-900 text-sm">${escapeHtml(d.nama_dokter)}</div>
                  <div class="text-xs text-slate-500 mt-0.5">${escapeHtml(d.nama_klinik)}</div>
                </div>
                <div class="text-sm font-mono font-semibold text-blue-700 whitespace-nowrap">
                  ${d.jam_mulai.slice(0,5)}&ndash;${d.jam_selesai.slice(0,5)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
  })
  .catch(err => {
    console.error('Gagal memuat jadwal:', err);
    document.getElementById('jadwalContainer').innerHTML = '<p class="text-red-500 text-sm">Gagal memuat jadwal dokter.</p>';
  });

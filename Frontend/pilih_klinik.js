function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

fetch('../Backend/api_klinik.php')
  .then(res => res.json())
  .then(hasil => {
    const container = document.getElementById('klinikContainer');

    if (hasil.status !== 'success' || hasil.data.length === 0) {
      container.innerHTML = '<p class="text-slate-400 text-sm col-span-full">Belum ada data klinik.</p>';
      return;
    }

    container.innerHTML = hasil.data.map(k => `
      <a href="jadwal_klinik.html?kode_klinik=${encodeURIComponent(k.kode_klinik)}"
         class="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
        <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="mt-4 font-semibold text-slate-900 text-sm">${escapeHtml(k.nama_klinik)}</div>
        <div class="text-xs text-blue-600 mt-1 font-medium">Lihat dokter &rarr;</div>
      </a>
    `).join('');
  })
  .catch(err => {
    console.error('Gagal memuat klinik:', err);
    document.getElementById('klinikContainer').innerHTML = '<p class="text-red-500 text-sm col-span-full">Gagal memuat daftar klinik.</p>';
  });

// ============ FRONTEND ============
// Mengambil isian form dan mengirimnya ke BACKEND lewat fetch (bukan form-submit biasa)
document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const pesanError = document.getElementById('pesanError');
  pesanError.style.display = 'none';

  try {
    const res = await fetch('../Backend/api_login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const hasil = await res.json();

    if (hasil.success) {
      window.location.href = 'dashboard.html';
    } else {
      pesanError.textContent = hasil.message || 'Login gagal';
      pesanError.style.display = 'block';
    }
  } catch (err) {
    pesanError.textContent = 'Tidak bisa menghubungi server';
    pesanError.style.display = 'block';
  }
});

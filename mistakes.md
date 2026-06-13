# PERINGATAN KESALAHAN KRITIS (MISTAKE LOG)

**Konteks Utama:** Pengguna sangat tidak puas dan tidak terima dengan perubahan/jawaban terakhir. AI telah melakukan kesalahan yang mengganggu alur kerja.

**Instruksi Wajib untuk AI:**
1. Berhenti melakukan perubahan lain.
2. Jangan memberikan alasan atau penjelasan teknis yang bertele-tele.
3. Pahami, catat, dan terapkan aturan di bawah ini secara mutlak agar TIDAK TERULANG LAGI.

---

### Kesalahan yang Baru Saja Dilakukan AI:
AI melakukan perubahan implementasi berkali-kali untuk transisi About ke Project tanpa memastikan hasilnya sesuai tujuan visual pengguna.

Hasil yang dibuat masih terasa seperti efek glow/overlay atau perubahan struktur yang tidak tepat, bukan WebGL yang benar-benar membakar About section dan membuka Project section di belakangnya.

AI juga tidak segera mencatat kesalahan ini ke `mistakes.md` ketika pengguna menunjukkan bahwa hasilnya salah.

### Aturan & Koreksi Mutlak (Rule Update):
Mulai sekarang, jika pengguna mengatakan hasil/arah berubah, tidak sesuai, atau menyebut itu sebagai mistake, AI wajib berhenti dulu dan mencatat kesalahan tersebut di `mistakes.md` sebelum melanjutkan pekerjaan apa pun.

Untuk transisi About ke Project, target yang benar adalah: WebGL membakar About section sehingga Project section yang sudah siap di belakang terlihat. Bukan sekadar glow, bukan efek tempelan, dan bukan Project section yang terasa naik menutupi About.

---

### Tindakan yang Harus Dilakukan AI Sekarang:
* **Konfirmasi:** Jawab dengan singkat "Saya mengerti. Aturan telah dicatat."
* **Evaluasi Diri:** Tanamkan aturan di atas dalam konteks percakapan kita saat ini.
* **Perbaikan:** Jangan melakukan perubahan lanjutan selain yang diminta eksplisit oleh pengguna.

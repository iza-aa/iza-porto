final_plan = """# Iza Creation Labs Redesign: Technical Blueprint
## Seamless Transition from Experience to Contact Section

Dokumen ini berisi spesifikasi teknis lengkap untuk implementasi transisi antar-section dan struktur bento grid pada website **Iza Creation Labs**. Fokus utama adalah sinkronisasi animasi menggunakan GSAP dan penyesuaian styling khusus untuk komponen *Liquid Glass*.

---

## 1. Arsitektur Komponen & Flow
Redesain ini melibatkan koordinasi antara empat komponen utama:
* `ExperienceSection.tsx`: Section atas dengan estetika klasik (tirai merah/tirai lukisan).
* `ContactSection.tsx`: Section target dengan layout 11-card Bento Grid bergaya *soft liquid/matte*.
* `NavOverlay.tsx`: Komponen navigasi yang berpindah posisi secara dinamis.
* `LiquidGlass.tsx`: Wrapper pembungkus untuk setiap kartu di dalam grid yang direvisi visualnya.

---

## 2. Mekanika Transisi (The "Master" Animation)
Untuk menghindari masalah "canvas baru di bawah" atau scroll yang meleset, implementasi wajib menggunakan teknik **Pinning** dan **Stacking**.

### A. Phase 1: Viewport Pinning
* **Trigger:** Akhir dari `ExperienceSection.tsx`.
* **Logika:** Gunakan GSAP `ScrollTrigger` dengan properti `pin: true` pada container utama.
* **Efek:** Halaman berhenti bergerak secara fisik ke bawah. Scroll dari user akan dialihkan (hijacked) untuk menjalankan timeline animasi transisi.

### B. Phase 2: The Vertical Drop & Scale (Landing)
* **Positioning:** `ContactSection.tsx` diatur sebagai `position: fixed` atau `absolute` dengan `top: 0`, berada tepat di bawah/belakang `ExperienceSection.tsx` (z-index layering).
* **Motion:** Kartu utama bento (Bento Container) turun dari `y: -100%` ke `y: 0` (tengah layar).
* **Scaling:** Animasi membesar dari `scale: 0.5` ke `scale: 0.95`. Sisa skala 0.05 (gap) akan mengekspos background hitam dasar untuk menciptakan efek bingkai.

### C. Phase 3: NavOverlay FLIP Animation
* Secara bersamaan dengan pendaratan kartu, `NavOverlay.tsx` melakukan transisi posisi.
* Menggunakan **GSAP Flip**, komponen berpindah dari posisi `fixed` (pojok kiri bawah layar) masuk ke dalam slot kartu spesifik di kolom kiri bento grid.

---

## 3. Spesifikasi Layout Bento (ContactSection.tsx)
Gunakan CSS Grid untuk membangun susunan 11 kartu. Setiap sel wajib dibungkus dengan komponen `<LiquidGlass />`.

### Distribusi 11 Slot Grid:
| ID | Slot Card | Konten / Target | Visual |
| :--- | :--- | :--- | :--- |
| 1 | **Tengah (Utama)** | Foto Portrait Rezky | Hero visual paling dominan. |
| 2 | **Bawah Tengah** | **Section Title** | Card horizontal panjang berisi teks "GET IN TOUCH". |
| 3 | **Kiri (Tengah)** | **Nav Block** | Tempat pendaratan `NavOverlay.tsx`. |
| 4-11| **Slot Sisanya** | Placeholder Konten | Tech Stack, Bio, atau Link Sosial. |

---

## 4. Efek Visual & Border Fill (The Final Touch)
Setelah kartu mendarat sempurna (Phase 2 selesai), jalankan animasi penutup:

* **SVG Stroke Draw-in:**
    * Letakkan elemen `<svg>` berupa *rounded rectangle* di sekeliling `ContactSection` container.
    * Animasi `stroke-dashoffset` berjalan dari 0% ke 100% (mengelilingi bingkai).
    * Setelah 100% terpenuhi, garis menjadi solid dan animasi berhenti (statis).

### Penyesuaian Styling `LiquidGlass.tsx` (Matte/Milky Glassmorphism)
Berdasarkan referensi visual terbaru, gaya yang digunakan bukanlah kaca transparan gelap, melainkan gaya **Soft UI / Milky Glass** yang sangat mulus. Berikut parameter implementasinya menggunakan Tailwind CSS:
* **Background:** Warna *off-white* solid atau dengan opasitas sangat tinggi untuk memberikan kesan material padat yang halus (`bg-[#F9F9F9]` atau `bg-white/90`). Background *container* utama di belakang kartu harus sedikit lebih gelap (misal `bg-[#E5E5E5]`) agar kontras kartu terlihat.
* **Border Radius:** Kurva yang sangat membulat (exaggerated rounded corners), misalnya `rounded-[2rem]` atau `rounded-3xl` untuk memberikan efek "cairan" yang solid.
* **Shadows & Elevation:** Mengganti *border* garis keras dengan bayangan lembut (*diffuse drop shadow*) untuk mengangkat kartu dari *background*. Contoh: `shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]`.
* **Subtle Highlights:** Tambahkan *inner border* putih yang sangat tipis untuk menangkap "cahaya" pada material: `border border-white/60`.

---

## 5. Implementation Notes (Anti-Bug Checklist)
* **No Canvas Tag:** Jangan gunakan elemen `<canvas>` untuk membangun grid agar komponen tetap bisa di-render secara normal dan SEO-friendly.
* **Layering:** Pastikan `ContactSection` sudah "siap" di belakang atau di luar layar sebelum animasi dimulai agar tidak ada lompatan visual (glitch).
* **Scrubbing:** Set `scrub: 1` pada ScrollTrigger agar pergerakan kartu mengikuti kecepatan putaran roda mouse user secara halus.
* **Padding Correction:** Karena `ExperienceSection` menggunakan `pl` (padding-left) besar, pastikan titik awal `NavOverlay` dihitung dengan benar sebelum melakukan FLIP ke bento grid.

---

## 6. Action Items
1. [ ] **Update Component:** Modifikasi file `LiquidGlass.tsx` untuk menerapkan palet warna *matte off-white*, *soft shadows*, dan radius besar seperti spesifikasi di atas.
2. [ ] Persiapkan `ContactSection.tsx` dengan CSS Grid 11-slot.
3. [ ] Bungkus setiap slot dengan komponen `LiquidGlass.tsx`.
4. [ ] Konfigurasi GSAP Timeline untuk menyatukan: Pinning -> Scale/Drop Card -> Nav FLIP.
5. [ ] Implementasikan SVG Stroke di sekeliling container utama sebagai tahap akhir landing.
"""

with open('blueprint_redesign_full.md', 'w') as f:
    f.write(final_plan)
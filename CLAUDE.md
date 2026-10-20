# CLAUDE.md — Fox350 Accessories

Panduan kerja untuk Claude (dan siapa pun) yang mengubah repo ini. Baca sampai habis sebelum mulai kerja.

## 1. Tentang project

Rombak total website affiliate aksesori **Fox 350 (Polytron)**.

- Repo: `github.com/haervemania-ui/fox350-accessories` (**public**)
- Deploy: GitHub Pages dari branch `main`
- Link website dipasang di bio TikTok **@fox350id**, jadi mayoritas pengunjung datang dari HP

## 2. Aturan kerja

- **Bahasa**: Indonesia campur istilah teknis English (commit message, nama file, dan kode boleh English).
- **Plan before execute**: setiap perubahan besar (struktur, desain, fitur baru, hapus/rename banyak file) dibuat rencananya dulu, di-approve owner, baru dikerjakan.
- **Review before commit**: semua perubahan lewat branch + Pull Request. **Jangan pernah push langsung ke `main`.**

## 3. Privasi (wajib)

- Sumber konten: export chat grup WA **Fox350 riders**.
- **DILARANG** memasukkan nama, nomor HP, foto wajah, username, atau identitas member apa pun ke repo, termasuk di komentar kode, commit message, alt text, dan metadata gambar. Repo ini public.
- File export WA mentah tidak boleh di-commit. Simpan di luar repo atau di folder `_private/` (sudah diblokir `.gitignore`, begitu juga `WhatsApp Chat*` dan `*.zip`).
- Kutipan atau insight dari chat ditulis ulang dengan bahasa sendiri tanpa atribusi ke member. Contoh: "Komunitas banyak bahas…", bukan "Kata Pak X…".
- Screenshot chat tidak boleh dipakai sebagai gambar di website.

## 4. Aturan affiliate

- Semua link produk **wajib link affiliate Shopee** (`https://s.shopee.co.id/...`). Jangan diganti link produk biasa, link toko langsung, atau link tanpa kode affiliate.
- **Disclaimer affiliate wajib tampil** di website (minimal di footer setiap halaman dan di halaman katalog), misalnya: "Beberapa link di website ini adalah link affiliate. Kami bisa mendapat komisi tanpa biaya tambahan untukmu."
- Setiap produk punya `checked_at`, yaitu tanggal terakhir link dan harga dicek masih valid.

## 5. Struktur target

Data produk dipisah dari HTML, di `data/products.json`. Satu objek per produk:

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | string | slug unik, kebab-case, contoh `visor-windshield` |
| `name` | string | nama produk |
| `category` | string | slug kategori, contoh `kelistrikan` |
| `hook` | string | satu kalimat kenapa produk ini layak dibeli |
| `price_range` | string | contoh `"Rp150rb–250rb"`, boleh kosong |
| `tags` | string[] | label pendek, contoh `["Touring"]` |
| `top_pick` | boolean | tampil di bagian unggulan |
| `img` | string | nama file di `Img/` tanpa folder, contoh `visor.jpg` |
| `links` | `{label, url}[]` | `url` wajib link affiliate `s.shopee.co.id` |
| `checked_at` | string | tanggal ISO `YYYY-MM-DD` |

Contoh:

```json
{
  "id": "visor-windshield",
  "name": "Visor / Windshield",
  "category": "handlebar",
  "hook": "Angin ke badan jauh berkurang di kecepatan 60 km/jam ke atas.",
  "price_range": "",
  "tags": ["Touring", "Aerodinamis"],
  "top_pick": true,
  "img": "visor.jpg",
  "links": [{ "label": "Shopee", "url": "https://s.shopee.co.id/LieKMw2vT" }],
  "checked_at": "2026-10-20"
}
```

Halaman yang dituju:

- **Landing**: pengenalan singkat dan produk top pick
- **Katalog**: semua produk, filter kategori, dan pencarian
- **Tips**: tips dan insight komunitas (tanpa identitas member)

Prinsip: **mobile-first**, ringan, dan bisa jalan sebagai static site di GitHub Pages tanpa build step kecuali sudah disepakati.

## 6. Konvensi gambar

- Simpan di `Img/`.
- Nama file: **lowercase, kebab-case, satu ekstensi `.jpg`**. Contoh `lampu-ibright-l9.jpg`, bukan `Lampu_iBright L9.JPG` atau `.jpeg`.
- Hanya foto produk. Tanpa screenshot chat, tanpa wajah atau nama member.
- Hapus metadata EXIF (Artist, GPS, dll.) sebelum commit gambar baru.

## 7. Visual

- Identitas **BARU**, bukan tema dark/oranye yang lama.
- Sebelum membangun desain, usulkan **2–3 arah visual** (palet, tipografi, contoh tampilan) untuk dipilih owner.

## 8. Kondisi repo saat ini

> **Status sementara, update setelah PR rombak.**

- `index.html`: satu file berisi semua CSS, JS, dan data produk (hardcode di array JS). Tema dark/oranye lama, font Bebas Neue + DM Sans. Link produk sudah memakai `s.shopee.co.id`. Belum ada disclaimer affiliate.
- `README.md`: deskripsi singkat.
- `Img/`: 72 file gambar, tapi hanya 41 gambar unik. 31 file adalah duplikat `.jpg` / `.JPG` dengan isi identik. Ada juga `shock-xmax.jpeg` dan file kosong bernama `. gitkeep` (ada spasi). Pembersihan duplikat dan rename menunggu PR terpisah.
- Hasil cek gambar (20 Okt 2026): semua 41 gambar unik adalah foto produk atau screenshot listing toko. Tidak ada screenshot chat, nomor HP, atau wajah member. Temuan: 36 dari 41 gambar unik (67 file termasuk duplikat) punya metadata EXIF `Artist` berisi nama owner. Bukan identitas member, tapi sebaiknya di-strip saat pembersihan gambar.

## 9. Checklist sebelum buka PR

- [ ] Tampilan dicek di ukuran mobile (±375px) dan tidak ada horizontal scroll
- [ ] Semua link tidak rusak dan link produk tetap affiliate `s.shopee.co.id`
- [ ] Disclaimer affiliate masih tampil
- [ ] Tidak ada data pribadi member (nama, nomor HP, wajah, screenshot chat) di file, gambar, atau commit
- [ ] Nama gambar baru mengikuti konvensi
- [ ] CLAUDE.md di-update bila struktur, aturan, atau kondisi repo berubah

## 10. Pemeliharaan

CLAUDE.md adalah sumber aturan project. Update file ini setiap ada aturan baru dari owner atau perubahan struktur repo, di PR yang sama dengan perubahannya.

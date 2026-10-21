# CLAUDE.md — Fox350 Accessories

Panduan kerja untuk Claude (dan siapa pun) yang mengubah repo ini. Baca sampai habis sebelum mulai kerja.

## 1. Tentang project

Rombak total website affiliate aksesori **Fox 350 (Polytron)**.

- Repo: `github.com/haervemania-ui/fox350-accessories` (**public**)
- Deploy: GitHub Pages dari branch `main`
- Link website dipasang di bio TikTok **@fox350id**, jadi mayoritas pengunjung datang dari HP

## 2. Aturan kerja

- **Bahasa**: Indonesia campur istilah teknis English, termasuk CLAUDE.md ini (commit message, nama file, dan kode boleh English).
- **Plan before execute**: setiap perubahan besar (struktur, desain, fitur baru, hapus/rename banyak file) dibuat rencananya dulu, di-approve owner, baru dikerjakan.
- **Review before commit**: semua perubahan lewat branch + Pull Request. **Jangan pernah push langsung ke `main`.**
- **Merge**: kirim ringkasan singkat + link PR di thread, lalu merge hanya setelah owner membalas "merge" untuk PR itu.
- **Data terpisah dari tampilan**: data produk hanya di `data/products.json`. Update rutin (tambah produk, ganti harga, ganti link) cukup mengubah file ini, tanpa menyentuh HTML.

## 3. Privasi (wajib)

- Sumber konten: export chat grup WA **Fox350 riders**.
- **DILARANG** memasukkan nama, nomor HP, mention (`@...`), foto, username, atau identitas member apa pun ke repo, termasuk di komentar kode, commit message, alt text, dan metadata gambar. Repo ini public.
- File export WA mentah, kartu kontak `.vcf`, dan file bahan olahan (CSV/MD seperti `kandidat_produk*.csv`, `topik_tips*.md`, `HANDOFF*.md`) tidak boleh di-commit. Simpan di luar repo atau di folder `_private/` / `bahan/`. Semuanya sudah diblokir `.gitignore`; jangan dilonggarkan.
- Kutipan atau insight dari chat ditulis ulang dengan bahasa sendiri tanpa atribusi ke member. Contoh: "Komunitas banyak bahas…", bukan "Kata Pak X…".
- Screenshot chat tidak boleh dipakai sebagai gambar di website.

## 4. Aturan affiliate

- Semua link produk **wajib link affiliate Shopee milik owner sendiri** (`https://s.shopee.co.id/...`, dibuat owner lewat Shopee Affiliate). Jangan diganti link produk biasa, link toko langsung, atau link tanpa kode affiliate.
- **Link Shopee yang dibagikan di grup WA adalah milik member dan tidak boleh dipakai di website.** Kolom referensi di file bahan (mis. `contoh_link_referensi`) hanya untuk mencari produknya, tidak pernah masuk `products.json`. Kalau link affiliate owner belum ada, `links` dibiarkan `[]` ("Link menyusul").
- **Disclaimer affiliate wajib tampil di setiap halaman yang menampilkan produk** (landing, katalog, dan halaman/artikel lain yang memuat link produk), misalnya: "Beberapa link di website ini adalah link affiliate. Kami bisa mendapat komisi tanpa biaya tambahan untukmu."
- Field `checked_at` **wajib diisi** di setiap produk, yaitu tanggal terakhir link dan harga dicek masih valid.

## 5. Struktur target

Data produk dipisah dari HTML, di `data/products.json`. Satu objek per produk:

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | string | slug unik, kebab-case, contoh `visor-windshield` |
| `name` | string | nama produk |
| `category` | string | slug kategori, contoh `kelistrikan` |
| `hook` | string | satu kalimat pengalaman nyata rider, ditulis ulang (bukan kutipan member) |
| `price_range` | string | contoh `"Rp150rb–250rb"`, boleh kosong |
| `tags` | string[] | label pendek, contoh `["Touring"]` |
| `top_pick` | boolean | tampil di bagian unggulan |
| `img` | string | nama file di `assets/img/` tanpa folder, contoh `visor.jpg`. Kosong = kartu tampil tanpa foto |
| `links` | `{label, url}[]` | `url` wajib link affiliate `s.shopee.co.id`. Boleh kosong `[]`: tombol tampil "Link menyusul" |
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

Struktur file:

```
index.html          landing: hero + kotak search (ke produk.html?q=), grid kategori, top pick, teaser tips
produk.html         katalog: search + filter kategori (?kategori=<slug>&q=<kata kunci>)
tips/index.html     daftar artikel tips
tips/<id>.html      satu file per artikel; produk terkait dirender dari data-related="id1,id2"
data/products.json  data produk (skema di atas)
data/categories.json  8 kategori: slug, name, short (urutan = urutan tampil)
data/tips.json      daftar artikel: id, title, summary, category, status ("terbit" = link ke tips/<id>.html, "segera" = belum terbit)
assets/css/style.css  tema Volt
assets/js/app.js    render semua halaman dari data/*.json
assets/img/         foto produk
```

Semua halaman di-render dari JSON lewat `fetch`, jadi untuk cek lokal jalankan server (`python3 -m http.server`), bukan buka file langsung. Tanggal "Data produk terakhir dicek" di footer dihitung otomatis dari `checked_at` terbaru.

Slug kategori: `charging`, `suspensi`, `rem`, `body`, `jok`, `lampu`, `gadget`, `ban-tools`. Kategori tanpa produk tetap tampil dengan label "segera".

Prinsip: **mobile-first**, ringan, dan bisa jalan sebagai static site di GitHub Pages tanpa build step kecuali sudah disepakati.

## 6. Konvensi gambar

- Simpan di `assets/img/`.
- Nama file: **lowercase, kebab-case, satu ekstensi `.jpg`**. Contoh `lampu-ibright-l9.jpg`, bukan `Lampu_iBright L9.JPG` atau `.jpeg`. GitHub Pages case-sensitive, jadi `foto.JPG` dan `foto.jpg` dianggap file berbeda.
- Hanya foto produk. Tanpa screenshot chat, tanpa wajah atau nama member. Kalau ditemukan, catat sebagai temuan dan hapus.
- Hapus metadata EXIF (Artist, GPS, dll.) sebelum commit gambar baru.

## 7. Visual

- Identitas **BARU**, bukan tema dark/oranye yang lama.
- Sebelum membangun desain, usulkan **2–3 arah visual** (palet, tipografi, contoh tampilan) untuk dipilih owner.
- Arah terpilih (20 Okt 2026): **Volt**. Latar terang `#F3F4EF`, navy `#10213A`, aksen lime `#C8F03C`, heading Space Grotesk, body Inter. Token warna ada di `:root` `assets/css/style.css`.

## 8. Kondisi repo saat ini

> **Status sementara, update setiap ada perubahan besar.**

- Situs sudah memakai struktur di bagian 5 dan visual Volt.
- `data/products.json` berisi 58 produk (21 Okt 2026). Urutan array = urutan tampil di tiap kategori:
  - 41 produk pertama = top 50 yang paling sering dibahas di grup WA (duplikat digabung jadi link tambahan "Shopee 2", dst.), ditandai tag `Populer di grup` dan diurutkan dari yang paling sering dibahas. 22 di antaranya produk baru, belum punya foto (`img: ""`).
  - 17 produk sisanya = produk lama dari situs sebelumnya yang tidak masuk top 50, tetap ditampilkan atas keputusan owner.
  - Produk yang bukan untuk Fox 350 (misalnya casing kunci mobil) sengaja tidak dimasukkan.
- 21 Okt 2026: link produk dicek ulang. Polytron Fast Charging 25A sebelumnya memakai kode affiliate orang lain, sudah diganti ke link affiliate owner (produk yang sama). Minyak Rem Brembo DOT4 dan Adaptor Tekiro 3/8-1/2 juga sudah diganti. Semua link sekarang memakai kode affiliate owner.
- `assets/img/`: 41 foto unik, sudah lowercase `.jpg` dan tanpa EXIF. 4 file lama yang sebenarnya WEBP sudah dikonversi ke JPEG. Folder `Img/` lama dihapus.
- 5 artikel tips terbit (21 Okt 2026). Fakta teknis dicek ke sumber Polytron dan media otomotif (daftar sumber ada di tiap artikel). Hitungan perkiraan ditandai jelas, dan hal yang tidak ditemukan sumber resminya ditulis apa adanya. Kutipan member tidak dipakai.

## 9. Checklist sebelum buka PR

- [ ] Tampilan dicek di ukuran mobile (±375px) dan tidak ada horizontal scroll
- [ ] Semua link tidak rusak dan link produk tetap link affiliate `s.shopee.co.id` milik owner
- [ ] Disclaimer affiliate tampil di setiap halaman yang menampilkan produk
- [ ] Setiap produk punya `checked_at`
- [ ] Tidak ada data pribadi member (nama, nomor HP, mention, wajah, screenshot chat) maupun file bahan mentah di file, gambar, atau commit
- [ ] Nama gambar baru mengikuti konvensi
- [ ] CLAUDE.md di-update bila struktur, aturan, atau kondisi repo berubah

## 10. Pemeliharaan

CLAUDE.md adalah sumber aturan project. Update file ini setiap ada aturan baru dari owner atau perubahan struktur repo, di PR yang sama dengan perubahannya.

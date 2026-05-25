import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { createHash } from "crypto";
import * as schema from "../../lib/db/src/schema/index.js";

const { Pool } = pg;

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL tidak ditemukan. Pastikan .env sudah diisi.");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log("🌱 Mulai seeding database SMPN 1 Dumai...\n");

  // ── 1. PROFIL ──────────────────────────────────────────────
  await db.delete(schema.profilTable);
  await db.insert(schema.profilTable).values({
    nama_sekolah: "SMP Negeri 1 Dumai",
    npsn: "10401601",
    alamat: "Jl. Pattimura No. 1, Laksamana, Dumai Kota, Kota Dumai, Riau 28826",
    telepon: "(0765) 31234",
    email: "smpn1dumai@gmail.com",
    website: "https://smpn1dumai.sch.id",
    kepala_sekolah: "Drs. H. Ahmad Fauzi, M.Pd",
    sambutan_kepsek:
      "Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nSelamat datang di website resmi SMP Negeri 1 Dumai. Kami berkomitmen untuk memberikan pendidikan berkualitas yang membentuk generasi cerdas, berkarakter, dan berwawasan luas.\n\nBersama seluruh civitas akademika, kami terus berinovasi demi mewujudkan visi sekolah yang unggul dan berdaya saing tinggi di tingkat nasional maupun internasional.\n\nSemoga website ini dapat menjadi sarana informasi yang bermanfaat bagi seluruh warga sekolah dan masyarakat.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.",
    visi: "Terwujudnya peserta didik yang beriman, bertaqwa, berprestasi, berkarakter mulia, dan berwawasan lingkungan menuju sekolah unggulan di Kota Dumai.",
    misi: "1. Meningkatkan keimanan dan ketaqwaan kepada Tuhan Yang Maha Esa\n2. Melaksanakan pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan\n3. Mengembangkan potensi akademik dan non-akademik peserta didik secara optimal\n4. Membangun karakter peserta didik yang jujur, disiplin, dan bertanggung jawab\n5. Menciptakan lingkungan sekolah yang bersih, indah, dan kondusif\n6. Menjalin kerjasama yang harmonis antara sekolah, orang tua, dan masyarakat",
    sejarah:
      "SMP Negeri 1 Dumai berdiri sejak tahun 1964 dan merupakan salah satu sekolah menengah pertama tertua dan paling bergengsi di Kota Dumai, Provinsi Riau. Sejak awal berdirinya, sekolah ini telah menjadi pilihan utama masyarakat Dumai dalam memberikan pendidikan terbaik bagi putra-putri mereka.\n\nSelama lebih dari enam dekade, SMPN 1 Dumai telah melahirkan ribuan alumni berprestasi yang kini berkiprah di berbagai bidang, baik di tingkat lokal, nasional, maupun internasional. Dengan akreditasi A yang diraih secara konsisten, sekolah ini terus berkomitmen untuk meningkatkan kualitas pendidikan dan pelayanan kepada seluruh peserta didik.",
    akreditasi: "A",
    tahun_berdiri: "1964",
  });
  console.log("✅ Profil sekolah");

  // ── 2. STATISTIK ───────────────────────────────────────────
  await db.delete(schema.statistikTable);
  await db.insert(schema.statistikTable).values({
    total_siswa: 864,
    total_guru: 52,
    total_staff: 18,
    total_kelas: 27,
    total_pengunjung: 0,
    last_reset: new Date().toISOString().split("T")[0]!,
  });
  console.log("✅ Statistik");

  // ── 3. ADMIN ───────────────────────────────────────────────
  await db.delete(schema.adminTable);
  await db.insert(schema.adminTable).values({
    username: "admin",
    password_hash: createHash("sha256").update("admin123").digest("hex"),
    nama: "Administrator",
    role: "admin",
  });
  console.log("✅ Admin (username: admin / password: admin123)");

  // ── 4. SLIDER ──────────────────────────────────────────────
  await db.delete(schema.sliderTable);
  await db.insert(schema.sliderTable).values([
    {
      judul: "Selamat Datang di SMP Negeri 1 Dumai",
      subjudul: "Sekolah Unggulan Kota Dumai — Terakreditasi A. Membentuk generasi cerdas, berkarakter, dan berwawasan global.",
      gambar: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80",
      urutan: 1,
      is_active: true,
    },
    {
      judul: "Berprestasi di Tingkat Nasional & Internasional",
      subjudul: "Ratusan prestasi membanggakan dari peserta didik SMPN 1 Dumai di berbagai bidang akademik dan non-akademik.",
      gambar: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80",
      urutan: 2,
      is_active: true,
    },
    {
      judul: "Lingkungan Belajar yang Nyaman & Modern",
      subjudul: "Fasilitas lengkap, tenaga pendidik profesional, dan suasana belajar yang kondusif untuk tumbuh kembang optimal.",
      gambar: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80",
      urutan: 3,
      is_active: true,
    },
  ]);
  console.log("✅ Slider (3 slide)");

  // ── 5. PENGUMUMAN ──────────────────────────────────────────
  await db.delete(schema.pengumumanTable);
  await db.insert(schema.pengumumanTable).values([
    {
      judul: "Penerimaan Peserta Didik Baru (SPMB) Tahun Ajaran 2026/2027",
      konten: "Pendaftaran SPMB SMPN 1 Dumai Tahun Ajaran 2026/2027 telah dibuka. Kuota tersedia 288 siswa untuk 9 rombongan belajar. Daftarkan putra-putri terbaik Anda sekarang!",
      prioritas: 3,
      is_active: true,
    },
    {
      judul: "Jadwal Ujian Akhir Semester Genap 2025/2026",
      konten: "Ujian Akhir Semester Genap akan dilaksanakan pada tanggal 2–13 Juni 2026. Seluruh peserta didik diharapkan mempersiapkan diri dengan baik.",
      prioritas: 2,
      is_active: true,
    },
    {
      judul: "Libur Hari Raya Idul Adha 1447 H",
      konten: "Sekolah diliburkan pada tanggal 6–7 Juni 2026 dalam rangka peringatan Hari Raya Idul Adha 1447 H. Kegiatan belajar mengajar kembali normal pada 8 Juni 2026.",
      prioritas: 1,
      is_active: true,
    },
    {
      judul: "Rapat Orang Tua/Wali Murid Kelas IX",
      konten: "Rapat orang tua/wali murid kelas IX akan dilaksanakan pada Sabtu, 25 Mei 2026 pukul 08.00 WIB di Aula SMPN 1 Dumai. Kehadiran sangat diharapkan.",
      prioritas: 2,
      is_active: true,
    },
  ]);
  console.log("✅ Pengumuman (4 item)");

  // ── 6. BERITA ──────────────────────────────────────────────
  await db.delete(schema.beritaTable);
  await db.insert(schema.beritaTable).values([
    {
      judul: "SMPN 1 Dumai Raih Juara 1 Olimpiade Sains Nasional Tingkat Provinsi Riau",
      konten: "Kebanggaan kembali hadir untuk SMPN 1 Dumai. Tim olimpiade sains berhasil meraih Juara 1 pada ajang Olimpiade Sains Nasional (OSN) tingkat Provinsi Riau yang diselenggarakan di Pekanbaru.\n\nRizky Pratama (kelas VIII-A) meraih juara di bidang Matematika dan Siti Nurhaliza (kelas VIII-C) di bidang IPA.\n\nKepala Sekolah menyampaikan rasa bangga dan apresiasi kepada seluruh peserta didik dan pembimbing yang telah bekerja keras mempersiapkan diri.",
      gambar: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
      kategori: "Prestasi",
      penulis: "Tim Humas SMPN 1 Dumai",
      slug: "smpn1-juara-osn-provinsi-riau-2026",
      is_published: true,
    },
    {
      judul: "Peringatan Hari Pendidikan Nasional 2026 di SMPN 1 Dumai",
      konten: "SMPN 1 Dumai memperingati Hari Pendidikan Nasional (Hardiknas) 2026 dengan menggelar upacara bendera yang khidmat dan berbagai kegiatan edukatif. Tema Hardiknas tahun ini adalah 'Pendidikan Bermutu untuk Semua'.\n\nUpacara dipimpin langsung oleh Kepala Sekolah dan diikuti oleh seluruh guru, staf, dan peserta didik. Setelah upacara, dilanjutkan dengan pameran karya siswa, pertunjukan seni, dan lomba-lomba kreatif antar kelas.",
      gambar: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
      kategori: "Kegiatan",
      penulis: "Tim Humas SMPN 1 Dumai",
      slug: "hardiknas-2026-smpn1-dumai",
      is_published: true,
    },
    {
      judul: "Program Adiwiyata: SMPN 1 Dumai Menuju Sekolah Ramah Lingkungan",
      konten: "Dalam rangka mewujudkan sekolah yang peduli dan berbudaya lingkungan, SMPN 1 Dumai aktif menjalankan Program Adiwiyata. Berbagai kegiatan telah dilaksanakan, mulai dari penanaman pohon, pengelolaan sampah terpadu, hingga pembuatan taman sekolah yang asri.",
      gambar: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
      kategori: "Kegiatan",
      penulis: "Tim Humas SMPN 1 Dumai",
      slug: "program-adiwiyata-smpn1-dumai-2026",
      is_published: true,
    },
    {
      judul: "Kunjungan Studi ke Museum Sang Nila Utama Pekanbaru",
      konten: "Peserta didik kelas VII SMPN 1 Dumai melaksanakan kunjungan studi ke Museum Sang Nila Utama di Pekanbaru. Kegiatan ini bertujuan untuk memperkaya wawasan siswa tentang sejarah dan budaya Melayu Riau.",
      gambar: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800&q=80",
      kategori: "Kegiatan",
      penulis: "Tim Humas SMPN 1 Dumai",
      slug: "kunjungan-studi-museum-pekanbaru-2026",
      is_published: true,
    },
    {
      judul: "Sosialisasi Bahaya Narkoba Bersama BNN Kota Dumai",
      konten: "SMPN 1 Dumai bekerja sama dengan BNN Kota Dumai menggelar sosialisasi bahaya narkoba dan kenakalan remaja. Kegiatan ini diikuti oleh seluruh peserta didik kelas VIII dan IX.",
      gambar: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
      kategori: "Pengumuman",
      penulis: "Tim Humas SMPN 1 Dumai",
      slug: "sosialisasi-bahaya-narkoba-2026",
      is_published: true,
    },
  ]);
  console.log("✅ Berita (5 artikel)");

  // ── 7. PRESTASI ────────────────────────────────────────────
  await db.delete(schema.prestasiTable);
  await db.insert(schema.prestasiTable).values([
    { judul: "Juara 1 OSN Matematika Tingkat Provinsi Riau", deskripsi: "Rizky Pratama, siswa kelas VIII-A, meraih Juara 1 OSN Matematika tingkat Provinsi Riau.", tanggal: "2026-04-15", tingkat: "Provinsi", kategori: "Akademik" },
    { judul: "Juara 1 OSN IPA Tingkat Provinsi Riau", deskripsi: "Siti Nurhaliza, siswa kelas VIII-C, meraih Juara 1 OSN IPA tingkat Provinsi Riau.", tanggal: "2026-04-15", tingkat: "Provinsi", kategori: "Akademik" },
    { judul: "Juara 2 Lomba Debat Bahasa Indonesia Tingkat Nasional", deskripsi: "Tim debat SMPN 1 Dumai meraih Juara 2 pada Lomba Debat Bahasa Indonesia tingkat Nasional di Jakarta.", tanggal: "2026-03-20", tingkat: "Nasional", kategori: "Akademik" },
    { judul: "Medali Perak Olimpiade Bahasa Inggris Internasional", deskripsi: "Muhammad Farhan, siswa kelas IX-B, meraih Medali Perak pada International English Olympiad yang diikuti peserta dari 15 negara.", tanggal: "2025-09-12", tingkat: "Internasional", kategori: "Akademik" },
    { judul: "Juara 1 Turnamen Futsal Pelajar Kota Dumai", deskripsi: "Tim futsal SMPN 1 Dumai meraih Juara 1 pada Turnamen Futsal Pelajar se-Kota Dumai.", tanggal: "2026-02-10", tingkat: "Kota", kategori: "Olahraga" },
    { judul: "Juara 1 Lomba Tari Melayu Tingkat Kota Dumai", deskripsi: "Grup tari SMPN 1 Dumai meraih Juara 1 pada Lomba Tari Melayu tingkat Kota Dumai dalam rangka HUT Kota Dumai.", tanggal: "2026-04-23", tingkat: "Kota", kategori: "Seni" },
    { judul: "Juara 3 Lomba Karya Ilmiah Remaja Tingkat Nasional", deskripsi: "Karya ilmiah 'Pemanfaatan Limbah Kelapa Sawit sebagai Pupuk Organik' meraih Juara 3 pada LKIR tingkat Nasional.", tanggal: "2025-11-05", tingkat: "Nasional", kategori: "Akademik" },
    { judul: "Juara 1 Lomba Cerdas Cermat Tingkat Kota Dumai", deskripsi: "Tim cerdas cermat SMPN 1 Dumai meraih Juara 1 pada Lomba Cerdas Cermat Pelajar se-Kota Dumai.", tanggal: "2025-10-28", tingkat: "Kota", kategori: "Akademik" },
  ]);
  console.log("✅ Prestasi (8 item)");

  // ── 8. EKSKUL ──────────────────────────────────────────────
  await db.delete(schema.ekskulTable);
  await db.insert(schema.ekskulTable).values([
    { nama: "Pramuka", deskripsi: "Membentuk karakter, kemandirian, dan jiwa kepemimpinan melalui berbagai kegiatan outdoor dan indoor.", pembina: "Hendra Saputra, S.Pd", jadwal: "Jumat, 14.00–16.00 WIB", is_active: true, gambar: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
    { nama: "Futsal", deskripsi: "Melatih keterampilan bermain bola, kerjasama tim, dan sportivitas peserta didik.", pembina: "Rudi Hartono, S.Pd", jadwal: "Selasa & Kamis, 15.00–17.00 WIB", is_active: true, gambar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80" },
    { nama: "Seni Tari Melayu", deskripsi: "Melestarikan budaya Melayu melalui seni tari tradisional Riau yang kaya akan nilai budaya.", pembina: "Dewi Sartika, S.Sn", jadwal: "Rabu, 14.00–16.00 WIB", is_active: true, gambar: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80" },
    { nama: "Olimpiade Sains", deskripsi: "Persiapan intensif untuk OSN di bidang Matematika, IPA, IPS, dan Bahasa Indonesia.", pembina: "Sri Wahyuni, M.Pd", jadwal: "Senin & Rabu, 14.00–16.00 WIB", is_active: true, gambar: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80" },
    { nama: "Palang Merah Remaja (PMR)", deskripsi: "Melatih siswa dalam bidang kesehatan, pertolongan pertama, dan kemanusiaan.", pembina: "Fitri Handayani, S.Pd", jadwal: "Sabtu, 08.00–10.00 WIB", is_active: true, gambar: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80" },
    { nama: "Karya Ilmiah Remaja (KIR)", deskripsi: "Mengembangkan kemampuan berpikir ilmiah dan penelitian siswa melalui pembuatan karya ilmiah inovatif.", pembina: "Agus Salim, M.Pd", jadwal: "Kamis, 14.00–16.00 WIB", is_active: true, gambar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" },
    { nama: "Bola Voli", deskripsi: "Melatih teknik dasar, strategi permainan, dan kerjasama tim bola voli.", pembina: "Syahrul Ramadhan, S.Pd", jadwal: "Selasa & Jumat, 15.00–17.00 WIB", is_active: true, gambar: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80" },
    { nama: "English Club", deskripsi: "Meningkatkan kemampuan berbahasa Inggris melalui percakapan, debat, dan storytelling.", pembina: "Rahma Yunita, S.Pd", jadwal: "Rabu & Jumat, 14.00–15.30 WIB", is_active: true, gambar: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
  ]);
  console.log("✅ Ekskul (8 item)");

  // ── 9. GURU ────────────────────────────────────────────────
  await db.delete(schema.guruTable);
  await db.insert(schema.guruTable).values([
    { nama: "Drs. H. Ahmad Fauzi, M.Pd", nip: "196805121994031002", mata_pelajaran: "Matematika", jabatan: "Kepala Sekolah", is_active: true },
    { nama: "Hendra Saputra, S.Pd", nip: "197203151998021001", mata_pelajaran: "Pendidikan Jasmani", jabatan: "Wakil Kepala Sekolah", is_active: true },
    { nama: "Sri Wahyuni, M.Pd", nip: "197508202001122003", mata_pelajaran: "IPA", jabatan: "Guru", is_active: true },
    { nama: "Dewi Sartika, S.Sn", nip: "198001102005012004", mata_pelajaran: "Seni Budaya", jabatan: "Guru", is_active: true },
    { nama: "Agus Salim, M.Pd", nip: "197612052003121005", mata_pelajaran: "IPS", jabatan: "Guru", is_active: true },
    { nama: "Rahma Yunita, S.Pd", nip: "198503182008012006", mata_pelajaran: "Bahasa Inggris", jabatan: "Guru", is_active: true },
    { nama: "Rudi Hartono, S.Pd", nip: "197904252006041007", mata_pelajaran: "Pendidikan Jasmani", jabatan: "Guru", is_active: true },
    { nama: "Fitri Handayani, S.Pd", nip: "198207142007012008", mata_pelajaran: "Bahasa Indonesia", jabatan: "Guru", is_active: true },
    { nama: "Syahrul Ramadhan, S.Pd", nip: "198609202010011009", mata_pelajaran: "Matematika", jabatan: "Guru", is_active: true },
    { nama: "Nurul Hidayah, S.Pd.I", nip: "198811052011012010", mata_pelajaran: "Pendidikan Agama Islam", jabatan: "Guru", is_active: true },
    { nama: "Budi Santoso, S.Pd", nip: "197801152004011011", mata_pelajaran: "IPA", jabatan: "Guru", is_active: true },
    { nama: "Yuliana Putri, S.Pd", nip: "199002282014022012", mata_pelajaran: "Bahasa Indonesia", jabatan: "Guru", is_active: true },
    { nama: "Muhammad Iqbal, S.Pd", nip: "199105152016011013", mata_pelajaran: "IPS", jabatan: "Guru", is_active: true },
    { nama: "Lestari Wulandari, S.Pd", nip: "199308202017012014", mata_pelajaran: "Matematika", jabatan: "Guru", is_active: true },
  ]);
  console.log("✅ Guru (14 orang)");

  // ── 10. SPMB ───────────────────────────────────────────────
  await db.delete(schema.spmbTable);
  await db.insert(schema.spmbTable).values({
    judul: "Penerimaan Peserta Didik Baru (SPMB) Tahun Ajaran 2026/2027",
    konten: "SMP Negeri 1 Dumai membuka pendaftaran Penerimaan Peserta Didik Baru (SPMB) Tahun Ajaran 2026/2027. Pendaftaran dilakukan secara online melalui portal resmi SPMB Kota Dumai.\n\nSMPN 1 Dumai menyediakan 9 rombongan belajar dengan total kuota 288 peserta didik baru. Seleksi dilakukan berdasarkan zonasi, prestasi, afirmasi, dan perpindahan tugas orang tua sesuai ketentuan yang berlaku.",
    persyaratan: "1. Berusia maksimal 15 tahun pada tanggal 1 Juli 2026\n2. Memiliki ijazah atau Surat Keterangan Lulus (SKL) SD/MI/sederajat\n3. Memiliki Kartu Keluarga (KK) yang diterbitkan minimal 1 tahun sebelum pendaftaran\n4. Pas foto terbaru ukuran 3x4 (2 lembar)\n5. Fotokopi Akta Kelahiran\n6. Fotokopi Kartu Keluarga\n7. Fotokopi Ijazah/SKL yang telah dilegalisir\n8. Sertifikat prestasi (jika mendaftar jalur prestasi)",
    tanggal_buka: "2026-06-01",
    tanggal_tutup: "2026-06-30",
    kuota: 288,
    is_active: true,
    link_pendaftaran: "https://spmb.dumaikota.go.id",
  });
  console.log("✅ SPMB");

  await pool.end();
  console.log("\n🎉 Seeding selesai! Semua data dummy sudah masuk ke database.");
  console.log("   Login admin: username=admin / password=admin123");
}

seed().catch((err) => {
  console.error("\n❌ Error saat seeding:", err.message);
  process.exit(1);
});

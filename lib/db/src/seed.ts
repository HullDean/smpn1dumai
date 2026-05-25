import mysql from "mysql2/promise";
import { createHash } from "crypto";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Contoh: mysql://root:@localhost:3306/smpn1dumai");
}

const pool = mysql.createPool(process.env.DATABASE_URL);

async function q(sql: string, params: unknown[] = []) {
  const conn = await pool.getConnection();
  try {
    await conn.query(sql, params);
  } finally {
    conn.release();
  }
}

async function seed() {
  console.log("🌱 Mulai seeding database SMPN 1 Dumai...\n");

  // ── Buat tabel ────────────────────────────────────────────────────────────
  await q(`CREATE TABLE IF NOT EXISTS profil (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_sekolah VARCHAR(300) NOT NULL DEFAULT 'SMP Negeri 1 Dumai',
    npsn VARCHAR(20) NOT NULL DEFAULT '10401601',
    alamat VARCHAR(500) NOT NULL DEFAULT 'Jl. Pattimura No. 1, Dumai',
    telepon VARCHAR(50), email VARCHAR(200), website VARCHAR(300),
    kepala_sekolah VARCHAR(300) NOT NULL DEFAULT 'Kepala Sekolah',
    foto_kepsek TEXT, sambutan_kepsek TEXT,
    visi TEXT, misi TEXT,
    sejarah TEXT, akreditasi VARCHAR(10) DEFAULT 'A',
    tahun_berdiri VARCHAR(10) DEFAULT '1964', logo TEXT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await q(`CREATE TABLE IF NOT EXISTS statistik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_siswa INT NOT NULL DEFAULT 0, total_guru INT NOT NULL DEFAULT 0,
    total_staff INT NOT NULL DEFAULT 0, total_kelas INT NOT NULL DEFAULT 0,
    total_pengunjung INT NOT NULL DEFAULT 0,
    last_reset VARCHAR(20) NOT NULL DEFAULT ''
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await q(`CREATE TABLE IF NOT EXISTS pengunjung_harian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal VARCHAR(20) NOT NULL UNIQUE, jumlah INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await q(`CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    nama VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await q(`CREATE TABLE IF NOT EXISTS slider (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(300) NOT NULL, subjudul TEXT, gambar TEXT NOT NULL,
    urutan INT NOT NULL DEFAULT 0, is_active TINYINT(1) NOT NULL DEFAULT 1
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await q(`CREATE TABLE IF NOT EXISTS pengumuman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul TEXT NOT NULL, konten TEXT NOT NULL,
    prioritas INT NOT NULL DEFAULT 0, is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await q(`CREATE TABLE IF NOT EXISTS berita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul TEXT NOT NULL, konten TEXT NOT NULL, gambar TEXT,
    kategori VARCHAR(100) NOT NULL DEFAULT 'Berita',
    penulis VARCHAR(200) NOT NULL DEFAULT 'Admin',
    slug VARCHAR(300) NOT NULL UNIQUE,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    dilihat INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await q(`CREATE TABLE IF NOT EXISTS prestasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul TEXT NOT NULL, deskripsi TEXT, tanggal VARCHAR(20) NOT NULL,
    tingkat VARCHAR(50) NOT NULL DEFAULT 'Kota',
    kategori VARCHAR(100) NOT NULL DEFAULT 'Akademik',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await q(`CREATE TABLE IF NOT EXISTS ekskul (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(200) NOT NULL, deskripsi TEXT, gambar TEXT,
    pembina VARCHAR(200), jadwal VARCHAR(200),
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await q(`CREATE TABLE IF NOT EXISTS guru (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(300) NOT NULL, nip VARCHAR(50),
    mata_pelajaran VARCHAR(200) NOT NULL,
    jabatan VARCHAR(200) NOT NULL DEFAULT 'Guru',
    foto TEXT, bio TEXT, is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await q(`CREATE TABLE IF NOT EXISTS spmb (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(300) NOT NULL DEFAULT 'Penerimaan Peserta Didik Baru',
    konten TEXT NOT NULL,
    tanggal_buka VARCHAR(20), tanggal_tutup VARCHAR(20), kuota INT,
    persyaratan TEXT, link_pendaftaran TEXT,
    is_active TINYINT(1) NOT NULL DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await q(`CREATE TABLE IF NOT EXISTS galeri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(300) NOT NULL, gambar TEXT NOT NULL,
    kategori VARCHAR(100) NOT NULL DEFAULT 'Umum', deskripsi TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  console.log("✅ Semua tabel siap");

  // ── Hapus data lama ───────────────────────────────────────────────────────
  const conn = await pool.getConnection();
  try {
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    for (const t of ["galeri","spmb","guru","ekskul","prestasi","berita",
                     "pengumuman","slider","admin","statistik",
                     "pengunjung_harian","profil"]) {
      await conn.query(`TRUNCATE TABLE \`${t}\``);
    }
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
  } finally {
    conn.release();
  }

  // ── Profil ────────────────────────────────────────────────────────────────
  await q(
    `INSERT INTO profil (nama_sekolah,npsn,alamat,telepon,email,website,
      kepala_sekolah,sambutan_kepsek,visi,misi,sejarah,akreditasi,tahun_berdiri)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      "SMP Negeri 1 Dumai", "10401601",
      "Jl. Pattimura No. 1, Laksamana, Dumai Kota, Kota Dumai, Riau 28826",
      "(0765) 31234", "smpn1dumai@gmail.com", "https://smpn1dumai.sch.id",
      "Drs. H. Ahmad Fauzi, M.Pd",
      "Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nSelamat datang di website resmi SMP Negeri 1 Dumai. Kami berkomitmen untuk memberikan pendidikan berkualitas yang membentuk generasi cerdas, berkarakter, dan berwawasan luas.\n\nBersama seluruh civitas akademika, kami terus berinovasi demi mewujudkan visi sekolah yang unggul dan berdaya saing tinggi.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.",
      "Terwujudnya peserta didik yang beriman, bertaqwa, berprestasi, berkarakter mulia, dan berwawasan lingkungan menuju sekolah unggulan di Kota Dumai.",
      "1. Meningkatkan keimanan dan ketaqwaan kepada Tuhan Yang Maha Esa\n2. Melaksanakan pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan\n3. Mengembangkan potensi akademik dan non-akademik peserta didik secara optimal\n4. Membangun karakter peserta didik yang jujur, disiplin, dan bertanggung jawab\n5. Menciptakan lingkungan sekolah yang bersih, indah, dan kondusif\n6. Menjalin kerjasama yang harmonis antara sekolah, orang tua, dan masyarakat",
      "SMP Negeri 1 Dumai berdiri sejak tahun 1964 dan merupakan salah satu sekolah menengah pertama tertua dan paling bergengsi di Kota Dumai, Provinsi Riau.",
      "A", "1964",
    ]
  );
  console.log("✅ Profil sekolah");

  // ── Statistik ─────────────────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];
  await q(
    `INSERT INTO statistik (total_siswa,total_guru,total_staff,total_kelas,total_pengunjung,last_reset)
     VALUES (?,?,?,?,?,?)`,
    [864, 52, 18, 27, 0, today]
  );
  console.log("✅ Statistik");

  // ── Admin ─────────────────────────────────────────────────────────────────
  const hash = createHash("sha256").update("admin123smpn1dumai_salt").digest("hex");
  await q(
    `INSERT INTO admin (username,password_hash,nama,role) VALUES (?,?,?,?)`,
    ["admin", hash, "Administrator", "admin"]
  );
  console.log("✅ Admin (username: admin / password: admin123)");

  // ── Slider ────────────────────────────────────────────────────────────────
  await q(
    `INSERT INTO slider (judul,subjudul,gambar,urutan,is_active) VALUES
     (?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?)`,
    [
      "Selamat Datang di SMP Negeri 1 Dumai",
      "Sekolah Unggulan Kota Dumai — Terakreditasi A. Membentuk generasi cerdas, berkarakter, dan berwawasan global.",
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80", 1, 1,
      "Berprestasi di Tingkat Nasional & Internasional",
      "Ratusan prestasi membanggakan dari peserta didik SMPN 1 Dumai di berbagai bidang akademik dan non-akademik.",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80", 2, 1,
      "Lingkungan Belajar yang Nyaman & Modern",
      "Fasilitas lengkap, tenaga pendidik profesional, dan suasana belajar yang kondusif untuk tumbuh kembang optimal.",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80", 3, 1,
    ]
  );
  console.log("✅ Slider (3 slide)");

  // ── Pengumuman ────────────────────────────────────────────────────────────
  await q(
    `INSERT INTO pengumuman (judul,konten,prioritas,is_active) VALUES
     (?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?)`,
    [
      "Penerimaan Peserta Didik Baru (SPMB) Tahun Ajaran 2026/2027",
      "Pendaftaran SPMB SMPN 1 Dumai Tahun Ajaran 2026/2027 telah dibuka. Kuota tersedia 288 siswa untuk 9 rombongan belajar.", 3, 1,
      "Jadwal Ujian Akhir Semester Genap 2025/2026",
      "Ujian Akhir Semester Genap akan dilaksanakan pada tanggal 2-13 Juni 2026.", 2, 1,
      "Libur Hari Raya Idul Adha 1447 H",
      "Sekolah diliburkan pada tanggal 6-7 Juni 2026. KBM kembali normal 8 Juni 2026.", 1, 1,
      "Rapat Orang Tua/Wali Murid Kelas IX",
      "Rapat akan dilaksanakan pada Sabtu, 25 Mei 2026 pukul 08.00 WIB di Aula SMPN 1 Dumai.", 2, 1,
    ]
  );
  console.log("✅ Pengumuman (4 item)");

  // ── Berita ────────────────────────────────────────────────────────────────
  await q(
    `INSERT INTO berita (judul,konten,gambar,kategori,penulis,slug,is_published) VALUES
     (?,?,?,?,?,?,?),(?,?,?,?,?,?,?),(?,?,?,?,?,?,?),(?,?,?,?,?,?,?),(?,?,?,?,?,?,?)`,
    [
      "SMPN 1 Dumai Raih Juara 1 OSN Tingkat Provinsi Riau",
      "Tim olimpiade sains berhasil meraih Juara 1 pada ajang OSN tingkat Provinsi Riau di Pekanbaru.",
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
      "Prestasi","Tim Humas SMPN 1 Dumai","smpn1-juara-osn-provinsi-riau-2026",1,

      "Peringatan Hari Pendidikan Nasional 2026 di SMPN 1 Dumai",
      "SMPN 1 Dumai memperingati Hardiknas 2026 dengan upacara bendera yang khidmat dan berbagai kegiatan edukatif.",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
      "Kegiatan","Tim Humas SMPN 1 Dumai","hardiknas-2026-smpn1-dumai",1,

      "Program Adiwiyata: SMPN 1 Dumai Menuju Sekolah Ramah Lingkungan",
      "SMPN 1 Dumai aktif menjalankan Program Adiwiyata dengan penanaman pohon dan pengelolaan sampah terpadu.",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
      "Kegiatan","Tim Humas SMPN 1 Dumai","program-adiwiyata-smpn1-dumai-2026",1,

      "Kunjungan Studi ke Museum Sang Nila Utama Pekanbaru",
      "Peserta didik kelas VII melaksanakan kunjungan studi ke Museum Sang Nila Utama di Pekanbaru.",
      "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800&q=80",
      "Kegiatan","Tim Humas SMPN 1 Dumai","kunjungan-studi-museum-pekanbaru-2026",1,

      "Sosialisasi Bahaya Narkoba Bersama BNN Kota Dumai",
      "SMPN 1 Dumai bekerja sama dengan BNN Kota Dumai menggelar sosialisasi bahaya narkoba.",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
      "Pengumuman","Tim Humas SMPN 1 Dumai","sosialisasi-bahaya-narkoba-2026",1,
    ]
  );
  console.log("✅ Berita (5 artikel)");

  // ── Prestasi ──────────────────────────────────────────────────────────────
  await q(
    `INSERT INTO prestasi (judul,deskripsi,tanggal,tingkat,kategori) VALUES
     (?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),
     (?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?)`,
    [
      "Juara 1 OSN Matematika Tingkat Provinsi Riau","Rizky Pratama, siswa kelas VIII-A, meraih Juara 1 OSN Matematika tingkat Provinsi Riau.","2026-04-15","Provinsi","Akademik",
      "Juara 1 OSN IPA Tingkat Provinsi Riau","Siti Nurhaliza, siswa kelas VIII-C, meraih Juara 1 OSN IPA tingkat Provinsi Riau.","2026-04-15","Provinsi","Akademik",
      "Juara 2 Lomba Debat Bahasa Indonesia Tingkat Nasional","Tim debat SMPN 1 Dumai meraih Juara 2 pada Lomba Debat Bahasa Indonesia tingkat Nasional.","2026-03-20","Nasional","Akademik",
      "Medali Perak Olimpiade Bahasa Inggris Internasional","Muhammad Farhan meraih Medali Perak pada International English Olympiad.","2025-09-12","Internasional","Akademik",
      "Juara 1 Turnamen Futsal Pelajar Kota Dumai","Tim futsal SMPN 1 Dumai meraih Juara 1 pada Turnamen Futsal Pelajar se-Kota Dumai.","2026-02-10","Kota","Olahraga",
      "Juara 1 Lomba Tari Melayu Tingkat Kota Dumai","Grup tari SMPN 1 Dumai meraih Juara 1 pada Lomba Tari Melayu tingkat Kota Dumai.","2026-04-23","Kota","Seni",
      "Juara 3 Lomba Karya Ilmiah Remaja Tingkat Nasional","Karya ilmiah tentang pemanfaatan limbah kelapa sawit meraih Juara 3 pada LKIR Nasional.","2025-11-05","Nasional","Akademik",
      "Juara 1 Lomba Cerdas Cermat Tingkat Kota Dumai","Tim cerdas cermat SMPN 1 Dumai meraih Juara 1 pada Lomba Cerdas Cermat Pelajar se-Kota Dumai.","2025-10-28","Kota","Akademik",
    ]
  );
  console.log("✅ Prestasi (8 item)");

  // ── Ekskul ────────────────────────────────────────────────────────────────
  await q(
    `INSERT INTO ekskul (nama,deskripsi,pembina,jadwal,is_active,gambar) VALUES
     (?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),
     (?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?)`,
    [
      "Pramuka","Membentuk karakter, kemandirian, dan jiwa kepemimpinan.","Hendra Saputra, S.Pd","Jumat, 14.00-16.00 WIB",1,"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      "Futsal","Melatih keterampilan bermain bola dan kerjasama tim.","Rudi Hartono, S.Pd","Selasa & Kamis, 15.00-17.00 WIB",1,"https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
      "Seni Tari Melayu","Melestarikan budaya Melayu melalui seni tari tradisional Riau.","Dewi Sartika, S.Sn","Rabu, 14.00-16.00 WIB",1,"https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80",
      "Olimpiade Sains","Persiapan intensif untuk OSN di bidang Matematika, IPA, IPS.","Sri Wahyuni, M.Pd","Senin & Rabu, 14.00-16.00 WIB",1,"https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
      "Palang Merah Remaja (PMR)","Melatih siswa dalam bidang kesehatan dan pertolongan pertama.","Fitri Handayani, S.Pd","Sabtu, 08.00-10.00 WIB",1,"https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80",
      "Karya Ilmiah Remaja (KIR)","Mengembangkan kemampuan berpikir ilmiah dan penelitian siswa.","Agus Salim, M.Pd","Kamis, 14.00-16.00 WIB",1,"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
      "Bola Voli","Melatih teknik dasar dan strategi permainan bola voli.","Syahrul Ramadhan, S.Pd","Selasa & Jumat, 15.00-17.00 WIB",1,"https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80",
      "English Club","Meningkatkan kemampuan berbahasa Inggris melalui percakapan dan debat.","Rahma Yunita, S.Pd","Rabu & Jumat, 14.00-15.30 WIB",1,"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    ]
  );
  console.log("✅ Ekskul (8 item)");

  // ── Guru ──────────────────────────────────────────────────────────────────
  await q(
    `INSERT INTO guru (nama,nip,mata_pelajaran,jabatan,is_active) VALUES
     (?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),
     (?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?)`,
    [
      "Drs. H. Ahmad Fauzi, M.Pd","196805121994031002","Matematika","Kepala Sekolah",1,
      "Hendra Saputra, S.Pd","197203151998021001","Pendidikan Jasmani","Wakil Kepala Sekolah",1,
      "Sri Wahyuni, M.Pd","197508202001122003","IPA","Guru",1,
      "Dewi Sartika, S.Sn","198001102005012004","Seni Budaya","Guru",1,
      "Agus Salim, M.Pd","197612052003121005","IPS","Guru",1,
      "Rahma Yunita, S.Pd","198503182008012006","Bahasa Inggris","Guru",1,
      "Rudi Hartono, S.Pd","197904252006041007","Pendidikan Jasmani","Guru",1,
      "Fitri Handayani, S.Pd","198207142007012008","Bahasa Indonesia","Guru",1,
      "Syahrul Ramadhan, S.Pd","198609202010011009","Matematika","Guru",1,
      "Nurul Hidayah, S.Pd.I","198811052011012010","Pendidikan Agama Islam","Guru",1,
      "Budi Santoso, S.Pd","197801152004011011","IPA","Guru",1,
      "Yuliana Putri, S.Pd","199002282014022012","Bahasa Indonesia","Guru",1,
      "Muhammad Iqbal, S.Pd","199105152016011013","IPS","Guru",1,
      "Lestari Wulandari, S.Pd","199308202017012014","Matematika","Guru",1,
    ]
  );
  console.log("✅ Guru (14 orang)");

  // ── SPMB ──────────────────────────────────────────────────────────────────
  await q(
    `INSERT INTO spmb (judul,konten,persyaratan,tanggal_buka,tanggal_tutup,kuota,is_active,link_pendaftaran)
     VALUES (?,?,?,?,?,?,?,?)`,
    [
      "Penerimaan Peserta Didik Baru (SPMB) Tahun Ajaran 2026/2027",
      "SMP Negeri 1 Dumai membuka pendaftaran SPMB Tahun Ajaran 2026/2027. Tersedia 9 rombongan belajar dengan total kuota 288 peserta didik baru.",
      "1. Berusia maksimal 15 tahun pada tanggal 1 Juli 2026\n2. Memiliki ijazah atau SKL SD/MI/sederajat\n3. Memiliki Kartu Keluarga (KK)\n4. Pas foto terbaru ukuran 3x4 (2 lembar)\n5. Fotokopi Akta Kelahiran\n6. Fotokopi Kartu Keluarga\n7. Fotokopi Ijazah/SKL yang telah dilegalisir",
      "2026-06-01","2026-06-30",288,1,"https://spmb.dumaikota.go.id",
    ]
  );
  console.log("✅ SPMB");

  // ── Galeri ────────────────────────────────────────────────────────────────
  await q(
    `INSERT INTO galeri (judul,gambar,kategori) VALUES
     (?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?)`,
    [
      "Upacara Bendera Hari Senin","https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80","Kegiatan",
      "Kegiatan Pramuka","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80","Pramuka",
      "Lomba Olahraga Antar Kelas","https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80","Olahraga",
      "Pentas Seni Tari Melayu","https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80","Kegiatan",
      "Laboratorium IPA","https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80","Fasilitas",
      "Perpustakaan Sekolah","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80","Fasilitas",
      "Kegiatan PMR","https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80","Kegiatan",
      "Lapangan Olahraga","https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80","Fasilitas",
    ]
  );
  console.log("✅ Galeri (8 foto)");

  await pool.end();
  console.log("\n🎉 Seeding selesai!");
  console.log("   Login admin: username=admin / password=admin123");
}

seed().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});

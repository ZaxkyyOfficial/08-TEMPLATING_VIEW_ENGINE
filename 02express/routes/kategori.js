var express = require("express");
const model_kategori = require("../model/model_kategori");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    // Memanggil getAll() - sudah sesuai
    let rows = await model_kategori.getAll();

    let formattedData = rows.map(function (row) {
      return {
        no: row.id_kategori,
        nama: row.nama_kategori,
        deskripsi: row.deskripsi,
      };
    });

    const perPage = 10;
    const currentPage = parseInt(req.query.page) || 1;
    const totalPages = Math.ceil(formattedData.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const paginatedData = formattedData.slice(startIndex, startIndex + perPage);

    res.render("kategori", {
      title: "Kategori",
      kategori: paginatedData,
      allKategori: formattedData,
      currentPage: currentPage,
      totalPages: totalPages,
      totalData: formattedData.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan pada database");
  }
});

// Langkah 1 - CREATE
router.get("/create", async function (req, res, next) {
  try {
    // Jika di model tidak ada method create(), Anda bisa langsung render object kosong
    res.render("kategori/create", { nama_kategori: "", deskripsi: "" });
  } catch (err) {
    console.error(err);
    res.redirect("/kategori");
  }
});

// Langkah 2 - STORE (Disesuaikan ke Store dengan S besar)
router.post("/store", async function (req, res, next) {
  try {
    let { nama_kategori, deskripsi } = req.body;
    let Data = { nama_kategori, deskripsi };

    // Menggunakan Store (S besar) sesuai gambar model sebelumnya
    await model_kategori.Store(Data); 
    req.flash("success", "Berhasil menyimpan data!");
    res.redirect("/kategori");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal menyimpan data!");
    res.redirect("/kategori");
  }
});

// EDIT (Disesuaikan ke getId)
router.get("/edit/:no", async function (req, res, next) {
  try {
    let no = req.params.no;
    // Menggunakan getId sesuai gambar model sebelumnya
    let rows = await model_kategori.getId(no); 
    
    if (rows.length <= 0) {
      req.flash("error", "Data Kategori tidak ditemukan");
      return res.redirect("/kategori");
    }
    res.render("kategori/edit", {
      id_kategori: rows[0].id_kategori,
      nama_kategori: rows[0].nama_kategori,
      deskripsi: rows[0].deskripsi,
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Terjadi kesalahan saat mengambil data");
    res.redirect("/kategori");
  }
});

// UPDATE (Disesuaikan ke Update dengan U besar)
router.post("/update/:no", async function (req, res, next) {
  try {
    let id = req.params.no;
    let { nama_kategori, deskripsi } = req.body;
    let Data = { nama_kategori, deskripsi };

    // Menggunakan Update (U besar)
    await model_kategori.Update(id, Data); 
    req.flash("success", "Berhasil mengupdate data kategori!");
    res.redirect("/kategori");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal mengupdate data!");
    res.redirect("/kategori");
  }
});

// DELETE (Menampilkan konfirmasi)
router.get("/delete/:no", async function (req, res, next) {
  try {
    let no = req.params.no;
    // Menggunakan getId
    let rows = await model_kategori.getId(no); 
    if (rows.length <= 0) {
      req.flash("error", "Data Kategori tidak ditemukan");
      return res.redirect("/kategori");
    }
    res.render("kategori/delete", {
      id_kategori: rows[0].id_kategori,
      nama_kategori: rows[0].nama_kategori,
      deskripsi: rows[0].deskripsi,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/kategori");
  }
});

// DESTROY (Disesuaikan ke Delete dengan D besar)
router.post("/destroy/:no", async function (req, res, next) {
  try {
    let id = req.params.no;
    // Menggunakan Delete (D besar) sesuai penyesuaian model terakhir
    await model_kategori.Delete(id); 
    req.flash("success", "Berhasil menghapus data kategori!");
    res.redirect("/kategori");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal menghapus data!");
    res.redirect("/kategori");
  }
});

module.exports = router;
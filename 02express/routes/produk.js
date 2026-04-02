var express = require("express");
const model_produk = require("../model/model_produk");
const model_kategori = require("../model/model_kategori");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
var router = express.Router();

// konfigurasi multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, basename.replace(/\s+/g, "-").toLowerCase() + "-" + Date.now() + ext);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowed = [".png", ".jpg", ".jpeg", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Hanya file gambar (.png .jpg .jpeg .gif) yang diperbolehkan"));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.get("/", async function (req, res, next) {
  try {
    let rows = await model_produk.getAll();

    let formattedData = rows.map(function (row) {
      return {
        no: row.id_produk,
        nama: row.nama_produk,
        harga: row.harga,
        kategori: row.nama_kategori || "-",
        foto: row.foto ? "/images/uploads/" + row.foto : null,
      };
    });

    const perPage = 10;
    const currentPage = parseInt(req.query.page) || 1;
    const totalPages = Math.ceil(formattedData.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const paginatedData = formattedData.slice(startIndex, startIndex + perPage);

    res.render("produk/index", {
      title: "Produk",
      produk: paginatedData,
      allProduk: formattedData,
      currentPage: currentPage,
      totalPages: totalPages,
      totalData: formattedData.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan pada database");
  }
});

router.get("/create", async function (req, res, next) {
  try {
    let categories = await model_kategori.getAll();
    res.render("produk/create", {
      nama_produk: "",
      harga: "",
      id_kategori: "",
      categories,
      foto: "",
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Terjadi kesalahan");
    res.redirect("/produk");
  }
});

router.post("/store", upload.single("foto"), async function (req, res, next) {
  try {
    let { nama_produk, harga, id_kategori } = req.body;
    let Data = { nama_produk, harga, id_kategori };
    if (req.file) {
      Data.foto = req.file.filename;
    }
    await model_produk.Store(Data);
    req.flash("success", "Berhasil menyimpan data!");
    res.redirect("/produk");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal menyimpan data!");
    res.redirect("/produk");
  }
});

router.get("/edit/:no", async function (req, res, next) {
  try {
    let no = req.params.no;
    let rows = await model_produk.getId(no);

    if (rows.length <= 0) {
      req.flash("error", "Data Produk tidak ditemukan");
      return res.redirect("/produk");
    }

    let categories = await model_kategori.getAll();
    res.render("produk/edit", {
      id_produk: rows[0].id_produk,
      nama_produk: rows[0].nama_produk,
      harga: rows[0].harga,
      id_kategori: rows[0].id_kategori,
      categories,
      foto: rows[0].foto ? "/images/uploads/" + rows[0].foto : null,
      foto_filename: rows[0].foto || "",
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Terjadi kesalahan saat mengambil data");
    res.redirect("/produk");
  }
});

router.post("/update/:no", upload.single("foto"), async function (req, res, next) {
  try {
    let id = req.params.no;
    let { nama_produk, harga, id_kategori } = req.body;
    let Data = { nama_produk, harga, id_kategori };

    let productRows = await model_produk.getId(id);
    if (productRows.length <= 0) {
      req.flash("error", "Data Produk tidak ditemukan");
      return res.redirect("/produk");
    }

    if (req.file) {
      if (productRows[0].foto) {
        let existingPath = path.join(__dirname, "../public/images/uploads", productRows[0].foto);
        if (fs.existsSync(existingPath)) {
          fs.unlinkSync(existingPath);
        }
      }
      Data.foto = req.file.filename;
    }

    await model_produk.Update(id, Data);
    req.flash("success", "Berhasil mengupdate data produk!");
    res.redirect("/produk");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal mengupdate data!");
    res.redirect("/produk");
  }
});

router.get("/delete/:no", async function (req, res, next) {
  try {
    let no = req.params.no;
    let rows = await model_produk.getId(no);
    if (rows.length <= 0) {
      req.flash("error", "Data Produk tidak ditemukan");
      return res.redirect("/produk");
    }
    res.render("produk/delete", {
      id_produk: rows[0].id_produk,
      nama_produk: rows[0].nama_produk,
      harga: rows[0].harga,
      id_kategori: rows[0].id_kategori,
      foto: rows[0].foto ? "/images/uploads/" + rows[0].foto : null,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/produk");
  }
});

router.post("/destroy/:no", async function (req, res, next) {
  try {
    let id = req.params.no;
    let rows = await model_produk.getId(id);
    if (rows.length > 0 && rows[0].foto) {
      let imagePath = path.join(__dirname, "../public/images/uploads", rows[0].foto);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await model_produk.Delete(id);
    req.flash("success", "Berhasil menghapus data produk!");
    res.redirect("/produk");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal menghapus data!");
    res.redirect("/produk");
  }
});

module.exports = router;

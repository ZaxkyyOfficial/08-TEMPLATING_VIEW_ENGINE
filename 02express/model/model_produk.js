const connection = require("../config/database");

class model_produk {
    static async getAll() {
        return new Promise((resolve, reject) => {
        // join dengan kategori untuk mendapatkan nama kategori
        let sql = `SELECT p.*, k.nama_kategori FROM produk p LEFT JOIN kategori k ON p.id_kategori = k.id_kategori ORDER BY p.id_produk ASC`;
        connection.query(sql, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
        });
    }

    static async Store(data) {
        return new Promise((resolve, reject) => {
        connection.query("INSERT INTO produk SET ?", data, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM produk WHERE id_produk=" + id,
            (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
            },
        );
        });
    }

    static async Update(id, data) {
        return new Promise((resolve, reject) => {
        connection.query(
            "UPDATE produk SET ? WHERE id_produk=" + id,
            data,
            (err, result) => {
            if (err) reject(err);
            else resolve(result);
            },
        );
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
        connection.query(
            "DELETE FROM produk WHERE id_produk=" + id,
            (err, result) => {
            if (err) reject(err);
            else resolve(result);
            },
        );
        });
    }
}

module.exports = model_produk;

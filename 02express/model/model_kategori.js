const connection = require("../config/database");

class model_kategori {
    static async getAll() {
        return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM kategori ORDER BY id_kategori ASC", (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
        });
    }

    static async Store(data) {
        return new Promise((resolve, reject) => {
        connection.query("INSERT INTO kategori SET ?", data, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM kategori WHERE id_kategori=" + id, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
        });
    }

    static async Update(id, data) {
        return new Promise((resolve, reject) => {
        connection.query("UPDATE kategori SET ? WHERE id_kategori=" + id, data, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
        connection.query("DELETE FROM kategori WHERE id_kategori=" + id, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
        });
    }
}

module.exports = model_kategori;
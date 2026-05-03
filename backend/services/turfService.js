const db = require('../database');

class TurfService {
    static async getTurfDetails() {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM turf_details LIMIT 1`, (err, row) => {
                if (err) return reject(err);
                if (row && row.facilities) {
                    try {
                        row.facilities = JSON.parse(row.facilities);
                    } catch (e) {
                        row.facilities = [];
                    }
                }
                resolve(row);
            });
        });
    }

    static async updateTurfDetails(details) {
        const { name, location, day_price, evening_price, friday_price, discount_percentage, facilities } = details;
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE turf_details SET name = ?, location = ?, day_price = ?, evening_price = ?, friday_price = ?, discount_percentage = ?, facilities = ? WHERE id = 1`,
                [name, location, day_price, evening_price, friday_price, discount_percentage, JSON.stringify(facilities)],
                function(err) {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });
    }
}

module.exports = TurfService;

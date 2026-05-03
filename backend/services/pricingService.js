const db = require('../database');

class PricingService {
    static async getTurfConfig() {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM turf_details LIMIT 1`, (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    static async calculatePrice(date, slot, duration) {
        const turf = await this.getTurfConfig();
        if (!turf) return 2000; // Fallback

        const d = new Date(date);
        const day = d.getDay();
        let basePrice = turf.day_price;

        if (day === 5) {
            basePrice = turf.friday_price; // Friday
        } else {
            const isPM = slot.includes('PM') && !slot.startsWith('12PM');
            let hour = parseInt(slot);
            if (isPM) hour += 12;
            if (hour >= 17) basePrice = turf.evening_price; // Evening
        }

        let finalPrice = duration === '3 hours' ? basePrice * 2 : basePrice;
        if (turf.discount_percentage > 0) {
            finalPrice = finalPrice - (finalPrice * (turf.discount_percentage / 100));
        }
        return finalPrice;
    }
}

module.exports = PricingService;

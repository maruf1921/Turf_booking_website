const TurfService = require('../services/turfService');
const ApiError = require('../utils/ApiError');

class TurfController {
    static async getTurf(req, res) {
        const turf = await TurfService.getTurfDetails();
        if (!turf) throw new ApiError(404, 'Turf not found');
        res.json(turf);
    }

    static async updateTurf(req, res) {
        await TurfService.updateTurfDetails(req.body);
        res.json({ message: 'Turf details updated' });
    }
}

module.exports = TurfController;

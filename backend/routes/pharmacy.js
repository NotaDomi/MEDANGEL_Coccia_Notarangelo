const express = require('express');
const pharmacyController = require('../controllers/pharmacy');

const router = express.Router();

router.get('/findNearbyPharmacies', pharmacyController.findNearbyPharmacies);

module.exports = router;
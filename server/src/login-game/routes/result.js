/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const DriverController = require('../controller/userController');
const driverController = new DriverController();

/**
 * Driver Entity routes
 */

router.get('/', function (req, res) {
    driverController.findAll(req, res);
});

router.post('/create', function (req, res) {
    /**
     * Check if the value exist
     * Yes: the current value will be updated
     * No : the new value will be created
     */
    driverController.exists(req,res);
});


module.exports = router;

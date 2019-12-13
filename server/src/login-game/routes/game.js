const express = require("express");

const DriverController = require('../controller/userController');
const driverController = new DriverController();

const router = express.Router();
var path = require('path');

// Display the dashboard page
router.get("/", (req, res) => {
	res.sendFile(path.join(__dirname+ '/../dist/games.html'));
});
router.post('/p', function (req, res) {
	//driverController.existUpdatePipes(req, res);
	res.json({"status": "true"})
});
router.post('/r', function (req, res) {
	driverController.existAndUpdateResult(req, res);
});
router.post('/rr', function (req, res) {
	driverController.existAndUpdateResultCol(req, res);
});
router.post('/s', function (req, res) {
	var date = new Date();
	var current_hour = date.getHours();
	var current_minutes = date.getMinutes();
	var current_seconds = date.getSeconds();
	var current_data = date.getDate();
	if(current_data == 5 && current_hour >= 15 && current_minutes >= 0 && current_seconds >= 0) {
		res.json({"status": "true"});
	} else if(current_data > 5) {
		res.json({"status": "true"});
	} else { 
		driverController.existAndUpdateMainResult(req, res);
	}
});
router.post('/n', function (req, res) {
	driverController.exists(req, res);
});
router.post('/d', function (req, res) {
	//var dis = req.body.dis;
    ///console.log(dis);
    if (req.body.bx + 48 >= req.body.x2 
    	&& req.body.bx <= req.body.x2 + 52 
     	&& req.body.by <= req.body.y2) {
     	//driverController.existUpdateCollision(req, res);
    } else if (req.body.bx + 48 >= req.body.x1 
    	&& req.body.bx <= req.body.x1 + 52 
     	&& req.body.by + 48 >= req.body.y1) {
     	//driverController.existUpdateCollision(req, res);
    } else if (req.body.by + 48 >= 554) {
     	//driverController.existUpdateCollision(req, res);
    } else {
     	//driverController.existUpdateCollision(req, res);
 	}
 	res.json({"status": "true"})
});
//
//
module.exports = router;

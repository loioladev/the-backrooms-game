const express = require("express");
const cors = require("cors"); 
const rankingController = require("../controller/ranking");

const router = express.Router();
router.use(cors());
router.get("/api/speedrun/", rankingController.getSpeedruns);
router.get("/api/speedrun/:map", rankingController.getSpeedrunsByMap);
router.get("/api/speedrun/player/:player", rankingController.getPlayerById)
router.post("/api/speedrun/", rankingController.postSpeedrun);

module.exports = router;

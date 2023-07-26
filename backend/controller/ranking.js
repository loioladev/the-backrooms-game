const Speedrun = require("../model/speedrun");

const url = '*'

exports.getSpeedruns = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', url);
  Speedrun.find()
    .then((speedruns) => {
      res.send(speedruns);
    });
};

exports.getSpeedrunsByMap = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin',url);
  Speedrun.find({ map: req.params.map })
    .then((speedruns) => {
      res.send(speedruns);
    });
};

exports.postSpeedrun = (req, res) => {
  const speedrun = new Speedrun(req.body);
  res.setHeader('Access-Control-Allow-Origin',url);
  speedrun
    .save()
    .then((response) => {
      console.log(response);
      res.redirect("/api/speedrun");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPlayerById = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin',url);
  Speedrun.find({ player: req.params.player}).then((player) => {
    res.send(player);
  });
}
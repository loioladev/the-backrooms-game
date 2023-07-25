const Speedrun = require("../model/speedrun");

exports.getSpeedruns = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://backroomsgame.matheusloiola1.repl.co');
  Speedrun.find()
    .then((speedruns) => {
      res.send(speedruns);
    });
};

exports.getSpeedrunsByMap = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://backroomsgame.matheusloiola1.repl.co');
  Speedrun.find({ map: req.params.map })
    .then((speedruns) => {
      res.send(speedruns);
    });
};

exports.postSpeedrun = (req, res) => {
  const speedrun = new Speedrun(req.body);
  speedrun
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

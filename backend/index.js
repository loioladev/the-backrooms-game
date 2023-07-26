const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const rankingRoute = require("./routes/ranking");
const cors = require('cors');

const PORT = 3000;
const URI = process.env['MONGODB']


const app = express();
app.use(bodyParser.json());
app.use(rankingRoute);
//app.use(cors({
//  origin: 'https://backroomsgame.matheusloiola1.repl.co',
//  credentials: true
//}));

mongoose
  .connect(URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}.`);
    });
  })
  .catch((err) => console.log(err));

const express = require("express");
const app = express();
const compression = require('compression')
const path = require("path");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 2000;
const mongoose = require("mongoose");
const keys = require("./config/keys");
const passport = require("passport");
const cookieSession = require("cookie-session");
app.use(compression());
////load schema models/////
require("./models/day-model");
require("./models/symptom-model");
var User = require("./models/user-model");

////set view engine///////


//////connect to database//////
mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected To Mongo"))
  .catch(err => console.log(err));

////user bodyparser to properly recieve data/////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

////use cookie session to encrypt cookie from authentication and admniister its lifespan////


app.use(
  cookieSession({
    maxAge:222222222222,
    keys: ["asjdjfntwof"]
  })
);

////initialize passport/////
app.use(passport.initialize());
app.use(passport.session());

////activate routes/////
require("./routes")(app);

app.use(express.static(path.resolve(__dirname, "client")));
app.get("/service-worker.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "service-worker.js"));
});
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

app.listen(PORT);

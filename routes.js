const Symptom = require("./models/symptom-model");
const Day = require("./models/day-model");
const calcs = require("./tools/calculations")
const mongoose = require("mongoose");
const passport = require("passport");
const passpostSetup = require("./services/passport");
mongoose.set("useFindAndModify", false);

const requireLogin = (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  }
  next();
};

module.exports = app => {
  const errors = {};
///get user and logout///

app.get("/api/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.get("/api/current_user", (req, res) => {
  res.send(req.user);
});
  ///register/////

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/home");
    }
  );
  //////get Days////
  app.get("/api/getDays",requireLogin, (req, res) => {
    Day.find({"_user":req.user._id})
      .then(days => {
        res.json(days);
      })
      .catch(err => {
        errors.days = "Something went wrong or there are no days yet";
        res.status(404).json(errors);
      });
  });
  ////make or edit Day////
  app.post("/api/addDay", requireLogin, (req, res) => {
    Day.findOne({ entryNumber: req.body.entryNumber }).then(day => {
      const updatedDay = {};
      updatedDay.meals = {};
      updatedDay.symptoms = {};
      if (req.user) {
        updatedDay._user = req.user._id;
      }
      if (req.body.entryNumber) {
        updatedDay.entryNumber = req.body.entryNumber;
      }
      if (req.body.mealNumber) {
        updatedDay.meals.mealNumber = req.body.mealNumber;
      }
      if (req.body.foodName) {
        updatedDay.meals.foodName = req.body.foodName;
      }
      if (req.body.foodAmount) {
        updatedDay.meals.foodAmount = req.body.foodAmount;
      }
      /////////////////////////////////////////////////////////////////////////////
      if (req.body.delayedOrInstant) {
        updatedDay.symptoms.delayedOrInstant = req.body.delayedOrInstant;
      }
      if (req.body.startTime)
        updatedDay.symptoms.startTime = req.body.startTime;
      if (req.body.symptom) updatedDay.symptoms.symptom = req.body.symptom;
      if (req.body.severity) updatedDay.symptoms.severity = req.body.severity;
      if (req.body.symptomDelay)
        updatedDay.symptoms.symptomDelay = req.body.symptomDelay;
      if (req.body.timeWindow)
        updatedDay.symptoms.timeWindow = req.body.timeWindow;
      if (!day) {
        const newDay = new Day(updatedDay);
        newDay.save().then(dayMade => {
          res.json(dayMade);
        });
      } else {
        Day.findOneAndUpdate(
          { entryNumber: req.body.entryNumber },
          { $set: updatedDay },
          { new: true }
        ).then(updatedDay => {
          res.json(updatedDay);
        });
      }
    });
  });
  ///add symptom to day entry////

  app.post("/api/addSymptom/", requireLogin, (req, res) => {
    Day.findOne({ entryNumber: req.body.entryNumber }).then(day => {
      const newSymptom = {
        startTime: req.body.startTime,
        delayedOrInstant: req.body.delayedOrInstant,
        symptom: req.body.symptom,
        severity: req.body.severity,
        symptomDelay: req.body.symptomDelay,
        timeWindow: req.body.timeWindow
      };
      day.symptoms.unshift(newSymptom);
      day.save().then(updatedDay => {
        res.json(updatedDay);
      });
    });
  });

  ///////delete symptom from day entry/////////
  app.delete("/api/deleteSymptom/:entryNumber/:id", requireLogin, (req, res) => {
    Day.findOne({ entryNumber: req.body.entryNumber }).then(day => {
      const updatedSymptoms = day.symptoms.filter(symptom => {
        if (symptom.id !== req.params.id) {
          return symptom;
        }
      });
      day.symptoms = updatedSymptoms;
      day.save().then(updatedDay => {
        res.json(updatedDay);
      });
    });
  });

  /////delete Meal////
  app.delete("/api/deleteMeal/:entryNumber/:id", requireLogin, (req, res) => {
    Day.findOne({ entryNumber: req.body.entryNumber })
      .then(day => {
        const updatedMeals = day.meals.filter(meal => {
          if (meal.id !== req.params.id) {
            return meal;
          }
        });
        day.meals = updatedMeals;
        day.save().then(day => {
          res.json(day);
        });
      })
      .catch(err => {
        errors.posts = "Something went wrong or there are no posts yet";
        res.status(404).json(errors);
      });
  });
  ////add meal/////
  app.post("/api/addMeal/", requireLogin, (req, res) => {
    Day.findOne({ entryNumber: req.body.entryNumber })
      .then(day => {
        const newMeal = {
          foodName: req.body.foodName,
          foodAmount: req.body.foodAmount
        };
        day.meals.push(newMeal);
        day.save().then(dayUpdated => {
          res.json(dayUpdated);
        });
      })
      .catch(err => {
        res.status(400).json({ error: "something went wrong" });
      });
  });

  /////delete day////
  app.delete("/api/deleteDay", requireLogin, (req, res) => {
    Day.findOne({ entryNumber: req.body.entryNumber })
      .then(post => {
        post.remove().then(() => {
          res.json({ success: "You have deleted history, congratz.." });
        });
      })
      .catch(err => {
        errors.posts = "Something went wrong or there are no posts yet";
        res.status(404).json(errors);
      });
  });

  /////createa symptom item///////
  app.post("/api/addSymptom", requireLogin,  (req, res) => {
    const newSymptom = new Symptom({
      symptom: req.body.symptom
    });
    newSymptom.save().then(symptom => {
      res.json(symptom);
    });
  });

  /////get symptoms////
  app.get("/api/getSymptoms", requireLogin, (req, res) => {
    Symptom.find().then(symptoms => {
      res.json(symptoms);
    });
  });


  app.get("/api/entryUpdates", requireLogin, (req, res)=>{
    Day.find({"_user": req.user._id}).then(entries=>{
      res.json(calcs.getPatterns(entries));
    })
  })
};

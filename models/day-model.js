const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DaySchema = new Schema({
  entryNumber: Number,
  _user: Object,
  meals: [
    {
      mealTime: String,
      mealNumber: Number,
      foodName: String,
      foodAmount: String
    }
  ],
  symptoms: [
    {
      delayedOrInstant: Boolean,
      startTime: String,
      symptom: String,
      severity: Number,
      symptomDelay: String,
      timeWindow: String
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = Day = mongoose.model("days", DaySchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SymptomSchema = new Schema({
  symptom: {
    type: String
  }
});
module.exports = Symptom = mongoose.model("symptoms", SymptomSchema);

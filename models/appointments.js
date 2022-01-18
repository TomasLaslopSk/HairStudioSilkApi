const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
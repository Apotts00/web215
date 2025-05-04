const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  checklist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChecklistItem' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;


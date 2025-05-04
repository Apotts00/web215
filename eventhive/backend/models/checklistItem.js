const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  checklistItems: [checklistItemSchema], // Nested checklist items
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = Event;

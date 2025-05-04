const express = require('express');
const Event = require('../models/Event');
const ChecklistItem = require('../models/ChecklistItem');

const router = express.Router();

// Create Event
router.post('/', async (req, res) => {
  const { title, date, userId } = req.body;

  try {
    const newEvent = new Event({ title, date, user: userId });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Get Events for a User
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    const events = await Event.find({ user: userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Update Event
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, date } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, { title, date }, { new: true });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error updating event' });
  }
});

// Delete Event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Event.findByIdAndDelete(id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event' });
  }
});

module.exports = router;

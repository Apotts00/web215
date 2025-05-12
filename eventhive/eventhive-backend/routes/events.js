const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const authMiddleware = require('../middleware/auth');

// GET all events for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, location, date, checklist } = req.body;

    const newEvent = new Event({
      title,
      description,
      location,
      date,
      checklist,
      user: req.user.id,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single event by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user.id });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add checklist item
router.post('/:id/checklist', authMiddleware, async (req, res) => {
  try {
    const { item } = req.body;
    const event = await Event.findOne({ _id: req.params.id, user: req.user.id });

    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.checklist.push({ item, completed: false });
    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

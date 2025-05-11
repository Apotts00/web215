const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth'); // <-- USE IMPORTED MIDDLEWARE

const router = express.Router();

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const newEvent = new Event({ ...req.body, user: req.user.id });
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    console.error('Error saving event:', err.message); // <-- Add this
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all events for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    await Event.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add checklist item
router.post('/:id/checklist', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user.id });
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    event.checklist.push({ item: req.body.item, completed: false });
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update checklist item
router.put('/:eventId/checklist/:itemId', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId, user: req.user.id });
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    const item = event.checklist.id(req.params.itemId);
    if (!item) return res.status(404).json({ msg: 'Checklist item not found' });

    item.item = req.body.item ?? item.item;
    item.completed = req.body.completed ?? item.completed;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete checklist item
router.delete('/:eventId/checklist/:itemId', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId, user: req.user.id });
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    event.checklist.id(req.params.itemId).remove();
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

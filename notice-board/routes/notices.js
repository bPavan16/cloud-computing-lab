const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

router.get('/', async (req, res) => {
  const notices = await Notice.find();
  res.json(notices);
});

router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const newNotice = new Notice({ title, content });
  await newNotice.save();
  res.status(201).json(newNotice);
});

// DELETE a notice 
router.delete('/:id', async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notice deleted' });
});

module.exports = router;

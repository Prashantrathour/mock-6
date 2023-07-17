const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

const Subtask = mongoose.model('Subtask', subtaskSchema);

module.exports = Subtask;

const mongoose = require('mongoose');

const VocabularySchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true },
  definition: { type: String, required: true },
  exampleSentence: { type: String, required: true }, // Now required
  difficultyLevel: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
});

module.exports = mongoose.model('Vocabulary', VocabularySchema);

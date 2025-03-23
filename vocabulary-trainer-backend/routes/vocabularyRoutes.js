const express = require('express');
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Vocabulary = require('../models/Vocabulary');

// Configure Multer for file upload
const upload = multer({ dest: "uploads/" });

// Working endpoint: /api/vocabulary/random/:count
router.get('/random/:count', async (req, res) => {
  const count = parseInt(req.params.count, 10) || 10;
  try {
    const randomWords = await Vocabulary.aggregate([{ $sample: { size: count } }]);
    res.json(randomWords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching random words' });
  }
});

// Bulk import CSV
router.post("/bulk/csv", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filePath = req.file.path;
  const words = [];

  console.log(`📂 Processing file: ${filePath}`);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const { word, definition, exampleSentence } = row;
      if (word && definition && exampleSentence) {
        words.push({ word, definition, exampleSentence });
      } else {
        console.warn("⚠️ Skipping invalid row:", row);
      }
    })
    .on("end", async () => {
      try {
        if (words.length === 0) {
          return res.status(400).json({ error: "CSV file is empty or incorrectly formatted." });
        }

        console.log(`✅ Found ${words.length} words. Updating database...`);

        let updatedCount = 0;
        for (const entry of words) {
          const result = await Vocabulary.updateOne(
            { word: entry.word }, // Find by word
            { $set: entry }, // Update definition and exampleSentence
            { upsert: true } // Insert if it doesn’t exist
          );
          if (result.upsertedCount > 0 || result.modifiedCount > 0) {
            updatedCount++;
          }
        }

        fs.unlinkSync(filePath); // Remove uploaded file after processing
        res.status(201).json({ message: `Successfully updated ${updatedCount} words!` });
      } catch (error) {
        console.error("❌ Database Error:", error);
        res.status(500).json({ error: "Error inserting words into the database." });
      }
    })
    .on("error", (error) => {
      console.error("❌ CSV Processing Error:", error);
      res.status(500).json({ error: "Error processing CSV file." });
    });
});

// Existing route
router.get('/', async (req, res) => {
  try {
    const words = await Vocabulary.find({});
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching words' });
  }
});

// Add a new vocabulary word
router.post('/', async (req, res) => {
  try {
    const { word, definition, exampleSentence, difficultyLevel } = req.body;

    if (!word || !definition || !exampleSentence) {
      return res.status(400).json({ error: "Word, definition, and example sentence are required." });
    }

    // Ensure difficultyLevel is one of the allowed values
    const allowedDifficulties = ["easy", "medium", "hard"];
    const difficulty = allowedDifficulties.includes(difficultyLevel) ? difficultyLevel : "medium";

    // Check if word already exists
    const existingWord = await Vocabulary.findOne({ word });
    if (existingWord) {
      return res.status(409).json({ error: "Word already exists in the database." });
    }

    const newWord = new Vocabulary({ word, definition, exampleSentence, difficultyLevel: difficulty });
    await newWord.save();

    res.status(201).json({ message: "Word added successfully!", word: newWord });
  } catch (error) {
    console.error("Error adding word:", error);
    res.status(500).json({ error: "Server error adding word" });
  }
});

// DELETE a word by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the word
    const deletedWord = await Vocabulary.findByIdAndDelete(id);

    if (!deletedWord) {
      return res.status(404).json({ error: 'Word not found' });
    }

    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    console.error("Error deleting word:", error);
    res.status(500).json({ error: 'Server error deleting word' });
  }
});

// UPDATE (Edit) a word's definition by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { definition, exampleSentence } = req.body;

    if (!definition || !exampleSentence) {
      return res.status(400).json({ error: "Both definition and example sentence are required for update." });
    }

    const updatedWord = await Vocabulary.findByIdAndUpdate(
      id,
      { definition, exampleSentence },
      { new: true } // Returns the updated document
    );

    if (!updatedWord) {
      return res.status(404).json({ error: "Word not found" });
    }

    res.json({ message: "Word updated successfully", word: updatedWord });
  } catch (error) {
    console.error("Error updating word:", error);
    res.status(500).json({ error: "Server error updating word" });
  }
});



module.exports = router;

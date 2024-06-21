// routes/storage.js
const express = require('express');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Load credentials using environment variable
const storage = new Storage();

const bucketName = 'harvestedu';  // Gantilah dengan nama bucket yang benar
const bucket = storage.bucket(bucketName);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST route for uploading image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  blobStream.on('error', err => res.status(500).json({ error: err.message }));

  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.status(200).json({ publicUrl });
  });

  blobStream.end(req.file.buffer);
});

// GET route for listing images
router.get('/images', async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const urls = files.map(file => `https://storage.googleapis.com/${bucket.name}/${file.name}`);
    res.status(200).json(urls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

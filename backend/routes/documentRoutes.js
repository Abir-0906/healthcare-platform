const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  uploadDocument,
  getAllDocuments,
  downloadDocument,
  deleteDocument
} = require('../controllers/documentController');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Only PDF files allowed!'));
  },
});

// Routes
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getAllDocuments);
router.get('/:id', downloadDocument);
router.delete('/:id', deleteDocument);

module.exports = router;

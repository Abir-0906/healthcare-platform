const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

const uploadDir = path.join(__dirname, '..', 'uploads');

exports.uploadDocument = async (req, res) => {
  try {
    const { originalname, filename, size } = req.file;

    const newDoc = await Document.create({
      filename: originalname,
      filepath: filename,
      filesize: size,
    });

    res.json({
      message: 'File uploaded successfully',
      document: newDoc,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ created_at: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'File not found' });

    const filePath = path.join(uploadDir, doc.filepath);
    res.download(filePath, doc.filename);
  } catch (err) {
    res.status(500).json({ error: 'Download failed' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'File not found' });

    const filePath = path.join(uploadDir, doc.filepath);
    fs.unlinkSync(filePath);
    await Document.deleteOne({ _id: req.params.id });

    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

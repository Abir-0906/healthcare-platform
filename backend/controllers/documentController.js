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
    const page = parseInt(req.query.page) || 1; // Default page 1
    const limit = parseInt(req.query.limit) || 10; // Default 10 documents per page
    const skip = (page - 1) * limit;

    const totalDocuments = await Document.countDocuments();
    const docs = await Document.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      documents: docs,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments,
    });
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

// ✅ Move viewDocument OUTSIDE the above block
exports.viewDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'File not found' });

    const filePath = path.join(uploadDir, doc.filepath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + doc.filename + '"');
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'View failed' });
  }
};


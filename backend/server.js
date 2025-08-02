const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./configs/db');
const documentRoutes = require('./routes/documentRoutes');

dotenv.config();          // Load env vars

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();              // Connect to MongoDB

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'] // ✅ Allow this header to be readable in JS
}));





app.use(express.json());

app.use('/documents', documentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

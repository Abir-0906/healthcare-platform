// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./configs/db');
// const documentRoutes = require('./routes/documentRoutes');

// dotenv.config();          // Load env vars

// const app = express();
// const PORT = process.env.PORT || 5000;

// connectDB();              // Connect to MongoDB


// app.use(cors({
//   origin: 'http://localhost:5173', // Allow Vite React frontend
//   credentials: true,              // Allow cookies/headers if needed
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
// }));






// app.use(express.json());

// app.use('/documents', documentRoutes);

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });



const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./configs/db');
const documentRoutes = require('./routes/documentRoutes');

dotenv.config(); // Load env vars

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

// Allow both local and Netlify frontend origins
const allowedOrigins = [
  'http://localhost:5173', // Local dev
  'https://willowy-treacle-3b9514.netlify.app' // Netlify deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (e.g., curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

app.use('/documents', documentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const articleRoutes = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use('/api/articles', articleRoutes);

app.get('/', (req, res) => {
    res.send('News Aggregator API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

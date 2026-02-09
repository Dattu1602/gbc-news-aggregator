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
connectDB().then(async () => {
    try {
        const Article = require('./models/Article');
        const { scrapeAll } = require('./services/scraper');

        const count = await Article.countDocuments();
        console.log(`Current Article Count: ${count}`);

        if (count === 0) {
            console.log("Database empty. Triggering initial scrape...");
            const { newCount } = await scrapeAll();
            console.log(`Initial scrape complete. New articles: ${newCount}`);
        }
    } catch (err) {
        console.error("Initial scrape check failed:", err.message);
    }
});

// Routes
app.use('/api/articles', articleRoutes);

app.get('/', (req, res) => {
    res.send('News Aggregator API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

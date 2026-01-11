const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { scrapeAll } = require('../services/scraper');
const { analyzeArticle } = require('../services/ai');

// @route   GET /api/articles
// @desc    Get all articles with filters
router.get('/', async (req, res) => {
    try {
        console.log("GET /articles Query:", req.query);
        const { category, sentiment, search, sortBy, page = 1, limit = 20, fromDate, toDate } = req.query;
        const query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (sentiment && sentiment !== 'All') {
            query.sentimentLabel = sentiment;
        }

        if (fromDate || toDate) {
            query.publishedAt = {};
            if (fromDate) query.publishedAt.$gte = new Date(fromDate);
            if (toDate) query.publishedAt.$lte = new Date(toDate);
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = { publishedAt: -1 }; // Default: Newest first
        if (sortBy === 'sentimentHigh') {
            sortOption = { sentimentScore: -1 };
        } else if (sortBy === 'sentimentLow') {
            sortOption = { sentimentScore: 1 };
        } else if (sortBy === 'category') {
            sortOption = { category: 1 };
        }

        const articles = await Article.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Article.countDocuments(query);

        res.json({
            articles,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/articles/scrape
// @desc    Trigger scrape and AI analysis
router.post('/scrape', async (req, res) => {
    try {
        console.log("Starting scrape...");
        const { allArticles, report } = await scrapeAll();
        console.log(`Scrape finished. Report:`, report);

        const savedArticles = [];

        for (const data of allArticles) {
            // Check if exists
            const exists = await Article.findOne({ url: data.url });
            if (!exists) {
                // Run AI (Local Sentiment)
                const aiAnalysis = await analyzeArticle(data.content + " " + data.title);

                const newArticle = new Article({
                    ...data,
                    ...aiAnalysis
                });

                await newArticle.save();
                savedArticles.push(newArticle);
            }
        }

        res.json({
            message: 'Scrape completed',
            newCount: savedArticles.length,
            report,
            articles: savedArticles
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

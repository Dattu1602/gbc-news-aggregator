require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');
const { scrapeAll } = require('./services/scraper');

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("--- Running Scraper Directly ---");
        const { allArticles, report } = await scrapeAll();
        console.log("Report:", JSON.stringify(report, null, 2));

        const tcArticles = allArticles.filter(a => a.source === 'TechCrunch');
        console.log(`Found ${tcArticles.length} TC articles.`);

        if (tcArticles.length > 0) {
            console.log("Sample TC Article:", tcArticles[0]);
            console.log("Date Type:", typeof tcArticles[0].publishedAt, tcArticles[0].publishedAt);

            console.log("Attempting to save...");
            try {
                // Must handle duplicates or simple update
                // Check validation
                const art = new Article(tcArticles[0]);
                await art.validate();
                console.log("Validation Passed!");

                await Article.deleteMany({ source: 'TechCrunch' });
                await art.save();
                console.log("Saved TC article successfully!");
            } catch (e) {
                console.error("Save/Validation Failed:", e);
            }
        } else {
            console.log("No TC articles fetched by scraper.");
        }

        console.log("--- DB Stats ---");
        const counts = await Article.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);
        console.log(JSON.stringify(counts, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();

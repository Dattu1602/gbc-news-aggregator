require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Count per source
        const counts = await Article.aggregate([
            {
                $group: {
                    _id: "$source",
                    count: { $sum: 1 },
                    minDate: { $min: "$publishedAt" },
                    maxDate: { $max: "$publishedAt" }
                }
            }
        ]);

        console.log("DB Stats:", JSON.stringify(counts, null, 2));

        // Check date types
        const sample = await Article.findOne({});
        if (sample) {
            console.log("Sample Date Type:", typeof sample.publishedAt, sample.publishedAt);
        } else {
            console.log("Database is empty.");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();

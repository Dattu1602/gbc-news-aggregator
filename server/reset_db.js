require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');

const reset = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        const count = await Article.countDocuments();
        console.log(`Deleting ${count} articles...`);
        await Article.deleteMany({});
        console.log("Database cleared.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

reset();

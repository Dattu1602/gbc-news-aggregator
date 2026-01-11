require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("--- Checking Classification ---");
        // Find articles with Amazon or Meta or Google in title
        const techBiz = await Article.find({
            $or: [
                { title: { $regex: 'Amazon', $options: 'i' } },
                { title: { $regex: 'Meta', $options: 'i' } },
                { title: { $regex: 'Google', $options: 'i' } }
            ]
        }).select('title category source');

        console.log(JSON.stringify(techBiz, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();

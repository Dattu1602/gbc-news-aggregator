require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("--- Checking User Complaints ---");
        const complaints = await Article.find({
            $or: [
                { title: { $regex: 'Greenland', $options: 'i' } },
                { title: { $regex: 'Swiss', $options: 'i' } },
                { title: { $regex: 'Fire', $options: 'i' } }
            ]
        }).select('title category source sentimentLabel');

        console.log(JSON.stringify(complaints, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();

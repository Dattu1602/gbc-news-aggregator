const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  source: { type: String, required: true },
  content: { type: String }, // Summary or snippets
  imageUrl: { type: String },
  category: { type: String, default: 'General' },
  sentimentScore: { type: Number, default: 0 }, // -1 to 1
  sentimentLabel: { type: String, enum: ['Positive', 'Neutral', 'Negative'], default: 'Neutral' },
  publishedAt: { type: Date, default: Date.now },
  scrapedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);

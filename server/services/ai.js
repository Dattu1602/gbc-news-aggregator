const Sentiment = require('sentiment');
const natural = require('natural');
const sentiment = new Sentiment();

// Initialize Classifier
const classifier = new natural.BayesClassifier();

// Train the model with expanded dataset
const trainingData = [
    // Business (Strict: Money/Companies)
    { text: 'stock market wall street nasdaq dow jones economy inflation rate fed interest bank money finance invest trade gdp recession growth profit quarterly earnings revenue amazon tesla microsoft apple google meta company corporate merger acquisition ipo startup venture capital business sales retail store walmart target strategy ceo cfo dividend marketcap currency crypto bitcoin', label: 'Business' },

    // Technology
    { text: 'software hardware code programming developer app iphone android smartphone samsung pixel laptop computer server cloud aws azure cyber security hack malware virus ai artificial intelligence chatgpt llm robot drone space rocket nasa spacex science future tech gadget device review release beta update patch system windows linux macos interface ui ux digital data internet web online', label: 'Technology' },

    // Politics (Strict: Government/Policy)
    { text: 'white house president biden trump senate congress vote law bill legislation democrat republican election campaign candidate vote poll government policy diplomacy war military defense department state justice supreme court judge rights protest activist tax budget deficit governor mayor council official treaty foreign affairs geopolitics border immigration embassy', label: 'Politics' },

    // World / General (News, Disasters, Crime, Human Interest)
    { text: 'fire accident crash disaster storm hurricane earthquake flood weather police crime arrested murder death kill missing victim rescue emergency warning alert airport travel flight passenger strike protest riot demonstration crowd crowd people local city town village community school education student teacher university breaking news headline report update situation event ceremony festival holiday world international country nation border global european union united nations', label: 'General' },

    // Health
    { text: 'health doctor medicine virus hospital vaccine pandemic disease cancer heart cure medical treatment drug pharma study research diet nutrition fitness exercise mental health wellness insurance care patient study science biology virus covid flu outbreak symptoms', label: 'Health' },

    // Entertainment
    { text: 'movie film actor star celebrity hollywood netflix streaming music song album concert tour band series season episode review cinema theatre drama comedy award oscar grammy game console playstation xbox nintendo steam trailer spoiler box office', label: 'Entertainment' },

    // Science
    { text: 'space planet mars moon sun orbit telescope galaxy star universe physics chemistry biology environment climate change global warming energy nuclear fossil fuel carbon nature animal species discovery study lab scientist data experiment research evolution fossil archaeology', label: 'Science' }
];

console.log("Training AI functionality (Advanced v2)...");
trainingData.forEach(item => {
    classifier.addDocument(item.text, item.label);
});
classifier.train();
console.log("AI Training Complete.");


const analyzeArticle = async (text) => {
    // 1. Sentiment Analysis (AFINN-165)
    // Robust, existing model logic
    const result = sentiment.analyze(text);
    const comparative = result.comparative;

    let sentimentLabel = 'Neutral';
    if (comparative > 0.05) sentimentLabel = 'Positive';
    if (comparative < -0.05) sentimentLabel = 'Negative';

    // 2. Category Classification (Naive Bayes)
    // Uses the trained model 'natural'
    const category = classifier.classify(text.toLowerCase());

    return {
        sentimentScore: comparative,
        sentimentLabel,
        category: category || 'General'
    };
};

module.exports = { analyzeArticle };

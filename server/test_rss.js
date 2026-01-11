const Parser = require('rss-parser');
const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
});

const sources = [
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    { name: 'The Hacker News', url: 'https://thehackernews.com/feeds/posts/default' }
];

const test = async () => {
    for (const s of sources) {
        try {
            console.log(`Testing ${s.name}...`);
            const feed = await parser.parseURL(s.url);
            console.log(`SUCCESS: ${s.name} returned ${feed.items.length} items.`);
            if (feed.items.length > 0) {
                console.log(`Sample Date: ${feed.items[0].pubDate}`);
            }
        } catch (e) {
            console.log(`FAILURE: ${s.name} - ${e.message}`);
        }
    }
};

test();

const Parser = require('rss-parser');
const parser = new Parser({
    timeout: 10000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    customFields: {
        item: [
            ['media:content', 'media:content', { keepArray: false }],
            ['enclosure', 'enclosure', { keepArray: false }],
        ]
    }
});

const sources = [
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Technology' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'Technology' },
    { name: 'The Hacker News', url: 'https://thehackernews.com/feeds/posts/default', category: 'Technology' },
    { name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'General' },
    { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'Technology' }
];

const scrapeAll = async () => {
    let allArticles = [];
    const report = [];

    for (const source of sources) {
        try {
            console.log(`Fetching RSS: ${source.name}`);
            const feed = await parser.parseURL(source.url);

            const articles = feed.items.slice(0, 50).map(item => {
                // Image Extraction Logic
                let imageUrl = null;
                if (item['media:content'] && item['media:content'].$.url) {
                    imageUrl = item['media:content'].$.url;
                } else if (item.enclosure && item.enclosure.url) {
                    imageUrl = item.enclosure.url;
                } else if (item.content) {
                    // Regex for first image in content
                    const match = item.content.match(/<img[^>]+src="([^">]+)"/);
                    if (match) imageUrl = match[1];
                }

                return {
                    title: item.title,
                    url: item.link,
                    source: source.name,
                    content: item.contentSnippet || item.content || item.title,
                    publishedAt: new Date(item.pubDate),
                    imageUrl: imageUrl,
                    category: source.category
                };
            });

            allArticles = [...allArticles, ...articles];
            report.push({ source: source.name, status: 'Success', count: articles.length });
        } catch (err) {
            console.error(`Failed to fetch ${source.name}:`, err.message);
            report.push({ source: source.name, status: 'Failed', error: err.message });
        }
    }

    return { allArticles, report };
};

module.exports = { scrapeAll };

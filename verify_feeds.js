const { scrapeAll } = require('./server/services/scraper');

async function testFeeds() {
    console.log("Testing RSS Feeds...");
    try {
        const { allArticles, report } = await scrapeAll();
        console.log("\n--- Report ---");
        console.table(report);

        console.log("\n--- Articles Found ---");
        const sources = {};
        allArticles.forEach(a => {
            sources[a.source] = (sources[a.source] || 0) + 1;
        });
        console.table(sources);

        if (allArticles.length === 0) {
            console.error("CRITICAL: No articles fetched from any source.");
        } else {
            console.log(`Total Articles: ${allArticles.length}`);
        }
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

testFeeds();

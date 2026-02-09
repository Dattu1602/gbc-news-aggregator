import React, { useState, useEffect } from 'react';
import { getArticles, triggerScrape } from './api';
import ArticleCard from './components/ArticleCard';
import FilterBar from './components/FilterBar';
import { Newspaper, Loader2, RefreshCw, Globe, ChevronRight } from 'lucide-react';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    sentiment: 'All',
    search: '',
    sortBy: 'date',
    date: ''
  });

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticles(filters);
      setArticles(Array.isArray(data?.articles) ? data.articles : []);
    } catch (error) {
      console.error('Failed to fetch articles', error);
      setError('Failed to connect to the server. Please check your connection or try again later.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  const handleScrape = async () => {
    setScrapeLoading(true);
    try {
      await triggerScrape();
      await fetchArticles();
    } catch (error) {
      console.error('Scrape failed', error);
    } finally {
      setScrapeLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Splitting articles for the BBC Magazine Grid
  const heroArticle = articles.length > 0 ? articles[0] : null;
  const leftColumnArticles = articles.slice(1, 3);
  const rightColumnArticles = articles.slice(3, 8);
  const bottomGridArticles = articles.slice(8);

  return (
    <div className="min-h-screen bg-white">
      {/* GBC Style Header */}
      <header style={{ padding: '24px 0', borderBottom: '1px solid #f3f4f6', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          {/* Logo Section - Explicit Flex Row */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', marginBottom: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '42px', height: '42px', backgroundColor: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '26px' }}>G</div>
            <div style={{ width: '42px', height: '42px', backgroundColor: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '26px' }}>B</div>
            <div style={{ width: '42px', height: '42px', backgroundColor: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '26px' }}>C</div>
          </div>

          {/* Unified Navigation & Search Bar */}
          <div style={{ width: '100%', borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '24px' }}>
              <FilterBar filters={filters} onFilterChange={handleFilterChange} onSearch={(val) => handleFilterChange('search', val)} />
            </div>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <div className="bg-[#121212] py-2" style={{ backgroundColor: '#121212', padding: '8px 0' }}>
        <div className="container mx-auto px-4 flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div className="flex items-center gap-4">
            <button onClick={handleScrape} disabled={scrapeLoading} className="text-white text-[11px] font-bold uppercase flex items-center gap-2 hover:text-gray-300" style={{ color: 'white', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={14} className={scrapeLoading ? 'animate-spin' : ''} />
              {scrapeLoading ? 'Syncing...' : 'Live Updates'}
            </button>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-[11px] font-bold uppercase" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={14} /> Global Intelligence Hub
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8" style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '160px 0' }}>
            <Loader2 size={40} className="text-red-700 animate-spin mb-4" />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Formatting Newsroom...</p>
          </div>
        ) : error ? (
          <div className="text-center py-40">
            <div className="p-4 bg-red-50 text-red-700 rounded-md inline-block">
              <h2 className="text-lg font-bold mb-2">Connection Error</h2>
              <p>{error}</p>
              <button onClick={fetchArticles} className="mt-4 px-4 py-2 bg-red-700 text-white rounded font-bold text-sm uppercase">Retry Connection</button>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-40">
            <Newspaper size={64} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Breaking News Found</h2>
            <p className="text-gray-500">Try adjusting your filters to discover more stories.</p>
            <button onClick={fetchArticles} className="mt-4 underline text-sm text-gray-400">Refresh Feed</button>
          </div>
        ) : (
          <div className="space-y-12 mt-8">
            {/* Top Magazine Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
              {/* Left Column (Semi-Featured) */}
              <div className="lg:col-span-3 space-y-10" style={{ gridColumn: 'span 3' }}>
                {leftColumnArticles.map(art => (
                  <ArticleCard key={art._id} article={art} variant="grid" />
                ))}
              </div>

              {/* Middle Column (Hero) */}
              <div className="lg:col-span-6 border-x border-gray-100 px-0 lg:px-10" style={{ gridColumn: 'span 6', borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6', padding: '0 40px' }}>
                {heroArticle && (
                  <ArticleCard article={heroArticle} variant="hero" />
                )}
              </div>

              {/* Right Column (List) */}
              <div className="lg:col-span-3 space-y-6" style={{ gridColumn: 'span 3' }}>
                <div className="flex items-center justify-between border-b-2 border-red-700 pb-2 mb-6" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #BB1919', paddingBottom: '8px', marginBottom: '24px' }}>
                  <h2 className="text-lg font-black uppercase tracking-tighter" style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase' }}>Top Stories</h2>
                  <ChevronRight size={18} className="text-red-700" />
                </div>
                <div className="flex flex-col">
                  {rightColumnArticles.map(art => (
                    <ArticleCard key={art._id} article={art} variant="list" />
                  ))}
                </div>
              </div>
            </div>

            <div className="accent-line" />

            {/* Secondary Bottom Grid */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {bottomGridArticles.map(art => (
                  <ArticleCard key={art._id} article={art} variant="grid" />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ backgroundColor: '#121212', padding: '64px 0', marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="container mx-auto px-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', opacity: 0.3, filter: 'grayscale(1) invert(1)' }}>
            <div style={{ width: '30px', height: '30px', border: '1px solid white', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px' }}>G</div>
            <div style={{ width: '30px', height: '30px', border: '1px solid white', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px' }}>B</div>
            <div style={{ width: '30px', height: '30px', border: '1px solid white', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px' }}>C</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: '32px' }}>
            {['About GBC', 'Contact Us', 'Help', 'Terms of Use', 'Privacy Policy'].map(link => (
              <a key={link} href="#" style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.1em' }}>{link}</a>
            ))}
          </div>
          <p style={{ color: '#4b5563', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.1em' }}>
            Copyright © 2026 GBC. Global Broadcasting Corporation.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

import React from 'react';
import { Newspaper, Clock } from 'lucide-react';

const ArticleCard = ({ article, variant = 'grid' }) => {
    if (!article) return null;

    const getRelativeTime = (publishedAt) => {
        if (!publishedAt) return 'Recently';
        const now = new Date();
        const published = new Date(publishedAt);
        const diffInMs = now - published;
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${diffInDays}d ago`;
    };

    const date = getRelativeTime(article.publishedAt);
    const sourceName = article.source || 'GBC News';
    const categoryName = article.category || 'World';

    if (variant === 'list') {
        return (
            <div className="card-list-item group" onClick={() => window.open(article.url, '_blank')} style={{ padding: '16px 0', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
                <h3 className="magazine-title-list mb-2" style={{ fontSize: '15px', fontWeight: 'bold', lineHeight: '1.3', color: '#111827', margin: '0 0 8px 0', fontFamily: 'Lora, serif' }}>{article.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' }}>{date}</span>
                    <span style={{ width: '1px', height: '10px', backgroundColor: '#eee' }} />
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>{sourceName}</span>
                    <span style={{ width: '4px', height: '4px', backgroundColor: '#BB1919', borderRadius: '50%' }} />
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#BB1919', textTransform: 'uppercase' }}>{categoryName}</span>
                </div>
            </div>
        );
    }

    const titleStyle = {
        fontSize: variant === 'hero' ? '32px' : '20px',
        fontWeight: variant === 'hero' ? '800' : '700',
        lineHeight: '1.2',
        color: '#111827',
        fontFamily: 'Lora, serif',
        margin: '0 0 8px 0'
    };

    return (
        <div className="card-standard group" onClick={() => window.open(article.url, '_blank')} style={{ display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', marginBottom: '24px' }}>
            {/* Image Area */}
            {article.imageUrl ? (
                <div className="relative aspect-video overflow-hidden bg-gray-100" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                    <img
                        src={article.imageUrl}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={article.title}
                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                </div>
            ) : null}

            {/* Content Area */}
            <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={titleStyle}>{article.title}</h3>

                {variant !== 'list' && (
                    <p className="text-[#404040] text-sm leading-[1.5] line-clamp-2" style={{ fontSize: '14px', lineHeight: '1.5', color: '#4b5563', margin: '0' }}>
                        {article.content?.replace(/<[^>]*>?/gm, '') || 'Full coverage available now.'}
                    </p>
                )}

                <div className="flex items-center gap-3 mt-1" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                    <span className="meta-tag" style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>{date}</span>
                    <span className="h-3 w-px bg-gray-300" style={{ height: '12px', width: '1px', backgroundColor: '#d1d5db' }} />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight" style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' }}>{sourceName}</span>
                    <span className="h-3 w-px bg-gray-300" style={{ height: '12px', width: '1px', backgroundColor: '#d1d5db' }} />
                    <span className="text-[11px] font-bold text-red-700 uppercase tracking-tight" style={{ fontSize: '11px', fontWeight: 'bold', color: '#BB1919', textTransform: 'uppercase' }}>{categoryName}</span>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;

import React from 'react';
import { Search, Filter, SortAsc, Calendar } from 'lucide-react';

const categories = ['All', 'Technology', 'Business', 'Politics', 'Science', 'Health', 'Entertainment', 'General'];
const sentiments = ['All', 'Positive', 'Neutral', 'Negative'];

const FilterBar = ({ filters, onFilterChange, onSearch }) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center">

            {/* Search */}
            <div style={{ position: 'relative', width: '280px' }}>
                <input
                    type="text"
                    placeholder="Search news..."
                    style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #e5e7eb',
                        padding: '8px 4px',
                        fontSize: '14px',
                        color: '#111',
                        outline: 'none'
                    }}
                    value={filters.search}
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
                {categories.map(c => (
                    <button
                        key={c}
                        onClick={() => onFilterChange('category', c)}
                        style={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            padding: '6px 12px',
                            borderRadius: '2px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: filters.category === c ? '#BB1919' : 'transparent',
                            color: filters.category === c ? 'white' : '#6b7280',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="ml-auto" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Sentiment Dropdown */}
                <div style={{ position: 'relative' }}>
                    <select
                        style={{
                            appearance: 'none',
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '2px',
                            padding: '6px 32px 6px 12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: '#4b5563',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                        value={filters.sentiment}
                        onChange={(e) => onFilterChange('sentiment', e.target.value)}
                    >
                        <option value="All">All Tones</option>
                        {sentiments.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* Sort Dropdown */}
                <div style={{ position: 'relative' }}>
                    <select
                        style={{
                            appearance: 'none',
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '2px',
                            padding: '6px 32px 6px 12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: '#4b5563',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                        value={filters.sortBy}
                        onChange={(e) => onFilterChange('sortBy', e.target.value)}
                    >
                        <option value="date">Newest</option>
                        <option value="sentimentHigh">Positive</option>
                        <option value="sentimentLow">Negative</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;

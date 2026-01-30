import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, X, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';

// Mock data for campaigns
// In a real app, this would come from a backend/database
const ALL_CAMPAIGNS = [
    {
        id: 1,
        title: "Help Ayaan's Surgery",
        image: "/src/assets/project-emma.jpg", // Using existing placeholder
        raised: 450000,
        goal: 1000000,
        contributors: 34,
        rating: 4,
        date: "Jan 25, 2026",
        daysLeft: 9,
        category: "Medical",
        isActive: true, // Only show if admin adds them (isActive = true)
        isCompleted: false
    },
    {
        id: 2,
        title: "Orphan Care Essentials",
        image: "/src/assets/project-arklow.png", // Using existing placeholder
        raised: 50000,
        goal: 70000,
        contributors: 21,
        rating: 3,
        date: "Jan 31, 2026",
        daysLeft: 15,
        category: "Social",
        isActive: true,
        isCompleted: false
    },
    {
        id: 3,
        title: "Medical Equipment for Rural Hospital",
        image: "/src/assets/project-emma.jpg",
        raised: 190000,
        goal: 200000,
        contributors: 52,
        rating: 4,
        date: "Feb 6, 2026",
        daysLeft: 21,
        category: "Medical",
        isActive: true,
        isCompleted: false
    },
    {
        id: 4,
        title: "Temple renovation in Panagama",
        image: "/src/assets/project-arklow.png",
        raised: 20000,
        goal: 50000,
        contributors: 18,
        rating: 4,
        date: "Feb 22, 2026",
        daysLeft: 37,
        category: "Social",
        isActive: true,
        isCompleted: false
    },
    {
        id: 5,
        title: "Rebuild Emma's Home",
        image: "/src/assets/project-emma.jpg",
        raised: 100000,
        goal: 100000,
        contributors: 76,
        rating: 4,
        date: "Completed",
        daysLeft: 0,
        category: "Individual",
        isActive: true,
        isCompleted: true
    },
    {
        id: 6,
        title: "Medical Aid for Mrs. Perera",
        image: "/src/assets/project-emma.jpg",
        raised: 80000,
        goal: 80000,
        contributors: 26,
        rating: 3,
        date: "Completed",
        daysLeft: 0,
        category: "Individual",
        isActive: true,
        isCompleted: true
    },
    {
        id: 7,
        title: "Unapproved Project",
        image: "/src/assets/project-arklow.png",
        raised: 0,
        goal: 50000,
        contributors: 0,
        rating: 0,
        date: "Pending",
        daysLeft: 30,
        category: "Social",
        isActive: false, // This project will NOT be visible in the list
        isCompleted: false
    }
];

const Campaigns = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Recent');

    // Filter campaigns based on Admin Approval (isActive), Category, and Search
    const filteredCampaigns = ALL_CAMPAIGNS.filter(campaign => {
        // 1. Admin Visibility Check
        if (!campaign.isActive) return false;

        // 2. Category Filter
        const categoryMatch = activeFilter === 'Recent' || campaign.category === activeFilter;

        // 3. Search Query
        const searchMatch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase());

        return categoryMatch && searchMatch;
    });

    return (
        <div style={styles.page}>
            <Navbar />

            <div className="container" style={styles.container}>
                {/* Header Section */}
                <div style={styles.headerBox}>
                    <div style={styles.headerContent}>
                        <img src={logo} alt="KindCents" style={styles.headerLogo} />
                        <div>
                            <h1 style={styles.headerTitle}>Donate Now - Track every step of your donation.</h1>
                            <p style={styles.headerSubtitle}>See our past and ongoing campaigns</p>
                        </div>
                    </div>

                    <div style={styles.searchBar}>
                        <Search size={20} color="#64748b" />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && <X size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />}
                    </div>

                    <div style={styles.filterTabs}>
                        {['Recent', 'Medical', 'Social', 'Individual'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                style={{
                                    ...styles.filterBtn,
                                    ...(activeFilter === filter ? styles.activeFilterBtn : {})
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Campaigns Grid */}
                <div style={styles.grid}>
                    {filteredCampaigns.map(campaign => (
                        <div key={campaign.id} style={{
                            ...styles.card,
                            ...(campaign.isCompleted ? styles.completedCard : {})
                        }}>
                            <div style={styles.imageWrapper}>
                                <img src={campaign.image} alt={campaign.title} style={styles.cardImage} />
                            </div>

                            <div style={styles.cardContent}>
                                <h3 style={styles.cardTitle}>{campaign.title}</h3>

                                <div style={styles.progressContainer}>
                                    <div style={{
                                        ...styles.progressBar,
                                        width: `${(campaign.raised / campaign.goal) * 100}%`,
                                        backgroundColor: campaign.isCompleted ? '#10b981' : '#2563eb'
                                    }} />
                                </div>

                                <div style={styles.statsRow}>
                                    <div style={styles.statItem}>
                                        <span style={styles.statLabel}>Rs. {campaign.raised.toLocaleString()}</span>
                                        <span style={styles.statSublabel}>Rs. {campaign.goal.toLocaleString()}</span>
                                    </div>
                                    <div style={styles.statItem}>
                                        <div style={styles.contributors}>
                                            <Users size={14} />
                                            <span>Contributors - {campaign.contributors}</span>
                                        </div>
                                        <div style={styles.rating}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < campaign.rating ? "#fbbf24" : "none"} color="#fbbf24" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.cardFooter}>
                                    {campaign.isCompleted ? (
                                        <div style={styles.completedBadge}>Completed</div>
                                    ) : (
                                        <>
                                            <div style={styles.dateBadge}>{campaign.date}</div>
                                            <div style={styles.daysBadge}>{campaign.daysLeft} days</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div style={styles.pagination}>
                    <button style={styles.pagBtn}><ChevronLeft size={16} /> Previous</button>
                    <button style={{ ...styles.pagBtn, ...styles.activePagBtn }}>1</button>
                    <button style={styles.pagBtn}>Next <ChevronRight size={16} /></button>
                </div>

                {/* Verified Organizations */}
                <div style={styles.verifiedSection}>
                    <h2 style={styles.verifiedTitle}>Be a part of Verified organizations</h2>
                    <div style={styles.orgLogos}>
                        {/* Mock Logos - In a real app we'd use local assets */}
                        <div style={styles.orgCard}><div style={styles.placeholderLogo}>AKSHAY SOCIETY</div></div>
                        <div style={styles.orgCard}><div style={styles.placeholderLogo}>KEITHSTON FOUNDATION</div></div>
                        <div style={styles.orgCard}><div style={styles.placeholderLogo}>SMILE FOUNDATION</div></div>
                        <div style={styles.orgCard}><div style={styles.placeholderLogo}>LOTUS BORN FOUNDATION</div></div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
    },
    container: {
        paddingTop: '100px',
        paddingBottom: '4rem',
    },
    headerBox: {
        backgroundColor: '#D6E6FF',
        borderRadius: '20px',
        padding: '2.5rem',
        marginBottom: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    headerContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'left',
    },
    headerLogo: {
        height: '60px',
    },
    headerTitle: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0,
    },
    headerSubtitle: {
        fontSize: '1.1rem',
        color: '#475569',
        margin: 0,
        fontStyle: 'italic',
    },
    searchBar: {
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#fff',
        borderRadius: '50px',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    },
    searchInput: {
        border: 'none',
        outline: 'none',
        flex: 1,
        fontSize: '1rem',
        color: '#475569',
    },
    filterTabs: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    filterBtn: {
        padding: '0.5rem 2rem',
        borderRadius: '50px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#475569',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    activeFilterBtn: {
        backgroundColor: '#fff',
        color: '#1e293b',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem',
    },
    card: {
        backgroundColor: '#f1f5f9', // Lighter gray for cards
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
    },
    completedCard: {
        backgroundColor: '#dcfce7', // Light green for completed
    },
    imageWrapper: {
        height: '200px',
        width: '100%',
        padding: '1.25rem',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '15px',
    },
    cardContent: {
        padding: '0 1.25rem 1.25rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    cardTitle: {
        fontSize: '0.95rem',
        fontWeight: '700',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: '0.25rem',
    },
    progressContainer: {
        width: '100%',
        height: '6px',
        backgroundColor: '#e2e8f0',
        borderRadius: '3px',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: '3px',
    },
    statsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
    },
    statLabel: {
        fontSize: '0.8rem',
        fontWeight: '600',
        color: '#475569',
    },
    statSublabel: {
        fontSize: '0.75rem',
        color: '#94a3b8',
    },
    contributors: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.7rem',
        color: '#64748b',
        justifyContent: 'flex-end',
    },
    rating: {
        display: 'flex',
        gap: '1px',
        marginTop: '0.1rem',
        justifyContent: 'flex-end',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '0.25rem',
    },
    dateBadge: {
        backgroundColor: '#fff',
        padding: '0.2rem 0.75rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        color: '#475569',
        border: '1px solid #e2e8f0',
    },
    daysBadge: {
        backgroundColor: '#Fca5a5', // Softer red
        padding: '0.2rem 0.75rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        color: '#fff',
    },
    completedBadge: {
        backgroundColor: '#10b981',
        padding: '0.2rem 0.75rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        color: '#fff',
        fontWeight: '600',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '4rem',
    },
    pagBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#64748b',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    activePagBtn: {
        backgroundColor: '#64748b',
        color: '#fff',
        borderRadius: '4px',
        width: '32px',
        height: '32px',
        justifyContent: 'center',
        padding: 0,
    },
    verifiedSection: {
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '3rem',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
    },
    verifiedTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '2.5rem',
    },
    orgLogos: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '2rem',
        alignItems: 'center',
    },
    orgCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderLogo: {
        fontSize: '0.8rem',
        fontWeight: '700',
        color: '#94a3b8',
        border: '2px solid #f1f5f9',
        padding: '1.5rem 1rem',
        width: '100%',
        textAlign: 'center',
    }
};

export default Campaigns;

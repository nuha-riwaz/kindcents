import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo.png';
import projectEmma from '../assets/project-emma.jpg';
import projectArklow from '../assets/project-arklow.png';
import ayaanSurgery from '../assets/ayaan-surgery.png';
import mrsPerera from '../assets/mrs-perera.jpg';
import orgAkshay from '../assets/org-akshay.jpg';
import orgKeithston from '../assets/org-keithston.jpg';
import orgSmile from '../assets/org-smile.jpg';
import orgLotus from '../assets/org-lotus.jpg';
import templeRenovation from '../assets/temple-renovation.png';
import ruralMedical from '../assets/rural-medical.jpg';
import orphanCare from '../assets/orphan-care.png';

// Image mapping to resolve Firestore strings to local assets
const imageMap = {
    projectEmma,
    projectArklow,
    ayaanSurgery,
    mrsPerera,
    orgAkshay,
    orgKeithston,
    orgSmile,
    orgLotus,
    templeRenovation,
    ruralMedical,
    orphanCare
};

import { useCampaigns } from '../context/CampaignContext';

const Campaigns = () => {
    const navigate = useNavigate();
    const { campaigns } = useCampaigns();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Recent');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredCampaigns = campaigns.filter(campaign => {
        // Exclude foundation/NGO cards as they have their own section
        if (campaign.type === 'ngo') return false;

        if (!campaign.isActive) return false;
        const categoryMatch = activeFilter === 'Recent' || campaign.category === activeFilter;
        const searchMatch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && searchMatch;
    });

    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div className="container" style={styles.container}>
                <div style={styles.headerBox}>
                    <div style={{ ...styles.headerContent, flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
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
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        {searchQuery && <X size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => {
                            setSearchQuery('');
                            setCurrentPage(1);
                        }} />}
                    </div>
                    <div style={styles.filterTabs}>
                        {['Recent', 'Medical', 'Social', 'Individual'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => {
                                    setActiveFilter(filter);
                                    setCurrentPage(1); // Reset to first page on filter change
                                }}
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
                <div style={filteredCampaigns.length > 0 ? styles.grid : styles.emptyStateWrapper}>
                    {filteredCampaigns.length > 0 ? (
                        currentItems.map(campaign => {
                            const isCompleted = campaign.status === 'completed';
                            return (
                                <div
                                    key={campaign.id}
                                    onClick={() => navigate(`/campaign/${campaign.id}`)}
                                    style={{
                                        ...styles.card,
                                        ...(isCompleted ? styles.completedCard : {}),
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={styles.imageWrapper}>
                                        <img
                                            src={imageMap[campaign.image] || campaign.image}
                                            alt={campaign.title}
                                            style={styles.cardImage}
                                        />
                                        {isCompleted && (
                                            <div style={styles.completedOverlayBadge}>
                                                ✓ Completed
                                            </div>
                                        )}
                                    </div>
                                    <div style={styles.cardContent}>
                                        <h3 style={styles.cardTitle}>{campaign.title}</h3>
                                        <div style={styles.progressContainer}>
                                            <div style={{
                                                ...styles.progressBar,
                                                width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%`,
                                                backgroundColor: isCompleted ? '#10b981' : '#2563eb'
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
                                            {isCompleted ? (
                                                <div style={styles.completedFooterBadge}>
                                                    <CheckCircle2 size={16} style={{ marginRight: '4px' }} />
                                                    Fully Funded
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={styles.dateBadge}>
                                                        {campaign.deadline
                                                            ? `Ends: ${new Date(campaign.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                                                            : (campaign.date || 'Ongoing')}
                                                    </div>
                                                    <div style={styles.daysBadge}>
                                                        {campaign.deadline
                                                            ? (() => {
                                                                const diffTime = new Date(campaign.deadline) - new Date();
                                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                                return diffDays > 0 ? `${diffDays} days left` : 'Ended';
                                                            })()
                                                            : (campaign.daysLeft ? `${campaign.daysLeft} days left` : 'Ongoing')}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={styles.emptyState}>
                            <Search size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                            <h3 style={styles.emptyTitle}>No campaigns found</h3>
                            <p style={styles.emptyText}>We couldn't find any campaigns matching your current filter or search criteria.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveFilter('Recent');
                                    setCurrentPage(1);
                                }}
                                style={styles.resetBtn}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
                {filteredCampaigns.length > itemsPerPage && (
                    <div style={styles.pagination}>
                        <button
                            style={{ ...styles.pagBtn, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                style={{
                                    ...styles.pagBtn,
                                    ...(currentPage === i + 1 ? styles.activePagBtn : {})
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            style={{ ...styles.pagBtn, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'default' : 'pointer' }}
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {/* Verified Organizations Section */}
                <div style={styles.verifiedSection}>
                    <h2 style={styles.verifiedTitle}>Be a part of Verified organizations</h2>
                    <div style={{ ...styles.orgLogos, gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)' }}>
                        <div
                            style={{ ...styles.orgLogoWrapper, cursor: 'pointer' }}
                            onClick={() => navigate('/campaign/akshay-society')}
                        >
                            <img src={orgAkshay} alt="Akshay Society" style={styles.orgLogo} />
                        </div>
                        <div
                            style={{ ...styles.orgLogoWrapper, cursor: 'pointer' }}
                            onClick={() => navigate('/campaign/keithston-foundation')}
                        >
                            <img src={orgKeithston} alt="Keithston Foundation" style={styles.orgLogo} />
                        </div>
                        <div
                            style={{ ...styles.orgLogoWrapper, cursor: 'pointer' }}
                            onClick={() => navigate('/campaign/smile-foundation')}
                        >
                            <img src={orgSmile} alt="Smile Foundation" style={styles.orgLogo} />
                        </div>
                        <div
                            style={{ ...styles.orgLogoWrapper, cursor: 'pointer' }}
                            onClick={() => navigate('/campaign/lotus-born-foundation')}
                        >
                            <img src={orgLotus} alt="Lotus Born Foundation" style={styles.orgLogo} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#f8fafc' },
    container: { paddingTop: '100px', paddingBottom: '4rem' },
    headerBox: { backgroundColor: '#D6E6FF', borderRadius: '20px', padding: '2.5rem', marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
    headerContent: { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', textAlign: 'left' },
    headerLogo: { height: '60px' },
    headerTitle: { fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: 0 },
    headerSubtitle: { fontSize: '1.1rem', color: '#475569', margin: 0, fontStyle: 'italic' },
    searchBar: { width: '100%', maxWidth: '500px', backgroundColor: '#fff', borderRadius: '50px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    searchInput: { border: 'none', outline: 'none', flex: 1, fontSize: '1rem', color: '#475569' },
    filterTabs: { display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' },
    filterBtn: { padding: '0.5rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: 'transparent', color: '#475569', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
    activeFilterBtn: { backgroundColor: '#fff', color: '#1e293b', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' },
    emptyStateWrapper: { display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '4rem' },
    emptyState: {
        padding: '4rem 2rem',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    emptyTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' },
    emptyText: { color: '#64748b', marginBottom: '2rem', lineHeight: '1.5' },
    resetBtn: {
        backgroundColor: '#4F96FF',
        color: '#fff',
        border: 'none',
        padding: '0.75rem 2rem',
        borderRadius: '50px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(30, 41, 59, 0.2)'
    },
    card: { backgroundColor: '#f1f5f9', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' },
    completedCard: { backgroundColor: '#dcfce7', border: '2px solid #10b981' },
    imageWrapper: { height: '200px', width: '100%', padding: '1.25rem', position: 'relative' },
    completedOverlayBadge: {
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
        backgroundColor: '#10b981',
        color: '#fff',
        padding: '0.4rem 0.8rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: '600',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    cardImage: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' },
    cardContent: { padding: '0 1.25rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    cardTitle: { fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', textAlign: 'center', marginBottom: '0.25rem' },
    progressContainer: { width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' },
    progressBar: { height: '100%', borderRadius: '3px' },
    statsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    statItem: { display: 'flex', flexDirection: 'column' },
    statLabel: { fontSize: '0.8rem', fontWeight: '600', color: '#475569' },
    statSublabel: { fontSize: '0.75rem', color: '#94a3b8' },
    contributors: { display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#64748b', justifyContent: 'flex-end' },
    rating: { display: 'flex', gap: '1px', marginTop: '0.1rem', justifyContent: 'flex-end' },
    cardFooter: { display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.25rem' },
    dateBadge: { backgroundColor: '#fff', padding: '0.2rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', color: '#475569', border: '1px solid #e2e8f0' },
    daysBadge: { backgroundColor: '#Fca5a5', padding: '0.2rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', color: '#fff' },
    completedBadge: { backgroundColor: '#10b981', padding: '0.2rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', color: '#fff', fontWeight: '600' },
    completedFooterBadge: {
        backgroundColor: '#10b981',
        color: '#fff',
        padding: '0.4rem 1rem',
        borderRadius: '50px',
        fontSize: '0.8rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '4rem' },
    pagBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: 'none', backgroundColor: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' },
    activePagBtn: { backgroundColor: '#64748b', color: '#fff', borderRadius: '4px', width: '32px', height: '32px', justifyContent: 'center', padding: 0 },
    verifiedSection: { backgroundColor: '#fff', borderRadius: '20px', padding: '3rem', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '3rem' },
    verifiedTitle: { fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '2.5rem' },
    orgLogos: { display: 'grid', gap: '2rem', alignItems: 'center', justifyContent: 'center' },
    orgLogoWrapper: {
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        padding: '2rem 1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '120px',
        border: '1px solid #e2e8f0'
    },
    orgLogo: {
        maxWidth: '100%',
        maxHeight: '100px',
        width: 'auto',
        height: 'auto',
        objectFit: 'contain'
    }
};

export default Campaigns;

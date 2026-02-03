import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    History,
    Trophy,
    Clock,
    Edit,
    TrendingUp,
    Flag,
    Medal,
    ArrowUpRight,
    CheckCircle2,
    Users,
    Star
} from 'lucide-react';
import logo from '../assets/logo.png';

const DonorDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Overview');

    // Use logged in user info or fallback to mock Alicia (from image)
    const displayName = user?.name || "Alicia Johns";
    const displayEmail = user?.email || "alicia.johns@gmail.com";

    const sidebarItems = [
        { id: 'Overview', icon: <Home size={20} />, label: 'Overview' },
        { id: 'My Campaigns', icon: <History size={20} />, label: 'My Campaigns' },
        { id: 'Achievements', icon: <Trophy size={20} />, label: 'Achievements' },
        { id: 'Recent Donations', icon: <Clock size={20} />, label: 'Recent Donations' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewView name={displayName.split(' ')[0]} />;
            case 'My Campaigns':
                return <MyCampaignsView />;
            case 'Achievements':
                return <AchievementsView />;
            case 'Recent Donations':
                return <RecentDonationsView />;
            default:
                return <OverviewView name={displayName.split(' ')[0]} />;
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div className="container" style={styles.container}>
                <div style={styles.dashboardCard}>
                    {/* Sidebar */}
                    <div style={styles.sidebar}>
                        <div style={styles.profileSection}>
                            <img src={logo} alt="KindCents" style={styles.logoSmall} />
                            <div style={styles.avatarContainer}>
                                <div style={styles.avatar}>
                                    <Users size={40} color="#64748b" />
                                </div>
                            </div>
                            <div style={styles.profileInfo}>
                                <div style={styles.nameRow}>
                                    <strong style={styles.profileName}>{displayName}</strong>
                                    <button style={styles.editBtn}><Edit size={14} /></button>
                                </div>
                                <p style={styles.profileEmail}>{displayEmail}</p>
                            </div>
                        </div>

                        <nav style={styles.sidebarNav}>
                            {sidebarItems.map(item => (
                                <button
                                    key={item.id}
                                    style={{
                                        ...styles.navItem,
                                        ...(activeTab === item.id ? styles.activeNavItem : {})
                                    }}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div style={styles.mainContent}>
                        {renderTabContent()}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// --- Sub-Views ---

const OverviewView = ({ name }) => (
    <div style={styles.tabView}>
        <div style={styles.welcomeHeader}>
            <h2 style={styles.welcomeTitle}>Welcome back, {name}!</h2>
            <p style={styles.welcomeSub}>Here's how you're making a difference.</p>
        </div>

        <div style={styles.statsGrid}>
            <div style={styles.statsCard}>
                <div style={styles.statsIconRow}>
                    <div style={styles.statsIconCircle}>
                        <img src="https://img.icons8.com/isometric/50/coins.png" alt="coins" style={{ width: 50 }} />
                    </div>
                    <div style={styles.statsTrend}><TrendingUp size={14} /> +12%</div>
                </div>
                <p style={styles.statsLabel}>Total Donated</p>
                <h3 style={styles.statsValue}>Rs. 155,000</h3>
            </div>

            <div style={styles.statsCard}>
                <div style={styles.statsIconRow}>
                    <div style={styles.statsIconCircle}>
                        <Flag size={40} color="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                    </div>
                </div>
                <p style={styles.statsLabel}>Campaigns Supported</p>
                <h3 style={styles.statsValue}>5</h3>
            </div>

            <div style={styles.statsCard}>
                <div style={styles.statsIconRow}>
                    <div style={styles.statsIconCircle}>
                        <div style={styles.heartImpactIcon}>
                            <img src="https://img.icons8.com/isometric/50/family.png" alt="impact" style={{ width: 50 }} />
                        </div>
                    </div>
                    <div style={styles.statsTrend}><TrendingUp size={14} /> +25%</div>
                </div>
                <p style={styles.statsLabel}>Lives Impacted</p>
                <h3 style={styles.statsValue}>100</h3>
            </div>

            <div style={styles.statsCard}>
                <div style={styles.statsIconRow}>
                    <div style={styles.statsIconCircle}>
                        <Medal size={40} color="#2563eb" />
                    </div>
                </div>
                <p style={styles.statsLabel}>Badges Earned</p>
                <h3 style={styles.statsValue}>3</h3>
            </div>
        </div>
    </div>
);

const MyCampaignsView = () => {
    const campaigns = [
        { id: 1, title: "Help Ayaan's Surgery", type: "Individual", image: logo, raised: 450000, goal: 1000000, donation: 40000, rating: 4 },
        { id: 2, title: "Orphan Care Essentials", type: "NGO", image: logo, raised: 50000, goal: 70000, donation: 35000, rating: 3 },
        { id: 3, title: "Medical Aid for Mrs. Perera", type: "Individual", image: logo, raised: 80000, goal: 80000, donation: 30000, rating: 4 },
        { id: 4, title: "Rebuild Emma's House", type: "NGO", image: logo, raised: 100000, goal: 100000, donation: 25000, rating: 4 },
    ];

    return (
        <div style={styles.tabView}>
            <div style={styles.welcomeHeader}>
                <h2 style={styles.welcomeTitle}>My Campaigns</h2>
                <p style={styles.welcomeSub}>Your contributions, making a difference one campaign at a time.</p>
            </div>

            <div style={styles.campaignListGrid}>
                {campaigns.map(c => (
                    <div key={c.id} style={styles.compactCampaignCard}>
                        <div style={styles.compactImageWrapper}>
                            <img src={c.image} alt={c.title} style={styles.compactImage} />
                            <span style={styles.compactTypeBadge}>{c.type}</span>
                        </div>
                        <div style={styles.compactContent}>
                            <div style={styles.compactHeader}>
                                <h4 style={styles.compactTitle}>{c.title}</h4>
                                <div style={styles.compactRating}>
                                    {[...Array(c.rating)].map((_, i) => <Star key={i} size={12} fill="#fbbf24" color="#fbbf24" />)}
                                    {[...Array(5 - c.rating)].map((_, i) => <Star key={i} size={12} color="#cbd5e1" />)}
                                </div>
                            </div>
                            <div style={styles.compactProgress}>
                                <div style={styles.compactProgressBarContainer}>
                                    <div style={{ ...styles.compactProgressBar, width: `${(c.raised / c.goal) * 100}%` }} />
                                </div>
                                <div style={styles.compactProgressLabels}>
                                    <span>Rs. {c.raised.toLocaleString()}</span>
                                    <span>of Rs. {c.goal.toLocaleString()}</span>
                                </div>
                            </div>
                            <div style={styles.myDonationRow}>
                                <span style={styles.donationIcon}><img src="https://img.icons8.com/fluency/48/heart-with-pulse.png" alt="heart" style={{ width: 14 }} /> Your donation</span>
                                <span style={styles.donationAmount}>Rs. {c.donation.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.pagination}>
                <button style={styles.pagBtn}>← Previous</button>
                <button style={{ ...styles.pagBtn, ...styles.activePagBtn }}>1</button>
                <button style={styles.pagBtn}>2</button>
                <button style={styles.pagBtn}>Next →</button>
            </div>
        </div>
    );
};

const AchievementsView = () => {
    const badges = [
        { title: "First Step", desc: "Made your first charitable donation!", icon: "https://img.icons8.com/fluency/96/ribbon--v1.png", unlocked: true },
        { title: "Kind Heart", desc: "Supported 3 different campaigns", icon: "https://img.icons8.com/fluency/96/pink-heart.png", unlocked: true },
        { title: "Life Changer", desc: "Impacted 50+ lives through your donations", icon: "https://img.icons8.com/fluency/96/hands-clasping.png", unlocked: true },
        { title: "Community Hero", desc: "Donated over LKR 100,000 in total", icon: "https://img.icons8.com/fluency/96/military-medal.png", unlocked: true },
        { title: "Hope Bringer", desc: "Fully funded an entire campaign", icon: "https://img.icons8.com/fluency/96/security-shield-green.png", unlocked: false, progress: 0, target: 1 },
        { title: "Golden Giver", desc: "Supported 10+ campaigns", icon: "https://img.icons8.com/fluency/96/award-star.png", unlocked: false, progress: 5, target: 10 },
    ];

    return (
        <div style={styles.tabView}>
            <div style={styles.welcomeHeader}>
                <h2 style={styles.welcomeTitle}>Achievements</h2>
                <p style={styles.welcomeSub}>Unlock badges by reaching donation milestones.</p>
            </div>

            <div style={styles.badgeGrid}>
                {badges.map((badge, i) => (
                    <div key={i} style={{ ...styles.badgeCard, ...(badge.unlocked ? {} : styles.lockedBadge) }}>
                        <img src={badge.icon} alt={badge.title} style={styles.badgeIcon} />
                        <h4 style={styles.badgeTitle}>{badge.title}</h4>
                        <p style={styles.badgeDesc}>{badge.desc}</p>
                        {badge.unlocked ? (
                            <span style={styles.unlockedTag}>Unlocked <CheckCircle2 size={12} /></span>
                        ) : (
                            <div style={styles.badgeProgressContainer}>
                                <div style={styles.badgeProgressHeader}>
                                    <span>{badge.progress}</span>
                                    <span>{badge.target}</span>
                                </div>
                                <div style={styles.badgeProgressBar}>
                                    <div style={{ ...styles.badgeProgressFill, width: `${(badge.progress / badge.target) * 100}%` }} />
                                </div>
                            </div>
                        )}
                        {!badge.unlocked && <div style={styles.lockIcon}><History size={24} color="#94a3b8" /></div>}
                    </div>
                ))}
            </div>

            <div style={styles.pagination}>
                <button style={styles.pagBtn}>← Previous</button>
                <button style={{ ...styles.pagBtn, ...styles.activePagBtn }}>1</button>
                <button style={styles.pagBtn}>2</button>
                <button style={styles.pagBtn}>Next →</button>
            </div>
        </div>
    );
};

const RecentDonationsView = () => {
    const donations = [
        { title: "Help Ayaan's Surgery", date: "Jan 14, 2026", amount: 40000, status: "Pending" },
        { title: "Orphan Care Essentials", date: "Jan 10, 2026", amount: 35000, status: "Pending" },
        { title: "Medical Aid for Mrs. Perera", date: "Jan 5, 2026", amount: 30000, status: "Completed" },
        { title: "Rebuild Emma's Home", date: "Dec 31, 2025", amount: 25000, status: "Completed" },
        { title: "Books for Bright Futures", date: "Dec 24, 2025", amount: 25000, status: "Completed" },
    ];

    return (
        <div style={styles.tabView}>
            <div style={styles.welcomeHeader}>
                <h2 style={styles.welcomeTitle}>Recent Donations</h2>
            </div>

            <div style={styles.historyCard}>
                <div style={styles.historyList}>
                    {donations.map((d, i) => (
                        <div key={i} style={styles.historyItem}>
                            <div style={styles.historyIconCircle}><ArrowUpRight size={20} color="#10b981" /></div>
                            <div style={styles.historyInfo}>
                                <strong style={styles.historyTitle}>{d.title}</strong>
                                <p style={styles.historyDate}>{d.date}</p>
                            </div>
                            <div style={styles.historyRight}>
                                <strong style={styles.historyAmount}>Rs. {d.amount.toLocaleString()}</strong>
                                <span style={{
                                    ...styles.statusTag,
                                    color: d.status === 'Completed' ? '#10b981' : '#f59e0b'
                                }}>{d.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.pagination}>
                <button style={styles.pagBtn}>← Previous</button>
                <button style={{ ...styles.pagBtn, ...styles.activePagBtn }}>1</button>
                <button style={styles.pagBtn}>Next →</button>
            </div>
        </div>
    );
};

// --- Styles ---

const styles = {
    page: {
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
    },
    container: {
        paddingTop: '100px',
        paddingBottom: '4rem',
    },
    dashboardCard: {
        backgroundColor: '#fff',
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'flex',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        minHeight: '600px',
        border: '1px solid #e2e8f0',
    },
    sidebar: {
        width: '280px',
        backgroundColor: '#E0EEFF',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
    },
    logoSmall: {
        height: '40px',
        marginBottom: '1.5rem',
    },
    profileSection: {
        display: 'flex',
        flexDirection: 'column',
    },
    avatarContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1rem',
    },
    avatar: {
        width: '80px',
        height: '80px',
        backgroundColor: '#94a3b8',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '4px solid #fff',
    },
    profileInfo: {
        textAlign: 'center',
    },
    nameRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    profileName: {
        fontSize: '1.1rem',
        color: '#1e293b',
        fontWeight: '700',
    },
    editBtn: {
        background: 'none',
        border: 'none',
        color: '#64748b',
        cursor: 'pointer',
        padding: 0,
    },
    profileEmail: {
        fontSize: '0.85rem',
        color: '#64748b',
        marginTop: '0.25rem',
    },
    sidebarNav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#475569',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
    },
    activeNavItem: {
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        color: '#1e293b',
        fontWeight: '600',
    },
    mainContent: {
        flex: 1,
        padding: '3rem',
        backgroundColor: '#fff',
    },
    tabView: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    welcomeHeader: {
        marginBottom: '1rem',
    },
    welcomeTitle: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0,
    },
    welcomeSub: {
        fontSize: '1.1rem',
        color: '#64748b',
        marginTop: '0.5rem',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2rem',
    },
    statsCard: {
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    statsIconRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.5rem',
    },
    statsIconCircle: {
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsTrend: {
        backgroundColor: '#dcfce7',
        color: '#16a34a',
        padding: '0.25rem 0.75rem',
        borderRadius: '50px',
        fontSize: '0.85rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
    },
    statsLabel: {
        fontSize: '0.9rem',
        fontWeight: '700',
        color: '#64748b',
        margin: 0,
    },
    statsValue: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#1e293b',
        margin: 0,
    },
    campaignListGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
    },
    compactCampaignCard: {
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    compactImageWrapper: {
        position: 'relative',
        height: '140px',
    },
    compactImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    compactTypeBadge: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '0.25rem 0.75rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#475569',
    },
    compactContent: {
        padding: '1.25rem',
    },
    compactHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.75rem',
    },
    compactTitle: {
        fontSize: '0.95rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0,
        flex: 1,
    },
    compactRating: {
        display: 'flex',
        gap: '2px',
    },
    compactProgress: {
        marginBottom: '1rem',
    },
    compactProgressBarContainer: {
        width: '100%',
        height: '6px',
        backgroundColor: '#f1f5f9',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '0.5rem',
    },
    compactProgressBar: {
        height: '100%',
        backgroundColor: '#10b981',
    },
    compactProgressLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#64748b',
    },
    myDonationRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '0.75rem',
        borderTop: '1px solid #f1f5f9',
    },
    donationIcon: {
        color: '#ef4444',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    donationAmount: {
        fontSize: '0.9rem',
        fontWeight: '700',
        color: '#10b981',
    },
    badgeGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
    },
    badgeCard: {
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative',
    },
    lockedBadge: {
        backgroundColor: '#f1f5f9',
        borderStyle: 'dashed',
    },
    badgeIcon: {
        width: '64px',
        height: '64px',
        marginBottom: '0.5rem',
    },
    badgeTitle: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0,
    },
    badgeDesc: {
        fontSize: '0.8rem',
        color: '#64748b',
        lineHeight: '1.4',
        margin: 0,
    },
    unlockedTag: {
        color: '#10b981',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '0.5rem',
    },
    lockIcon: {
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
    },
    badgeProgressContainer: {
        width: '100%',
        marginTop: 'auto',
        paddingTop: '1rem',
    },
    badgeProgressHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.7rem',
        color: '#94a3b8',
        marginBottom: '4px',
    },
    badgeProgressBar: {
        width: '100%',
        height: '4px',
        backgroundColor: '#e2e8f0',
        borderRadius: '2px',
    },
    badgeProgressFill: {
        height: '100%',
        backgroundColor: '#10b981',
        borderRadius: '2px',
    },
    historyCard: {
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '0 1.5rem',
    },
    historyList: {
        display: 'flex',
        flexDirection: 'column',
    },
    historyItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.5rem 0',
        borderBottom: '1px solid #f1f5f9',
    },
    historyIconCircle: {
        width: '40px',
        height: '40px',
        backgroundColor: '#f0fdf4',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyInfo: {
        flex: 1,
    },
    historyTitle: {
        fontSize: '1.05rem',
        color: '#1e293b',
        fontWeight: '600',
    },
    historyDate: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        margin: '2px 0 0 0',
    },
    historyRight: {
        textAlign: 'right',
    },
    historyAmount: {
        display: 'block',
        fontSize: '1.1rem',
        color: '#1e293b',
        fontWeight: '700',
    },
    statusTag: {
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '1rem',
    },
    pagBtn: {
        padding: '0.5rem 1rem',
        border: '1px solid #e2e8f0',
        backgroundColor: '#fff',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#64748b',
        cursor: 'pointer',
    },
    activePagBtn: {
        backgroundColor: '#1e293b',
        color: '#fff',
        border: 'none',
    },
    heartImpactIcon: {
        // Placeholder for the family/heart isometric icon
    }
};

export default DonorDashboard;

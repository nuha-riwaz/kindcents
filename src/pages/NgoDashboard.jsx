import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    Target,
    PlusCircle,
    Edit,
    Users,
    TrendingUp,
    DollarSign,
    Heart,
    ChevronRight,
    Clock
} from 'lucide-react';
import logo from '../assets/logo.png';
import projectImage from '../assets/project-emma.jpg';

const NgoDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');

    // Mock data for Smile Foundation (from images)
    const ngoInfo = {
        name: "Smile Foundation",
        email: "smile.fnd@gmail.com",
        avatar: logo // Using logo as avatar placeholder
    };

    const navItems = [
        { id: 'Overview', icon: <Home size={20} />, label: 'Overview' },
        { id: 'My Active Campaigns', icon: <Target size={20} />, label: 'My Active Campaigns' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewView name={ngoInfo.name} />;
            case 'My Active Campaigns':
                return <MyCampaignsView />;
            default:
                return <OverviewView name={ngoInfo.name} />;
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
                            <div style={styles.logoContainer}>
                                <img src={logo} alt="KindCents" style={styles.sidebarLogo} />
                            </div>
                            <div style={styles.avatarWrapper}>
                                <div style={styles.avatar}>
                                    <Users size={30} color="#64748b" />
                                </div>
                            </div>
                            <div style={styles.profileInfo}>
                                <div style={styles.nameRow}>
                                    <strong style={styles.profileName}>{ngoInfo.name}</strong>
                                    <button style={styles.editBtn}><Edit size={14} /></button>
                                </div>
                                <p style={styles.profileEmail}>{ngoInfo.email}</p>
                            </div>
                        </div>

                        <nav style={styles.sidebarNav}>
                            {navItems.map(item => (
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

                        <button
                            style={styles.newCampaignBtn}
                            onClick={() => navigate('/create-campaign')}
                        >
                            <PlusCircle size={20} />
                            <span>New Campaign</span>
                        </button>
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
        <div style={styles.header}>
            <h2 style={styles.title}>Welcome back, {name}!</h2>
            <p style={styles.subTitle}>Track your fundraising progress and manage your campaigns.</p>
        </div>

        <div style={styles.statsGrid}>
            <div style={styles.statsCard}>
                <div style={styles.statsHeader}>
                    <div style={styles.statsLabelGroup}>
                        <p style={styles.statsLabel}>Total Raised</p>
                        <h3 style={styles.statsValue}>Rs. 450,000</h3>
                        <p style={styles.statsTrendGreen}>+25% from last month</p>
                    </div>
                    <div style={{ ...styles.statsIconCircle, backgroundColor: '#D6E6FF' }}>
                        <DollarSign size={24} color="#2563EB" />
                    </div>
                </div>
            </div>

            <div style={styles.statsCard}>
                <div style={styles.statsHeader}>
                    <div style={styles.statsLabelGroup}>
                        <p style={styles.statsLabel}>Total Supporters</p>
                        <h3 style={styles.statsValue}>34</h3>
                        <p style={styles.statsTrendGreen}>+7 new this week</p>
                    </div>
                    <div style={{ ...styles.statsIconCircle, backgroundColor: '#f1f5f9' }}>
                        <Users size={24} color="#64748b" />
                    </div>
                </div>
            </div>

            <div style={styles.statsCard}>
                <div style={styles.statsHeader}>
                    <div style={styles.statsLabelGroup}>
                        <p style={styles.statsLabel}>Active Campaigns</p>
                        <h3 style={styles.statsValue}>1</h3>
                        <p style={styles.statsTrendGray}>1 active campaign running</p>
                    </div>
                    <div style={{ ...styles.statsIconCircle, backgroundColor: '#D1FAE5' }}>
                        <TrendingUp size={24} color="#10B981" />
                    </div>
                </div>
            </div>

            <div style={styles.statsCard}>
                <div style={styles.statsHeader}>
                    <div style={styles.statsLabelGroup}>
                        <p style={styles.statsLabel}>Avg. Donation</p>
                        <h3 style={styles.statsValue}>Rs. 13,235</h3>
                        <p style={styles.statsTrendGreen}>+Rs. 90,000 from last month</p>
                    </div>
                    <div style={{ ...styles.statsIconCircle, backgroundColor: '#DBEAFE' }}>
                        <Heart size={24} color="#2563EB" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MyCampaignsView = () => {
    const campaign = {
        title: "Community developement",
        subtitle: "Education, Healthcare, Child and Women Development",
        raised: 2150000,
        goal: 5000000,
        donors: 34,
        daysLeft: 9,
        image: projectImage,
        status: "Live"
    };

    return (
        <div style={styles.tabView}>
            <div style={styles.header}>
                <h2 style={styles.title}>My Active Campaigns</h2>
                <p style={styles.subTitle}>Real-time tracking of donations coming in</p>
            </div>

            <div style={styles.campaignList}>
                <div style={styles.campaignCard}>
                    <div style={styles.campaignImageWrapper}>
                        <img src={campaign.image} alt={campaign.title} style={styles.campaignImage} />
                        <span style={styles.statusBadge}>
                            <div style={styles.statusDot}></div>
                            {campaign.status}
                        </span>
                    </div>
                    <div style={styles.campaignContent}>
                        <h4 style={styles.campaignTitle}>{campaign.title}</h4>
                        <p style={styles.campaignSubtitle}>{campaign.subtitle}</p>

                        <div style={styles.progressSection}>
                            <div style={styles.progressLabelRow}>
                                <span style={styles.raisedValue}>Rs. {campaign.raised.toLocaleString()}</span>
                                <span style={styles.goalValue}>/ Rs. {campaign.goal.toLocaleString()}</span>
                                <span style={styles.percentageText}><TrendingUp size={12} /> {(campaign.raised / campaign.goal * 100).toFixed(0)}%</span>
                            </div>
                            <div style={styles.progressBarContainer}>
                                <div style={{ ...styles.progressBar, width: `${(campaign.raised / campaign.goal) * 100}%` }} />
                            </div>
                        </div>

                        <div style={styles.campaignFooter}>
                            <div style={styles.footerStat}>
                                <Users size={14} color="#64748b" />
                                <span>{campaign.donors} donors</span>
                            </div>
                            <div style={styles.footerStat}>
                                <Clock size={14} color="#64748b" />
                                <span>{campaign.daysLeft} days left</span>
                            </div>
                        </div>
                    </div>
                </div>
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
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        minHeight: '650px',
        border: '1px solid #e2e8f0',
    },
    sidebar: {
        width: '280px',
        backgroundColor: '#E0EEFF',
        padding: '2rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    profileSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: '1.5rem',
    },
    sidebarLogo: {
        height: '60px',
    },
    avatarWrapper: {
        marginBottom: '1rem',
    },
    avatar: {
        width: '70px',
        height: '70px',
        backgroundColor: '#94a3b8',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid #fff',
    },
    profileInfo: {
        textAlign: 'center',
    },
    nameRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
    },
    profileName: {
        fontSize: '1rem',
        color: '#1e293b',
        fontWeight: '700',
    },
    editBtn: {
        background: 'none',
        border: 'none',
        color: '#64748b',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
    },
    profileEmail: {
        fontSize: '0.8rem',
        color: '#64748b',
        marginTop: '0.1rem',
    },
    sidebarNav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#475569',
        fontSize: '0.95rem',
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
    newCampaignBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '0.85rem',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#2563EB',
        color: '#fff',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: 'auto',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
    },
    mainContent: {
        flex: 1,
        padding: '3rem',
        backgroundColor: '#fff',
    },
    tabView: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
    },
    header: {
        marginBottom: '0.5rem',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#1e293b',
        margin: 0,
    },
    subTitle: {
        fontSize: '1rem',
        color: '#64748b',
        marginTop: '0.5rem',
        fontStyle: 'italic',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
    },
    statsCard: {
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
    statsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statsLabelGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    statsLabel: {
        fontSize: '0.85rem',
        color: '#64748b',
        margin: 0,
        fontWeight: '500',
    },
    statsValue: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0.25rem 0',
    },
    statsTrendGreen: {
        fontSize: '0.75rem',
        color: '#10B981',
        fontWeight: '600',
        margin: 0,
    },
    statsTrendGray: {
        fontSize: '0.75rem',
        color: '#64748b',
        margin: 0,
    },
    statsIconCircle: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    campaignList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    campaignCard: {
        width: '320px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    },
    campaignImageWrapper: {
        position: 'relative',
        height: '180px',
    },
    campaignImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    statusBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '0.25rem 0.75rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    statusDot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#10B981',
        borderRadius: '50%',
    },
    campaignContent: {
        padding: '1.25rem',
    },
    campaignTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0,
    },
    campaignSubtitle: {
        fontSize: '0.85rem',
        color: '#64748b',
        marginTop: '0.25rem',
        lineHeight: '1.4',
    },
    progressSection: {
        marginTop: '1.5rem',
    },
    progressLabelRow: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.25rem',
        marginBottom: '0.5rem',
    },
    raisedValue: {
        fontSize: '0.95rem',
        fontWeight: '700',
        color: '#2563EB',
    },
    goalValue: {
        fontSize: '0.8rem',
        color: '#64748b',
    },
    percentageText: {
        marginLeft: 'auto',
        fontSize: '0.8rem',
        color: '#10B981',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
    },
    progressBarContainer: {
        height: '8px',
        backgroundColor: '#f1f5f9',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#2563EB',
        borderRadius: '4px',
    },
    campaignFooter: {
        marginTop: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '1rem',
        borderTop: '1px solid #f1f5f9',
    },
    footerStat: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: '#64748b',
    }
};

export default NgoDashboard;

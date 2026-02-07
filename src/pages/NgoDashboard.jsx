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
    Clock,
    FileCheck,
    Check,
    X,
    Camera,
    Menu
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import logo from '../assets/logo.png';
import projectImage from '../assets/project-emma.jpg';
import orgAkshay from '../assets/org-akshay.jpg';
import orgKeithston from '../assets/org-keithston.jpg';
import orgSmile from '../assets/org-smile.jpg';
import orgLotus from '../assets/org-lotus.jpg';

// Image mapping to resolve Firestore strings to local assets
const imageMap = {
    orgAkshay,
    orgKeithston,
    orgSmile,
    orgLotus,
    logo
};

import ExpenseUploadModal from '../components/ExpenseUploadModal';

const NgoDashboard = () => {
    const { user, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const { campaigns } = useCampaigns();
    const [activeTab, setActiveTab] = useState('Overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Expense Modal State
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);

    const openExpenseModal = (campaignId) => {
        setSelectedCampaignId(campaignId);
        setIsExpenseModalOpen(true);
    };

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close sidebar when clicking outside on mobile
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSidebarOpen && isMobile && !event.target.closest('.admin-sidebar-ngo') && !event.target.closest('.sidebar-toggle')) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen, isMobile]);

    // Profile Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = React.useRef(null);

    // Initial load of user data
    React.useEffect(() => {
        if (user) {
            setEditName(user.name || '');
            setPreviewImage(user.photoURL || null);
        }
    }, [user]);

    const handleEditClick = () => {
        setIsEditing(true);
        setEditName(user.name || '');
        setPreviewImage(user.photoURL || null);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditName(user.name || '');
        setPreviewImage(user.photoURL || null);
    };

    const handleSaveClick = async () => {
        try {
            await updateUserProfile({
                name: editName,
                photoURL: previewImage
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("Failed to save changes.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Convert to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Filter campaigns for this NGO
    // We match by name for seeded data, but we should ideally use user.uid
    const myCampaigns = campaigns.filter(c =>
        (c.userId === user?.uid) ||
        (c.organizer?.name?.toLowerCase() === user?.name?.toLowerCase())
    );

    const navItems = [
        { id: 'Overview', icon: <Home size={20} />, label: 'Overview' },
        { id: 'My Active Campaigns', icon: <Target size={20} />, label: 'My Active Campaigns' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewView name={user?.name || "NGO"} campaigns={myCampaigns} isMobile={isMobile} onNavigate={setActiveTab} />;
            case 'My Active Campaigns':
                return <MyCampaignsView campaigns={myCampaigns} isMobile={isMobile} onUploadProof={openExpenseModal} />;
            default:
                return <OverviewView name={user?.name || "NGO"} campaigns={myCampaigns} isMobile={isMobile} />;
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div className="container" style={{ ...styles.container, paddingTop: isMobile ? '80px' : '100px' }}>
                <div style={{ ...styles.dashboardCard, flexDirection: isMobile ? 'column' : 'row' }}>
                    {/* ... (Sidebar code unchanged) ... */}

                    {/* Main Sidebar Content omitted for brevity in replace block, assuming it matches context */}

                    {/* Mobile Sidebar Toggle */}
                    {isMobile && (
                        <button
                            className="sidebar-toggle"
                            style={styles.sidebarToggle}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}

                    {/* Sidebar */}
                    <div
                        className={`admin-sidebar-ngo ${isSidebarOpen ? 'open' : ''}`}
                        style={{
                            ...styles.sidebar,
                            ...(isMobile ? (isSidebarOpen ? styles.mobileSidebarOpen : styles.mobileSidebarClosed) : {})
                        }}>
                        <div style={styles.profileSection}>
                            <div style={styles.logoContainer}>
                                <img src={logo} alt="KindCents" style={styles.sidebarLogo} />
                            </div>

                            {/* Avatar Section */}
                            <div style={styles.avatarWrapper}>
                                <div
                                    style={{
                                        ...styles.avatar,
                                        cursor: isEditing ? 'pointer' : 'default',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onClick={triggerFileInput}
                                >
                                    {previewImage ? (
                                        <img src={previewImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Users size={30} color="#64748b" />
                                    )}

                                    {/* Camera Overlay for Edit Mode */}
                                    {isEditing && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '30%',
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Camera size={12} color="white" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Profile Info Section */}
                            <div style={styles.profileInfo}>
                                {isEditing ? (
                                    // Edit Mode Inputs
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            style={styles.editInput}
                                            placeholder="NGO Name"
                                        />
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <button onClick={handleSaveClick} style={styles.saveBtn}>
                                                <Check size={14} />
                                            </button>
                                            <button onClick={handleCancelClick} style={styles.cancelBtn}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div style={styles.nameRow}>
                                        <strong style={styles.profileName}>{user?.name}</strong>
                                        <button onClick={handleEditClick} style={styles.editBtn}>
                                            <Edit size={14} />
                                        </button>
                                    </div>
                                )}
                                <p style={styles.profileEmail}>{user?.email}</p>
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
                    <div style={{ ...styles.mainContent, padding: isMobile ? '1.5rem' : '3rem' }}>
                        {renderTabContent()}
                    </div>
                </div>
            </div>
            <Footer />

            <ExpenseUploadModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                campaignId={selectedCampaignId}
                userId={user?.uid}
            />
        </div>
    );
};

// --- Sub-Views ---

const OverviewView = ({ name, campaigns, isMobile, onNavigate }) => {
    const totalRaised = campaigns.reduce((sum, c) => sum + (c.raised || 0), 0);
    const totalContributors = campaigns.reduce((sum, c) => sum + (c.contributors || 0), 0);
    const activeCount = campaigns.filter(c => c.isActive).length;
    const avgDonation = totalContributors > 0 ? Math.round(totalRaised / totalContributors) : 0;

    return (
        <div style={styles.tabView}>
            <div style={styles.header}>
                <h2 style={{ ...styles.title, fontSize: isMobile ? '1.4rem' : '1.75rem' }}>Welcome back, {name}!</h2>
                <p style={styles.subTitle}>Track your fundraising progress and manage your campaigns.</p>
            </div>

            <div style={{ ...styles.statsGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)' }}>
                <div style={styles.statsCard}>
                    <div style={styles.statsHeader}>
                        <div style={styles.statsLabelGroup}>
                            <p style={styles.statsLabel}>Total Raised</p>
                            <h3 style={styles.statsValue}>Rs. {totalRaised.toLocaleString()}</h3>
                            <p style={styles.statsTrendGreen}>Platform verified total</p>
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
                            <h3 style={styles.statsValue}>{totalContributors}</h3>
                            <p style={styles.statsTrendGreen}>Unique contributors</p>
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
                            <h3 style={styles.statsValue}>{activeCount}</h3>
                            <p style={styles.statsTrendGray}>{activeCount} campaign{activeCount !== 1 ? 's' : ''} running</p>
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
                            <h3 style={styles.statsValue}>Rs. {avgDonation.toLocaleString()}</h3>
                            <p style={styles.statsTrendGreen}>Across all campaigns</p>
                        </div>
                        <div style={{ ...styles.statsIconCircle, backgroundColor: '#DBEAFE' }}>
                            <Heart size={24} color="#2563EB" />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                    onClick={() => onNavigate('My Active Campaigns')}
                    style={styles.newCampaignBtn}
                >
                    <TrendingUp size={20} /> Active Campaigns
                </button>
            </div>
        </div>
    );
};

const MyCampaignsView = ({ campaigns, isMobile, onUploadProof }) => {
    return (
        <div style={styles.tabView}>
            <div style={styles.header}>
                <h2 style={{ ...styles.title, fontSize: isMobile ? '1.4rem' : '1.75rem' }}>My Active Campaigns</h2>
                <p style={styles.subTitle}>Real-time tracking of donations coming in</p>
            </div>

            <div style={styles.campaignList}>
                {campaigns.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <FileCheck size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No active campaigns found.</p>
                    </div>
                ) : (
                    campaigns.map(campaign => (
                        <div key={campaign.id} style={{ ...styles.campaignCard, width: isMobile ? '100%' : '320px' }}>
                            <div style={styles.campaignImageWrapper}>
                                <img
                                    src={imageMap[campaign.image] || campaign.image || projectImage}
                                    alt={campaign.title}
                                    style={styles.campaignImage}
                                />
                                <span style={styles.statusBadge}>
                                    <div style={{ ...styles.statusDot, backgroundColor: campaign.isActive ? '#10B981' : '#f59e0b' }}></div>
                                    {campaign.isActive ? 'Live' : 'Pending'}
                                </span>
                            </div>
                            <div style={styles.campaignContent}>
                                <h4 style={styles.campaignTitle}>{campaign.title}</h4>
                                <p style={styles.campaignSubtitle}>{campaign.category}</p>

                                <div style={styles.progressSection}>
                                    <div style={styles.progressLabelRow}>
                                        <span style={styles.raisedValue}>Rs. {(campaign.raised || 0).toLocaleString()}</span>
                                        <span style={styles.goalValue}>/ Rs. {(campaign.goal || 0).toLocaleString()}</span>
                                        <span style={styles.percentageText}>
                                            <TrendingUp size={12} />
                                            {campaign.goal > 0 ? ((campaign.raised || 0) / campaign.goal * 100).toFixed(0) : 0}%
                                        </span>
                                    </div>
                                    <div style={styles.progressBarContainer}>
                                        <div style={{
                                            ...styles.progressBar,
                                            width: `${campaign.goal > 0 ? Math.min((campaign.raised || 0) / campaign.goal * 100, 100) : 0}%`
                                        }} />
                                    </div>
                                </div>

                                <div style={styles.campaignFooter}>
                                    <div style={styles.footerStat}>
                                        <Users size={14} color="#64748b" />
                                        <span>{campaign.contributors || 0} donors</span>
                                    </div>
                                    <div style={styles.footerStat}>
                                        <Clock size={14} color="#64748b" />
                                        <span>{campaign.daysLeft || 0} days left</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onUploadProof(campaign.id)}
                                    style={styles.uploadBtn}
                                >
                                    <FileCheck size={14} /> Upload Proof
                                </button>
                            </div>
                        </div>
                    ))
                )}
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
        transition: 'transform 0.3s ease-in-out',
        zIndex: 50
    },
    sidebarToggle: {
        position: 'fixed',
        top: '85px',
        left: '1rem',
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '0.5rem',
        zIndex: 60,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        cursor: 'pointer'
    },
    mobileSidebarOpen: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        transform: 'translateX(0)',
        borderRadius: 0,
        width: '80%',
    },
    mobileSidebarClosed: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        transform: 'translateX(-100%)',
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
    profileEmail: {
        fontSize: '0.8rem',
        color: '#64748b',
        marginTop: '0.1rem',
    },
    editBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        transition: 'background-color 0.2s',
        ':hover': { backgroundColor: '#f1f5f9' }
    },
    editInput: {
        width: '100%',
        padding: '4px 8px',
        fontSize: '1rem',
        fontWeight: '700',
        color: '#1e293b',
        border: '1px solid #cbd5e1',
        borderRadius: '4px',
        outline: 'none'
    },
    saveBtn: {
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '4px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelBtn: {
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '4px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
    },
    uploadBtn: {
        marginTop: '1rem',
        width: '100%',
        backgroundColor: '#2563EB',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '0.6rem',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'background 0.2s',
    },
    actionBtn: {
        border: '1px solid #cbd5e1',
        background: 'white',
        borderRadius: '8px',
        padding: '0.4rem 0.8rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#334155',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        marginLeft: 'auto'
    }
};

export default NgoDashboard;

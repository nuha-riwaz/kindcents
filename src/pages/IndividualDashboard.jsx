import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Heart,
    PlusCircle,
    Users,
    DollarSign,
    TrendingUp,
    Edit2,
    CheckCircle2,
    Save,
    X,
    Camera,
    User as UserIcon,
    Loader2
} from 'lucide-react';
import logo from '../assets/logo.png';
import projectEmma from '../assets/project-emma.jpg';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ayaanSurgery from '../assets/ayaan-surgery.png';
import projectArklow from '../assets/project-arklow.png';
import ruralMedical from '../assets/rural-medical.jpg';
import templeRenovation from '../assets/temple-renovation.png';
import orphanCare from '../assets/orphan-care.png';

const imageMap = {
    projectEmma,
    ayaanSurgery,
    projectArklow,
    ruralMedical,
    templeRenovation,
    orphanCare
};

const IndividualDashboard = () => {
    const { user, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef(null);

    const [realStats, setRealStats] = useState({
        totalRaised: 0,
        totalSupporters: 0,
        activeCampaigns: 0,
        avgDonation: 0,
        weeklySupporters: 0,
        raisedChange: '+Rs. 0 this month'
    });
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const campaignsRef = collection(db, 'campaigns');
                const q = query(campaignsRef, where('creatorId', '==', user.uid));
                const querySnapshot = await getDocs(q);

                let campaigns = [];
                let campaignIds = [];
                let totalRaised = 0;
                let totalSupporters = 0;
                let activeCount = 0;

                querySnapshot.docs.forEach(doc => {
                    const data = { id: doc.id, ...doc.data() };
                    campaigns.push(data);
                    campaignIds.push(doc.id);
                    totalRaised += data.raised || 0;
                    totalSupporters += data.contributors || 0;
                    if (data.status !== 'completed') activeCount++;
                });

                // Fetch donations to calculate change indicators
                let weeklySupporters = 0;
                let lastMonthRaised = 0;

                if (campaignIds.length > 0) {
                    const donationsRef = collection(db, 'donations');
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                    // Note: Firestore doesn't support 'in' with more than 10 IDs efficiently, 
                    // but for a single individual it's likely fine.
                    const donationsQ = query(donationsRef, where('campaignId', 'in', campaignIds.slice(0, 10)));
                    const donationsSnap = await getDocs(donationsQ);

                    donationsSnap.docs.forEach(doc => {
                        const data = doc.data();
                        const timestamp = data.timestamp?.toDate() || new Date(data.createdAt);

                        if (timestamp > sevenDaysAgo && data.status === 'Completed') {
                            weeklySupporters++;
                        }

                        if (timestamp > thirtyDaysAgo && data.status === 'Completed') {
                            lastMonthRaised += data.amount || 0;
                        }
                    });
                }

                const prevMonthTotal = totalRaised - lastMonthRaised;
                const raisedChange = prevMonthTotal > 0
                    ? `+${Math.round((lastMonthRaised / prevMonthTotal) * 100)}% from last month`
                    : `+Rs. ${lastMonthRaised.toLocaleString()} this month`;

                setUserCampaigns(campaigns);
                setRealStats({
                    totalRaised,
                    totalSupporters,
                    activeCampaigns: activeCount,
                    avgDonation: totalSupporters > 0 ? Math.floor(totalRaised / totalSupporters) : 0,
                    weeklySupporters,
                    raisedChange
                });
            } catch (error) {
                console.error("Error fetching individual dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const stats = [
        { label: 'Total Raised', value: `Rs. ${realStats.totalRaised.toLocaleString()}`, change: realStats.raisedChange, icon: <DollarSign size={24} color="#3b82f6" />, color: '#dbeafe' },
        { label: 'Total Supporters', value: realStats.totalSupporters, change: `+${realStats.weeklySupporters} new this week`, icon: <Users size={24} color="#6366f1" />, color: '#e0e7ff' },
        { label: 'Active Campaigns', value: realStats.activeCampaigns, change: `${realStats.activeCampaigns} active running`, icon: <TrendingUp size={24} color="#0ea5e9" />, color: '#e0f2fe' },
        { label: 'Avg. Donation', value: `Rs. ${realStats.avgDonation.toLocaleString()}`, change: `Based on ${realStats.totalSupporters} donors`, icon: <Heart size={24} color="#94a3b8" />, color: '#f1f5f9' },
    ];

    const handleImageClick = () => {
        if (isEditing) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            alert('Image too large! Please choose an image smaller than 1MB.');
            return;
        }

        setUploading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                try {
                    await updateUserProfile({ photoURL: base64String });
                    alert('Profile picture updated!');
                } catch (error) {
                    console.error("Error updating profile:", error);
                    alert(`Failed: ${error.message}`);
                }
                setUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error processing image:", error);
            setUploading(false);
        }
    };

    const saveProfile = async () => {
        try {
            await updateUserProfile({ name: newName });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />

            <div className="container" style={styles.container}>
                <div style={styles.dashboardWrapper}>
                    {/* Sidebar */}
                    <aside style={styles.sidebar}>
                        <div style={styles.profileSection}>
                            <img src={logo} alt="KindCents" style={styles.sideLogo} />
                            <div style={styles.avatarWrapper} onClick={handleImageClick}>
                                <div style={{
                                    ...styles.avatar,
                                    cursor: isEditing ? 'pointer' : 'default',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Users size={40} color="#64748b" />
                                    )}
                                    {isEditing && (
                                        <div style={styles.cameraOverlay}>
                                            <Camera size={20} color="white" />
                                        </div>
                                    )}
                                    {uploading && (
                                        <div style={styles.loaderOverlay}>
                                            <Loader2 size={24} color="white" className="animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div style={styles.userInfo}>
                                <div style={styles.nameRow}>
                                    {isEditing ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                style={styles.editInput}
                                                autoFocus
                                            />
                                            <button onClick={saveProfile} style={styles.iconBtn} title="Save">
                                                <Save size={16} color="#10b981" />
                                            </button>
                                            <button onClick={() => setIsEditing(false)} style={styles.iconBtn} title="Cancel">
                                                <X size={16} color="#ef4444" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 style={styles.userName}>{user?.name}</h3>
                                            <Edit2
                                                size={14}
                                                style={{ cursor: 'pointer', color: '#64748b' }}
                                                onClick={() => setIsEditing(true)}
                                            />
                                        </>
                                    )}
                                </div>
                                <p style={styles.userEmail}>{user?.email}</p>
                            </div>
                        </div>

                        <nav style={styles.sideNav}>
                            <button
                                onClick={() => setActiveTab('Overview')}
                                style={{
                                    ...styles.navBtn,
                                    ...(activeTab === 'Overview' ? styles.activeNavBtn : {})
                                }}
                            >
                                <LayoutDashboard size={20} /> Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('My Active Campaigns')}
                                style={{
                                    ...styles.navBtn,
                                    ...(activeTab === 'My Active Campaigns' ? styles.activeNavBtn : {})
                                }}
                            >
                                <TrendingUp size={20} /> My Active Campaigns
                            </button>
                        </nav>

                        <button
                            onClick={() => navigate('/create-campaign')}
                            style={styles.newCampaignBtn}
                        >
                            <PlusCircle size={20} /> New Campaign
                        </button>
                    </aside>

                    {/* Main Content */}
                    <main style={styles.mainContent}>
                        {activeTab === 'Overview' ? (
                            <div style={styles.tabContent}>
                                <div style={styles.welcomeSection}>
                                    <h1 style={styles.welcomeTitle}>Welcome back, {(user?.name || "Rashid").split(' ')[0]}!</h1>
                                    <p style={styles.welcomeSub}>Track your fundraising progress and manage your campaigns.</p>
                                </div>

                                <div style={styles.statsGrid}>
                                    {stats.map((stat, i) => (
                                        <div key={i} style={{
                                            ...styles.statCard,
                                            ...(stat.label === 'Total Raised' ? styles.activeStatCard : {})
                                        }}>
                                            <div style={styles.statInfo}>
                                                <p style={styles.statLabel}>{stat.label}</p>
                                                <h2 style={styles.statValue}>{stat.value}</h2>
                                                <p style={styles.statChange}>{stat.change}</p>
                                            </div>
                                            <div style={{ ...styles.statIconWrapper, backgroundColor: stat.color }}>
                                                {stat.icon}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={styles.tabContent}>
                                <div style={styles.welcomeSection}>
                                    <h1 style={styles.welcomeTitle}>My Active Campaigns</h1>
                                    <p style={styles.welcomeSub}>Real-time tracking of donations coming in</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                                    {userCampaigns.length > 0 ? userCampaigns.map((campaign) => {
                                        const progress = Math.min(100, Math.floor(((campaign.raised || 0) / (campaign.goal || 1)) * 100));
                                        return (
                                            <div key={campaign.id} style={styles.activeCampaignCard}>
                                                <div style={styles.campaignImageWrapper}>
                                                    <img src={imageMap[campaign.image] || projectEmma} alt={campaign.title} style={styles.campaignImage} />
                                                    <div style={styles.liveBadge}>
                                                        <div style={styles.pulseDot} /> {campaign.status === 'completed' ? 'Completed' : 'Live'}
                                                    </div>
                                                </div>
                                                <div style={styles.campaignInfo}>
                                                    <h3 style={styles.campaignTitle}>{campaign.title}</h3>
                                                    <p style={styles.campaignSub}>{campaign.subtitle}</p>

                                                    <div style={styles.progressSection}>
                                                        <div style={styles.progressText}>
                                                            <span style={styles.raisedText}>Rs. {(campaign.raised || 0).toLocaleString()}</span>
                                                            <span style={styles.goalText}>/ Rs. {(campaign.goal || 0).toLocaleString()}</span>
                                                            <span style={styles.percentageText}>
                                                                <TrendingUp size={14} /> {progress}%
                                                            </span>
                                                        </div>
                                                        <div style={styles.progressTrack}>
                                                            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                                                        </div>
                                                        <div style={styles.campaignStats}>
                                                            <div style={styles.statItem}>
                                                                <Users size={14} /> {campaign.contributors || 0} donors
                                                            </div>
                                                            <div style={styles.statItem}>
                                                                <TrendingUp size={14} /> {campaign.status === 'completed' ? 'Finished' : '9 days left'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                            <p>You haven't created any campaigns yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#e0f2fe', // Matching the pale blue bg in mockups
        minHeight: '100vh',
    },
    container: {
        paddingTop: '100px',
        paddingBottom: '4rem',
    },
    dashboardWrapper: {
        display: 'flex',
        gap: '2rem',
        minHeight: '600px',
    },
    sidebar: {
        width: '280px',
        backgroundColor: '#D6E6FF', // Light blue sidebar
        borderRadius: '24px',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
    },
    profileSection: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    sideLogo: {
        height: '60px',
        marginBottom: '1.5rem',
    },
    avatarWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1rem',
    },
    avatar: {
        width: '80px',
        height: '80px',
        backgroundColor: '#64748b',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '4px solid white',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    nameRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: '#1e293b',
    },
    userName: {
        fontSize: '1.1rem',
        fontWeight: '700',
        margin: 0,
    },
    userEmail: {
        fontSize: '0.85rem',
        color: '#64748b',
        margin: 0,
    },
    sideNav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '2rem',
    },
    navBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#1e293b',
        fontSize: '0.95rem',
        fontWeight: '500',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
    },
    activeNavBtn: {
        backgroundColor: '#f1f5f9',
        fontWeight: '600',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    newCampaignBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.9rem',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#2596be',
        color: 'white',
        fontSize: '0.95rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: 'auto',
    },
    mainContent: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '24px',
        padding: '3rem',
        border: '1px solid white',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    tabContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
    },
    welcomeSection: {
        textAlign: 'left',
    },
    welcomeTitle: {
        fontSize: '2rem',
        fontWeight: '800',
        color: '#1e293b',
        margin: '0 0 0.5rem 0',
    },
    welcomeSub: {
        fontSize: '1.1rem',
        color: '#475569',
        margin: 0,
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
    },
    statCard: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
    activeStatCard: {
        border: '3px solid #3b82f6',
    },
    statInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    statLabel: {
        fontSize: '0.85rem',
        color: '#64748b',
        margin: 0,
    },
    statValue: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: '#1e293b',
        margin: 0,
    },
    statChange: {
        fontSize: '0.8rem',
        color: '#10b981',
        fontWeight: '600',
        margin: 0,
    },
    statIconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeCampaignCard: {
        backgroundColor: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '350px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    campaignImageWrapper: {
        position: 'relative',
        height: '200px',
    },
    campaignImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    liveBadge: {
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    pulseDot: {
        width: '8px',
        height: '8px',
        backgroundColor: 'white',
        borderRadius: '50%',
        boxShadow: '0 0 0 rgba(255, 255, 255, 0.7)',
    },
    campaignInfo: {
        padding: '1.5rem',
    },
    campaignTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '0.5rem',
    },
    campaignSub: {
        fontSize: '0.9rem',
        color: '#64748b',
        marginBottom: '1.5rem',
        lineHeight: 1.4,
    },
    progressSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    progressText: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.9rem',
        fontWeight: '700',
    },
    raisedText: {
        color: '#3b82f6',
    },
    goalText: {
        color: '#94a3b8',
        fontSize: '0.8rem',
    },
    percentageText: {
        marginLeft: 'auto',
        color: '#10b981',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.8rem',
    },
    progressTrack: {
        width: '100%',
        height: '8px',
        backgroundColor: '#f1f5f9',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3b82f6',
        borderRadius: '4px',
    },
    campaignStats: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.75rem',
        color: '#64748b',
        fontWeight: '600',
    },
    editInput: {
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        padding: '2px 8px',
        fontSize: '1rem',
        fontWeight: '700',
        color: '#1e293b',
        width: '140px'
    },
    iconBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px',
        display: 'flex',
        alignItems: 'center'
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        background: 'rgba(0,0,0,0.5)',
        height: '30%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loaderOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default IndividualDashboard;

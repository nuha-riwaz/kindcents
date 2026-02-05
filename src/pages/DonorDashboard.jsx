import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
    Star,
    Save,
    X,
    Camera,
    User,
    Search
} from 'lucide-react';
import logo from '../assets/logo.png';
import projectEmma from '../assets/project-emma.jpg';
import projectArklow from '../assets/project-arklow.png';
import orgSmile from '../assets/org-smile.jpg';
import mrsPerera from '../assets/mrs-perera.jpg';

// Custom Badge Images
import badgeFirstStep from '../assets/badge-first-step.png';
import badgeKindHeart from '../assets/badge-kind-heart.png';
import badgeLifeChanger from '../assets/badge-life-changer.png';
import badgeCommunityHero from '../assets/badge-community-hero.png';
import badgeHopeBringer from '../assets/badge-hope-bringer.png';
import badgeGoldenGiver from '../assets/badge-golden-giver.png';

// Import New Stats Icons
import iconCampaigns from '../assets/icon-campaigns.png';
import iconLivesImpacted from '../assets/icon-lives-impacted.png';
import iconBadges from '../assets/icon-badges.png';
import iconDonatedRupee from '../assets/icon-donated-rupee.png';
import orgAkshay from '../assets/org-akshay.jpg';
import orgKeithston from '../assets/org-keithston.jpg';
import orgLotus from '../assets/org-lotus.jpg';
import templeRenovation from '../assets/temple-renovation.png';
import orphanCare from '../assets/orphan-care.png';
import ruralMedical from '../assets/rural-medical.jpg';
import ayaanSurgery from '../assets/ayaan-surgery.png';
import badgeLocked from '../assets/badge-locked.png';

// Image mapping to resolve Firestore strings to local assets
const imageMap = {
    projectEmma,
    projectArklow,
    mrsPerera,
    ayaanSurgery,
    orgSmile,
    orgAkshay,
    orgKeithston,
    orgLotus,
    templeRenovation,
    orphanCare,
    ruralMedical
};

const DonorDashboard = () => {
    const { user, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    // Use logged in user info or fallback to mock Alicia (from image)
    const displayName = user?.name || "Alicia Johns";
    const displayEmail = user?.email || "alicia.johns@gmail.com";

    // Real-time stats from Firestore
    const [realStats, setRealStats] = React.useState({
        totalDonated: 0,
        campaignsSupported: 0,
        livesImpacted: 0,
        badgesEarned: 0
    });

    // Fetch and calculate real stats from donations
    React.useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;

            try {
                const { collection, query, where, getDocs } = await import('firebase/firestore');
                const { db } = await import('../firebase');

                const donationsRef = collection(db, 'donations');
                const q = query(donationsRef, where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);

                let totalDonated = 0;
                const uniqueCampaigns = new Set();

                querySnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    // Only count completed (approved) donations towards totals
                    if (data.status === 'Completed') {
                        totalDonated += data.amount || 0;
                        if (data.campaignId) {
                            uniqueCampaigns.add(data.campaignId);
                        }
                    }
                });

                // Calculate badges (simple logic for now)
                let badgesEarned = 0;
                if (totalDonated > 0) badgesEarned++; // First Step
                if (uniqueCampaigns.size >= 3) badgesEarned++; // Kind Heart
                if (totalDonated >= 100000) badgesEarned++; // Community Hero
                if (uniqueCampaigns.size >= 10) badgesEarned++; // Golden Giver

                setRealStats({
                    totalDonated,
                    campaignsSupported: uniqueCampaigns.size,
                    livesImpacted: totalDonated > 0 ? Math.floor(totalDonated / 1000) : 0, // Estimate
                    badgesEarned
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, [user]);

    const sidebarItems = [
        { id: 'Overview', icon: <Home size={20} />, label: 'Overview' },
        { id: 'Browse', icon: <Search size={20} />, label: 'Browse Campaigns' },
        { id: 'My Campaigns', icon: <History size={20} />, label: 'My Campaigns' },
        { id: 'Achievements', icon: <Trophy size={20} />, label: 'Achievements' },
        { id: 'Recent Donations', icon: <Clock size={20} />, label: 'Recent Donations' },
    ];

    const stats = [
        {
            label: 'Total Donated',
            value: `Rs. ${realStats.totalDonated.toLocaleString()}`,
            change: null,
            icon: <img src={iconCampaigns} alt="Total Donated" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />,
            color: '#eff6ff'
        },
        {
            label: 'Campaigns Supported',
            value: realStats.campaignsSupported,
            change: null,
            icon: <img src={iconLivesImpacted} alt="Campaigns" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />,
            color: '#f0fdf4'
        },
        {
            label: 'Lives Impacted',
            value: realStats.livesImpacted,
            change: null,
            icon: <img src={iconBadges} alt="Lives Impacted" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />,
            color: '#fef2f2'
        },
        {
            label: 'Badges Earned',
            value: realStats.badgesEarned,
            change: null,
            icon: <img src={iconDonatedRupee} alt="Badges" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />,
            color: '#fffbeb'
        },
    ];

    const handleImageClick = () => {
        if (isEditing) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (limit to 1MB for Firestore)
        if (file.size > 1024 * 1024) {
            alert('Image too large! Please choose an image smaller than 1MB.');
            return;
        }

        console.log('Starting Base64 conversion for file:', file.name);
        setUploading(true);

        try {
            // Convert image to Base64
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64String = reader.result;
                console.log('Base64 conversion complete, updating profile...');

                try {
                    await updateUserProfile({ photoURL: base64String });
                    console.log('Profile updated successfully!');
                    alert('Profile picture updated successfully!');
                } catch (error) {
                    console.error("Error updating profile:", error);
                    alert(`Failed to update profile: ${error.message}`);
                }
                setUploading(false);
            };

            reader.onerror = () => {
                console.error("Error reading file");
                alert('Failed to read image file. Please try again.');
                setUploading(false);
            };

            // Read file as Base64
            reader.readAsDataURL(file);

        } catch (error) {
            console.error("Error processing image:", error);
            alert(`Failed to process image: ${error.message}`);
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

    const cancelEdit = () => {
        setNewName(user?.name || '');
        setIsEditing(false);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewView name={displayName.split(' ')[0]} stats={stats} />;
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
                                <div
                                    style={{
                                        ...styles.avatar,
                                        cursor: isEditing ? 'pointer' : 'default',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onClick={handleImageClick}
                                >
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Users size={40} color="#64748b" />
                                    )}

                                    {isEditing && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '30px',
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Camera size={16} color="#fff" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>

                            <div style={styles.profileInfo}>
                                {isEditing ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            style={styles.editInput}
                                        />
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={saveProfile} style={styles.saveBtn}><Save size={14} /></button>
                                            <button onClick={cancelEdit} style={styles.cancelBtn}><X size={14} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={styles.nameRow}>
                                        <strong style={styles.profileName}>{user?.name || 'Guest User'}</strong>
                                        <button onClick={() => { setIsEditing(true); setNewName(user?.name || ''); }} style={styles.editBtn}>
                                            <Edit size={14} />
                                        </button>
                                    </div>
                                )}
                                <p style={styles.profileEmail}>{user?.email || 'guest@kindcents.org'}</p>
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
                                    onClick={() => {
                                        if (item.id === 'Browse') {
                                            navigate('/campaigns');
                                        } else {
                                            setActiveTab(item.id);
                                        }
                                    }}
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

const OverviewView = ({ name, stats }) => (
    <div style={styles.tabView}>
        <div style={styles.welcomeHeader}>
            <h2 style={styles.welcomeTitle}>Welcome back, {name}!</h2>
            <p style={styles.welcomeSub}>Here's how you're making a difference.</p>
        </div>

        <div style={styles.statsGrid}>
            {stats.map((stat, index) => (
                <div key={index} style={styles.statsCard}>
                    <div style={styles.statsIconRow}>
                        <div style={styles.statsIconCircle}>
                            {stat.icon}
                        </div>
                        {stat.change && (
                            <div style={styles.statsTrend}>
                                <TrendingUp size={14} /> {stat.change}
                            </div>
                        )}
                    </div>
                    <p style={styles.statsLabel}>{stat.label}</p>
                    <h3 style={styles.statsValue}>{stat.value}</h3>
                </div>
            ))}
        </div>
    </div>
);

const MyCampaignsView = () => {
    const { user } = useAuth();
    const [userDonations, setUserDonations] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchUserDonations = async () => {
            if (!user) return;

            console.log('🔍 Fetching donations for user:', user.uid);

            try {
                // Import Firestore functions
                const { collection, query, where, getDocs } = await import('firebase/firestore');
                const { db } = await import('../firebase');

                // Query donations made by this user
                const donationsRef = collection(db, 'donations');
                const q = query(donationsRef, where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);

                console.log('📊 Found', querySnapshot.docs.length, 'donations');
                querySnapshot.docs.forEach(doc => {
                    console.log('💰 Donation:', doc.id, doc.data());
                });

                // Fetch campaign details for each donation
                const donationsWithCampaigns = await Promise.all(
                    querySnapshot.docs.map(async (donationDoc) => {
                        const donationData = donationDoc.data();

                        // Fetch the campaign details
                        const { doc, getDoc } = await import('firebase/firestore');
                        const campaignRef = doc(db, 'campaigns', donationData.campaignId);
                        const campaignSnap = await getDoc(campaignRef);

                        if (campaignSnap.exists()) {
                            return {
                                id: donationDoc.id,
                                donation: donationData.amount,
                                donatedAt: donationData.createdAt,
                                ...campaignSnap.data(),
                                campaignId: donationData.campaignId
                            };
                        }
                        return null;
                    })
                );

                const filteredDonations = donationsWithCampaigns.filter(d => d !== null);

                // Group by campaign and status to show pending vs completed
                // For now, simple filter to only show campaigns with at least one donation
                // and keep the current structure but adding status awareness
                setUserDonations(filteredDonations);
            } catch (error) {
                console.error('❌ Error fetching donations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDonations();
    }, [user]);

    if (loading) {
        return (
            <div style={styles.tabView}>
                <div style={styles.welcomeHeader}>
                    <h2 style={styles.welcomeTitle}>My Campaigns</h2>
                    <p style={styles.welcomeSub}>Loading your donations...</p>
                </div>
            </div>
        );
    }

    // Empty state if no donations
    if (userDonations.length === 0) {
        return (
            <div style={{ ...styles.tabView, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
                <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <h2 style={{ ...styles.welcomeTitle, whiteSpace: 'nowrap' }}>You Haven't Made a Donation Yet</h2>
                    <p style={{ ...styles.welcomeSub, marginBottom: '2rem' }}>
                        Start making a difference today by supporting campaigns that matter to you.
                    </p>
                    <button
                        onClick={() => navigate('/campaigns')}
                        style={{
                            backgroundColor: '#10b981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '1rem 2rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                    >
                        Donate Now
                        <ArrowUpRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.tabView}>
            <div style={styles.welcomeHeader}>
                <h2 style={styles.welcomeTitle}>My Campaigns</h2>
                <p style={styles.welcomeSub}>Your contributions, making a difference one campaign at a time.</p>
            </div>

            <div style={styles.campaignListGrid}>
                {userDonations.map(c => (
                    <div key={c.id} style={styles.compactCampaignCard}>
                        <div style={styles.compactImageWrapper}>
                            <img
                                src={imageMap[c.image] || c.image || c.imageUrl}
                                alt={c.title}
                                style={styles.compactImage}
                            />
                            <span style={styles.compactTypeBadge}>{c.type || 'Campaign'}</span>
                        </div>
                        <div style={styles.compactContent}>
                            <div style={styles.compactHeader}>
                                <h4 style={styles.compactTitle}>{c.title}</h4>
                                <div style={styles.compactRating}>
                                    {[...Array(4)].map((_, i) => <Star key={i} size={12} fill="#fbbf24" color="#fbbf24" />)}
                                    {[...Array(1)].map((_, i) => <Star key={i} size={12} color="#cbd5e1" />)}
                                </div>
                            </div>
                            <div style={styles.compactProgress}>
                                <div style={styles.compactProgressBarContainer}>
                                    <div style={{ ...styles.compactProgressBar, width: `${Math.min((c.raised / c.goal) * 100, 100)}%` }} />
                                </div>
                                <div style={styles.compactProgressLabels}>
                                    <span>Rs. {(c.raised || 0).toLocaleString()}</span>
                                    <span>of Rs. {(c.goal || 0).toLocaleString()}</span>
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
        </div >
    );
};


const AchievementsView = () => {
    const { user } = useAuth();
    const [badges, setBadges] = React.useState([
        { title: "First Step", desc: "Made your first charitable donation!", icon: badgeFirstStep, unlocked: false, progress: 0, target: 1 },
        { title: "Kind Heart", desc: "Supported 3 different campaigns", icon: badgeKindHeart, unlocked: false, progress: 0, target: 3 },
        { title: "Life Changer", desc: "Impacted 50+ lives through your donations", icon: badgeLifeChanger, unlocked: false, progress: 0, target: 50 },
        { title: "Community Hero", desc: "Donated over Rs. 100,000 in total", icon: badgeCommunityHero, unlocked: false, progress: 0, target: 100000 },
        { title: "Hope Bringer", desc: "Fully funded an entire campaign", icon: badgeHopeBringer, unlocked: false, progress: 0, target: 1 },
        { title: "Golden Giver", desc: "Supported 10+ campaigns", icon: badgeGoldenGiver, unlocked: false, progress: 0, target: 10 },
    ]);

    React.useEffect(() => {
        const fetchBadgeProgress = async () => {
            if (!user) return;

            try {
                const { collection, query, where, getDocs } = await import('firebase/firestore');
                const { db } = await import('../firebase');

                const donationsRef = collection(db, 'donations');
                const q = query(donationsRef, where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);

                let totalDonated = 0;
                const uniqueCampaigns = new Set();
                let fullyFundedCount = 0;

                querySnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    // Achievements only count approved funds
                    if (data.status === 'Completed') {
                        totalDonated += data.amount || 0;
                        if (data.campaignId) {
                            uniqueCampaigns.add(data.campaignId);
                        }
                    }
                });

                const livesImpacted = totalDonated > 0 ? Math.floor(totalDonated / 1000) : 0;

                // Update badges with real progress
                setBadges([
                    {
                        title: "First Step",
                        desc: "Made your first charitable donation!",
                        icon: badgeFirstStep,
                        unlocked: totalDonated > 0,
                        progress: totalDonated > 0 ? 1 : 0,
                        target: 1
                    },
                    {
                        title: "Kind Heart",
                        desc: "Supported 3 different campaigns",
                        icon: badgeKindHeart,
                        unlocked: uniqueCampaigns.size >= 3,
                        progress: uniqueCampaigns.size,
                        target: 3
                    },
                    {
                        title: "Life Changer",
                        desc: "Impacted 50+ lives through your donations",
                        icon: badgeLifeChanger,
                        unlocked: livesImpacted >= 50,
                        progress: livesImpacted,
                        target: 50
                    },
                    {
                        title: "Community Hero",
                        desc: "Donated over Rs. 100,000 in total",
                        icon: badgeCommunityHero,
                        unlocked: totalDonated >= 100000,
                        progress: totalDonated,
                        target: 100000
                    },
                    {
                        title: "Hope Bringer",
                        desc: "Fully funded an entire campaign",
                        icon: badgeHopeBringer,
                        unlocked: fullyFundedCount >= 1,
                        progress: fullyFundedCount,
                        target: 1
                    },
                    {
                        title: "Golden Giver",
                        desc: "Supported 10+ campaigns",
                        icon: badgeGoldenGiver,
                        unlocked: uniqueCampaigns.size >= 10,
                        progress: uniqueCampaigns.size,
                        target: 10
                    },
                ]);
            } catch (error) {
                console.error('Error fetching badge progress:', error);
            }
        };

        fetchBadgeProgress();
    }, [user]);

    return (
        <div style={styles.tabView}>
            <div style={styles.welcomeHeader}>
                <h2 style={styles.welcomeTitle}>Achievements</h2>
                <p style={styles.welcomeSub}>Unlock badges by reaching donation milestones.</p>
            </div>

            <div style={styles.badgeGrid}>
                {badges.map((badge, i) => (
                    <div key={i} style={{
                        ...styles.badgeCard,
                        ...(badge.unlocked ? { border: '2px solid #e5e7eb' } : styles.lockedBadge)
                    }}>
                        <img
                            src={badge.unlocked ? badge.icon : badgeLocked}
                            alt={badge.title}
                            style={styles.badgeIcon}
                        />
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
                                    <div style={{ ...styles.badgeProgressFill, width: `${Math.min((badge.progress / badge.target) * 100, 100)}%` }} />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const RecentDonationsView = () => {
    const { user } = useAuth();
    const [donations, setDonations] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchRecentDonations = async () => {
            if (!user) return;

            try {
                const { collection, query, where, getDocs } = await import('firebase/firestore');
                const { db } = await import('../firebase');

                // Query recent donations by this user (without orderBy to avoid index requirement)
                const donationsRef = collection(db, 'donations');
                const q = query(
                    donationsRef,
                    where('userId', '==', user.uid)
                );
                const querySnapshot = await getDocs(q);

                const donationsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Sort client-side by createdAt descending and limit to 10
                const sortedDonations = donationsData
                    .sort((a, b) => {
                        const dateA = a.createdAt?.toDate?.() || new Date(0);
                        const dateB = b.createdAt?.toDate?.() || new Date(0);
                        return dateB - dateA;
                    })
                    .slice(0, 10);

                setDonations(sortedDonations);
            } catch (error) {
                console.error('Error fetching recent donations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentDonations();
    }, [user]);

    if (loading) {
        return (
            <div style={styles.tabView}>
                <div style={styles.welcomeHeader}>
                    <h2 style={styles.welcomeTitle}>Recent Donations</h2>
                    <p style={styles.welcomeSub}>Loading...</p>
                </div>
            </div>
        );
    }

    // Empty state if no donations
    if (donations.length === 0) {
        return (
            <div style={{ ...styles.tabView, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
                <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <h2 style={{ ...styles.welcomeTitle, whiteSpace: 'nowrap' }}>No Donation History Yet</h2>
                    <p style={{ ...styles.welcomeSub, marginBottom: '2rem' }}>
                        Your donation history will appear here once you start supporting campaigns.
                    </p>
                    <button
                        onClick={() => navigate('/campaigns')}
                        style={{
                            backgroundColor: '#10b981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '1rem 2rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                    >
                        Browse Campaigns
                        <ArrowUpRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

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
                                <strong style={styles.historyTitle}>{d.campaignTitle || 'Campaign'}</strong>
                                <p style={styles.historyDate}>{d.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent'}</p>
                            </div>
                            <div style={styles.historyRight}>
                                <strong style={styles.historyAmount}>Rs. {(d.amount || 0).toLocaleString()}</strong>
                                <span style={{
                                    ...styles.statusTag,
                                    color: d.status === 'Completed' ? '#10b981' : '#f59e0b'
                                }}>{d.status || 'Pending'}</span>
                            </div>
                        </div>
                    ))}
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
        height: '60px',
        width: 'auto',
        marginBottom: '1.5rem',
        objectFit: 'contain',
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
    editInput: {
        padding: '0.5rem',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        width: '100%',
        fontSize: '0.9rem',
    },
    saveBtn: {
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '4px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtn: {
        backgroundColor: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '4px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        alignItems: 'center', // Center content horizontally
        gap: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        position: 'relative', // For absolute positioning of trend
    },
    statsIconRow: {
        display: 'flex',
        justifyContent: 'center', // Center the icon
        alignItems: 'center',
        marginBottom: '0.5rem',
        width: '100%',
    },
    statsIconCircle: {
        width: 'auto',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsTrend: {
        position: 'absolute', // Absolute positioning
        top: '1.5rem',
        right: '1.5rem',
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
        margin: '0.5rem 0 0 0', // Add some top margin
        textAlign: 'center',
    },
    statsValue: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#1e293b',
        margin: 0,
        textAlign: 'center',
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
        backgroundColor: '#f8fafc',
        borderStyle: 'dashed',
    },
    badgeIcon: {
        width: '120px',
        height: '120px',
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

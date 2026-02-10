import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminCampaignForm from '../components/AdminCampaignForm';
import ExpensesViewModal from '../components/ExpensesViewModal';
import { useAuth } from '../context/AuthContext';
import { useCampaigns } from '../context/CampaignContext';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import {
    Users,
    FileCheck,
    LayoutDashboard,
    Plus,
    Search,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    Check,
    X,
    TrendingUp,
    Shield,
    CreditCard,
    User,
    Menu, // Add Menu icon
    MessageCircle
} from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
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

const AdminDashboard = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(
        () => (typeof window !== 'undefined' ? window.innerWidth <= 768 : false)
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Add styles for hover effects
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .hover-btn-blue:hover { background-color: #2563eb !important; transform: translateY(-1px); }
            .hover-btn-green:hover { background-color: #059669 !important; transform: translateY(-1px); }
            .hover-btn-red:hover { background-color: #dc2626 !important; transform: translateY(-1px); }
            .hover-btn-ghost-blue:hover { background-color: #eff6ff !important; color: #2563eb !important; }
            .hover-btn-ghost-red:hover { background-color: #fef2f2 !important; color: #dc2626 !important; }
            .nav-item:hover { background-color: #f8fafc; color: #334155; }
            .nav-item.active:hover { background-color: #eff6ff; color: #4F96FF; }
            .action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSidebarOpen && isMobile && !event.target.closest('.admin-sidebar') && !event.target.closest('.sidebar-toggle')) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen, isMobile]);
    const navigate = useNavigate();
    const campaignsData = useCampaigns();

    const {
        campaigns = [],
        users = [],
        addCampaign,
        updateCampaign,
        deleteCampaign,
        updateUserStatus,
        approveDonation,
        rejectDonation,
        deleteUser,
        pendingDonations = [],
        expenses // Get expenses from context
    } = campaignsData;

    const [activeTab, setActiveTab] = useState('Campaigns');
    const [searchQuery, setSearchQuery] = useState('');

    // Expenses Modal State
    const [viewExpensesCampaign, setViewExpensesCampaign] = useState(null);

    // Support messages from ChatBot (contact_requests collection)
    const [contactRequests, setContactRequests] = useState([]);

    // Redirect to home if user logs out
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);

    // Subscribe to contact_requests for admin support inbox
    useEffect(() => {
        const q = query(collection(db, 'contact_requests'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const list = [];
                snapshot.forEach((docSnap) => {
                    list.push({ id: docSnap.id, ...docSnap.data() });
                });
                setContactRequests(list);
            },
            (error) => {
                console.error('Error fetching contact requests:', error);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleMarkSupportDone = async (id) => {
        try {
            const reqRef = doc(db, 'contact_requests', id);
            await updateDoc(reqRef, { status: 'done' });
        } catch (error) {
            console.error('Error marking support message as done:', error);
        }
    };

    // Final safety check for users/campaigns before rendering
    if (!Array.isArray(campaigns) || !Array.isArray(users)) {
        console.error("Campaigns or Users data is not an array", { campaigns, users });
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard data...</div>;
    }

    // Calculate real-time statistics (all campaigns, including NGO profiles)
    const nonAdminUsers = users.filter(
        u => (u.role || '').toLowerCase() !== 'admin' && (u.email || '').toLowerCase() !== 'admin@kindcents.org'
    );
    const totalRaised = campaigns.reduce((sum, c) => sum + (c.raised || 0), 0);
    const activeCampaignsCount = campaigns.filter(c => c.isActive).length;
    const pendingVerifications = nonAdminUsers.filter(u => u.status === 'Pending').length;

    const stats = [
        { label: 'Total Users', value: nonAdminUsers.length, icon: <Users size={20} />, color: '#4F96FF' },
        { label: 'Active Campaigns', value: activeCampaignsCount, icon: <TrendingUp size={20} />, color: '#64748b' },
        { label: 'Pending Verifications', value: pendingVerifications, icon: <FileCheck size={20} />, color: '#94a3b8' },
        { label: 'Total Raised', value: `Rs. ${(totalRaised || 0).toLocaleString()}`, icon: <Shield size={20} />, color: '#3b82f6' },
    ];

    const filteredCampaigns = campaigns.filter(c =>
        (c.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUsers = nonAdminUsers.filter(u =>
        (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddCampaign = () => {
        setEditingCampaign(null);
        setIsFormOpen(true);
    };

    const handleEditCampaign = (campaign) => {
        setEditingCampaign(campaign);
        setIsFormOpen(true);
    };

    const handleSaveCampaign = async (data) => {
        if (editingCampaign) {
            await updateCampaign(editingCampaign.id, data);
        } else {
            await addCampaign({
                ...data,
                image: data.image || campaigns[0]?.image // Use uploaded image or placeholder for new campaigns
            });
        }
    };

    const handleStatusUpdate = async (campaignId, status) => {
        try {
            await updateCampaign(campaignId, { status });
        } catch (error) {
            console.error("Error updating campaign status:", error);
        }
    };

    const handleDeleteCampaign = async (campaignId) => {
        if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
            try {
                await deleteCampaign(campaignId);
            } catch (error) {
                console.error("Error deleting campaign:", error);
            }
        }
    };

    return (
        <div style={styles.page}>
            <Navbar minimal={true} />

            <div className="container" style={{ ...styles.container, paddingTop: isMobile ? '80px' : '100px' }}>
                <div style={{ ...styles.dashboardLayout, flexDirection: isMobile ? 'column' : 'row' }} className="dashboard-layout">
                    {/* Mobile Sidebar Toggle */}
                    <button
                        className="sidebar-toggle"
                        style={{ ...styles.sidebarToggle, display: isMobile ? 'block' : 'none' }}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Sidebar */}
                    <aside
                        className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}
                        style={{
                            ...styles.sidebar,
                            ...(isMobile ? (isSidebarOpen ? styles.mobileSidebarOpen : styles.mobileSidebarClosed) : {})
                        }}
                    >
                        <div style={styles.adminProfile}>
                            <div style={styles.adminAvatar}>
                                <Shield size={40} color="#64748b" />
                            </div>
                            <div style={styles.adminInfo}>
                                <p style={styles.adminRole}>System Administrator</p>
                                <h3 style={styles.adminName}>{user?.name || 'Admin'}</h3>
                            </div>
                        </div>

                        <nav style={styles.sideNav}>
                            <button
                                onClick={() => { setActiveTab('Dashboard'); setIsSidebarOpen(false); }}
                                style={{ ...styles.navItem, ...(activeTab === 'Dashboard' ? styles.activeNavItem : {}) }}
                            >
                                <LayoutDashboard size={20} /> Dashboard
                            </button>
                            <button
                                onClick={() => { setActiveTab('Campaigns'); setIsSidebarOpen(false); }}
                                style={{ ...styles.navItem, ...(activeTab === 'Campaigns' ? styles.activeNavItem : {}) }}
                            >
                                <TrendingUp size={20} /> Manage Campaigns
                            </button>
                            <button
                                onClick={() => { setActiveTab('Verification'); setIsSidebarOpen(false); }}
                                style={{ ...styles.navItem, ...(activeTab === 'Verification' ? styles.activeNavItem : {}) }}
                            >
                                <FileCheck size={20} /> Verifications
                            </button>
                            <button
                                onClick={() => { setActiveTab('Users'); setIsSidebarOpen(false); }}
                                style={{ ...styles.navItem, ...(activeTab === 'Users' ? styles.activeNavItem : {}) }}
                            >
                                <Users size={20} /> User Management
                            </button>
                            <button
                                onClick={() => { setActiveTab('Payments'); setIsSidebarOpen(false); }}
                                style={{ ...styles.navItem, ...(activeTab === 'Payments' ? styles.activeNavItem : {}) }}
                                className={`nav-item ${activeTab === 'Payments' ? 'active' : ''}`}
                            >
                                <CreditCard size={20} /> Payment Approvals
                                {pendingDonations.length > 0 && (
                                    <span style={styles.tabBadge}>{pendingDonations.length}</span>
                                )}
                            </button>
                            <button
                                onClick={() => { setActiveTab('Support'); setIsSidebarOpen(false); }}
                                style={{ ...styles.navItem, ...(activeTab === 'Support' ? styles.activeNavItem : {}) }}
                            >
                                <MessageCircle size={20} /> Support Messages
                                {contactRequests.filter(r => (r.status || 'new') === 'new').length > 0 && (
                                    <span style={styles.tabBadge}>
                                        {contactRequests.filter(r => (r.status || 'new') === 'new').length}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main style={styles.mainArea}>
                        <header style={{ ...styles.areaHeader, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '1rem' }}>
                            <h2 style={styles.areaTitle}>{activeTab}</h2>
                            <div style={{ ...styles.headerActions, flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto' }}>
                                <div style={{ ...styles.searchBox, width: isMobile ? '100%' : '300px' }}>
                                    <Search size={18} color="#94a3b8" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        style={styles.searchInput}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                {activeTab === 'Campaigns' && (
                                    <button onClick={handleAddCampaign} style={{ ...styles.addBtn, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }} className="hover-btn-blue">
                                        <Plus size={18} /> New Campaign
                                    </button>
                                )}
                            </div>
                        </header>

                        {/* Top Stats */}
                        <div style={{ ...styles.statsRow, gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)' }}>
                            {stats.map((stat, i) => (
                                <div key={i} style={styles.statCard}>
                                    <div style={{ ...styles.statIcon, backgroundColor: stat.color }}>{stat.icon}</div>
                                    <div style={styles.statContent}>
                                        <p style={styles.statLabel}>{stat.label}</p>
                                        <h3 style={styles.statValue}>{stat.value}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Content Grid */}
                        <div style={{ ...styles.contentCard, overflowX: isMobile ? 'auto' : 'hidden' }}>
                            {activeTab === 'Campaigns' && (
                                <table style={{ ...styles.table, minWidth: isMobile ? '600px' : 'auto' }}>
                                    <thead>
                                        <tr style={styles.tableHeader}>
                                            <th style={styles.th}>Campaign</th>
                                            <th style={styles.th}>Goal</th>
                                            <th style={styles.th}>Raised</th>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCampaigns.map(c => (
                                            <tr key={c.id} style={styles.tr}>
                                                <td style={styles.td}>
                                                    <div style={styles.campaignCell}>
                                                        <img src={imageMap[c.image] || c.image} alt="" style={styles.tableImg} />
                                                        <div>
                                                            <div style={styles.tableMainText}>{c.title}</div>
                                                            <div style={styles.tableSubText}>{c.category}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>Rs. {(c.goal || 0).toLocaleString()}</td>
                                                <td style={styles.td}>
                                                    <div style={styles.progressCell}>
                                                        <span>Rs. {(c.raised || 0).toLocaleString()}</span>
                                                        <div style={styles.miniProgressTrack}>
                                                            <div style={{ ...styles.miniProgressFill, width: `${(c.goal || 0) > 0 ? ((c.raised || 0) / (c.goal || 1)) * 100 : 0}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={c.isActive ? styles.badgeSuccess : styles.badgeDanger}>
                                                        {c.isActive ? 'Active' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={styles.actionButtons}>
                                                        <button
                                                            style={{ ...styles.actionBtn, color: '#3b82f6', borderColor: '#3b82f6' }}
                                                            onClick={() => setViewExpensesCampaign(c)}
                                                            title="View Expenses"
                                                            className="hover-btn-ghost-blue"
                                                        >
                                                            <Eye size={14} /> View Expenses
                                                        </button>
                                                        {c.status === 'pending' && (
                                                            <button
                                                                style={styles.actionBtn}
                                                                onClick={() => handleStatusUpdate(c.id, 'active')}
                                                                className="hover-btn-green"
                                                            >
                                                                Approve
                                                            </button>
                                                        )}
                                                        <button
                                                            style={{ ...styles.actionBtn, color: '#ef4444', borderColor: '#ef4444' }}
                                                            onClick={() => handleDeleteCampaign(c.id)}
                                                            className="hover-btn-ghost-red"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'Verification' && (
                                <div style={styles.verificationList}>
                                    {filteredUsers.filter(u => u.status === 'Pending').length === 0 ? (
                                        <div style={styles.emptyState}>No pending verifications matching your search</div>
                                    ) : (
                                        filteredUsers.filter(u => u.status === 'Pending').map(u => (
                                            <div key={u.id} style={styles.verificationCard}>
                                                <div style={styles.userMain}>
                                                    <div style={styles.userAvatar}>{(u.name || '?').charAt(0)}</div>
                                                    <div>
                                                        <h4 style={styles.vUserName}>{u.name || 'Unknown User'}</h4>
                                                        <p style={styles.vUserEmail}>{u.email} • {u.role || 'User'}</p>
                                                    </div>
                                                </div>
                                                <div style={styles.docsList}>
                                                    {u.uploadedFiles && Object.entries(u.uploadedFiles).map(([key, fileData]) => {
                                                        const filename = typeof fileData === 'object' ? (fileData.name || 'File') : (fileData || 'File');
                                                        const fileUrl = typeof fileData === 'object' ? fileData.url : null;
                                                        return (
                                                            <a
                                                                key={key}
                                                                href={fileUrl || '#'}
                                                                target={fileUrl ? "_blank" : "_self"}
                                                                download={fileUrl ? filename : undefined}
                                                                style={{ ...styles.docLink, textDecoration: 'none', color: '#334155', cursor: fileUrl ? 'pointer' : 'not-allowed', opacity: fileUrl ? 1 : 0.6 }}
                                                                title={fileUrl ? `View ${filename}` : "File content not available (Older upload)"}
                                                                onClick={(e) => !fileUrl && e.preventDefault()}
                                                            >
                                                                <FileCheck size={14} />
                                                                {key === 'govId' ? 'Gov ID' :
                                                                    key === 'birthCert' ? 'Birth Cert' :
                                                                        key === 'medicalRecords' ? 'Medical' :
                                                                            key === 'doctorLetter' ? 'Doctor Letter' :
                                                                                key === 'attestation' ? 'Attestation' :
                                                                                    key === 'cert' ? 'NGO Cert' :
                                                                                        key === 'proposal' ? 'Proposal' :
                                                                                            key === 'projects' ? 'Projects' :
                                                                                                key === 'finance' ? 'Finance' : key}: {filename.length > 15 ? filename.substring(0, 12) + '...' : filename}
                                                            </a>
                                                        );
                                                    })}
                                                    {(!u.uploadedFiles || Object.keys(u.uploadedFiles).length === 0) && (
                                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No documents uploaded</span>
                                                    )}
                                                </div>
                                                <div style={{ ...styles.vActions, flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto' }}>
                                                    <button
                                                        onClick={() => updateUserStatus(u.id, 'Verified')}
                                                        style={{ ...styles.approveBtn, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
                                                        className="hover-btn-blue"
                                                    >
                                                        <Check size={16} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => updateUserStatus(u.id, 'Rejected')}
                                                        style={{ ...styles.rejectBtn, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
                                                        className="hover-btn-ghost-red"
                                                    >
                                                        <X size={16} /> Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'Dashboard' && (
                                <div style={styles.dashboardOverview}>
                                    <h3 style={styles.overviewTitle}>Platform Overview</h3>

                                    <div style={{ ...styles.overviewGrid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                                        <div style={styles.overviewCard}>
                                            <h4 style={styles.overviewCardTitle}>Recent Activity</h4>
                                            <div style={styles.activityList}>
                                                <div style={styles.activityItem}>
                                                    <div style={styles.activityDot}></div>
                                                    <div>
                                                        <p style={styles.activityText}>New campaign created: Medical Equipment for Rural Hospital</p>
                                                        <p style={styles.activityTime}>2 hours ago</p>
                                                    </div>
                                                </div>
                                                <div style={styles.activityItem}>
                                                    <div style={styles.activityDot}></div>
                                                    <div>
                                                        <p style={styles.activityText}>User verified: Rashid Hassan</p>
                                                        <p style={styles.activityTime}>5 hours ago</p>
                                                    </div>
                                                </div>
                                                <div style={styles.activityItem}>
                                                    <div style={styles.activityDot}></div>
                                                    <div>
                                                        <p style={styles.activityText}>Campaign goal reached: Help Ayaan's Surgery</p>
                                                        <p style={styles.activityTime}>1 day ago</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={styles.overviewCard}>
                                            <h4 style={styles.overviewCardTitle}>Quick Stats</h4>
                                            <div style={styles.quickStats}>
                                                <div style={styles.quickStatItem}>
                                                    <span style={styles.quickStatLabel}>Verified Users</span>
                                                    <span style={styles.quickStatValue}>{users.filter(u => u.status === 'Verified').length}</span>
                                                </div>
                                                <div style={styles.quickStatItem}>
                                                    <span style={styles.quickStatLabel}>Pending Reviews</span>
                                                    <span style={styles.quickStatValue}>{users.filter(u => u.status === 'Pending').length}</span>
                                                </div>
                                                <div style={styles.quickStatItem}>
                                                    <span style={styles.quickStatLabel}>Active Campaigns</span>
                                                    <span style={styles.quickStatValue}>{campaigns.filter(c => c.isActive).length}</span>
                                                </div>
                                                <div style={styles.quickStatItem}>
                                                    <span style={styles.quickStatLabel}>Total Campaigns</span>
                                                    <span style={styles.quickStatValue}>{campaigns.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Payments' && (
                                <div style={{ ...styles.paymentApprovalList, overflowX: isMobile ? 'auto' : 'hidden' }}>
                                    {(pendingDonations || []).length === 0 ? (
                                        <div style={styles.emptyState}>No pending payment approvals</div>
                                    ) : (
                                        <table style={{ ...styles.table, minWidth: isMobile ? '700px' : 'auto' }}>
                                            <thead>
                                                <tr style={styles.tableHeader}>
                                                    <th style={styles.th}>Donor</th>
                                                    <th style={styles.th}>Campaign</th>
                                                    <th style={styles.th}>Amount</th>
                                                    <th style={styles.th}>Date</th>
                                                    <th style={styles.th}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(pendingDonations || []).map(d => (
                                                    <tr key={d.id} style={styles.tr}>
                                                        <td style={styles.td}>
                                                            <div style={styles.donorCell}>
                                                                <div style={styles.donorIcon}><User size={16} /></div>
                                                                <div>
                                                                    <div style={styles.tableMainText}>{d.cardName || 'Anonymous'}</div>
                                                                    <div style={styles.tableSubText}>{d.email || d.userId}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={styles.td}>
                                                            <div style={styles.tableMainText}>{d.campaignTitle}</div>
                                                        </td>
                                                        <td style={styles.td}>
                                                            <strong style={{ color: '#2563eb' }}>Rs. {(d.amount || 0).toLocaleString()}</strong>
                                                        </td>
                                                        <td style={styles.td}>{d.date}</td>
                                                        <td style={styles.td}>
                                                            <div style={styles.actionRow}>
                                                                <button
                                                                    onClick={() => approveDonation(d.id)}
                                                                    style={styles.approveIconBtn}
                                                                    title="Approve"
                                                                    className="hover-btn-ghost-blue"
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => rejectDonation(d.id)}
                                                                    style={styles.rejectIconBtn}
                                                                    title="Reject"
                                                                    className="hover-btn-ghost-red"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}

                            {activeTab === 'Users' && (
                                <div style={{ overflowX: isMobile ? 'auto' : 'hidden' }}>
                                    <table style={{ ...styles.table, minWidth: isMobile ? '600px' : 'auto' }}>
                                        <thead>
                                            <tr style={styles.tableHeader}>
                                                <th style={styles.th}>User</th>
                                                <th style={styles.th}>Role</th>
                                                <th style={styles.th}>Joined</th>
                                                <th style={styles.th}>Status</th>
                                                <th style={styles.th}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(u => (
                                                <tr key={u.id} style={styles.tr}>
                                                    <td style={styles.td}>
                                                        <div>
                                                            <div style={styles.tableMainText}>{u.name}</div>
                                                            <div style={styles.tableSubText}>{u.email}</div>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        {u.role
                                                            ? u.role.charAt(0).toUpperCase() + u.role.slice(1)
                                                            : <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>N/A</span>
                                                        }
                                                    </td>
                                                    <td style={styles.td}>{u.signupDate}</td>
                                                    <td style={styles.td}>
                                                        <span style={u.status === 'Verified' ? styles.badgeSuccess : styles.badgeWarning}>
                                                            {u.status}
                                                        </span>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm(
                                                                    `Are you sure you want to delete ${u.name}?\n\nIMPORTANT: This only deletes their data from the database. To allow them to use this email again, you MUST also delete them from the "Authentication" tab in your Firebase Console.`
                                                                )) {
                                                                    deleteUser(u.id);
                                                                }
                                                            }}
                                                            style={styles.deleteBtn}
                                                            title="Delete User"
                                                            className="hover-btn-ghost-red"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'Support' && (
                                <div style={styles.supportList}>
                                    {contactRequests.length === 0 ? (
                                        <div style={styles.emptyState}>No support messages yet</div>
                                    ) : (
                                        contactRequests.map((req) => {
                                            let createdAtText = 'N/A';
                                            try {
                                                if (req.createdAt?.toDate) {
                                                    createdAtText = req.createdAt
                                                        .toDate()
                                                        .toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        });
                                                }
                                            } catch {
                                                // keep default
                                            }
                                            const statusLabel = (req.status || 'new').toUpperCase();
                                            const isDone = (req.status || 'new') === 'done';
                                            return (
                                                <div key={req.id} style={styles.supportCard}>
                                                    <div style={styles.supportHeader}>
                                                        <div style={styles.supportAvatar}>
                                                            {(req.name || req.email || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={styles.supportName}>{req.name || 'Anonymous user'}</div>
                                                            <div style={styles.supportMeta}>
                                                                {req.email || 'No email'} • {createdAtText} • {statusLabel}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p style={styles.supportMessage}>{req.message}</p>
                                                    {!isDone && (
                                                        <div style={styles.supportActions}>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleMarkSupportDone(req.id)}
                                                                style={styles.supportDoneBtn}
                                                            >
                                                                Mark as done
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {activeTab === 'Data Explorer' && (
                                <div style={styles.dataExplorer}>
                                    <section style={styles.dataSection}>
                                        <h4 style={styles.dataSectionTitle}>
                                            Campaigns <span style={styles.dataCount}>({campaigns.length})</span>
                                        </h4>
                                        <table style={styles.table}>
                                            <thead>
                                                <tr style={styles.tableHeader}>
                                                    <th style={styles.th}>Title</th>
                                                    <th style={styles.th}>Type</th>
                                                    <th style={styles.th}>Goal</th>
                                                    <th style={styles.th}>Raised</th>
                                                    <th style={styles.th}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {campaigns.map(c => (
                                                    <tr key={c.id} style={styles.tr}>
                                                        <td style={styles.td}>{c.title}</td>
                                                        <td style={styles.td}>{c.type || 'campaign'}</td>
                                                        <td style={styles.td}>Rs. {(c.goal || 0).toLocaleString()}</td>
                                                        <td style={styles.td}>Rs. {(c.raised || 0).toLocaleString()}</td>
                                                        <td style={styles.td}>{c.isActive ? 'Active' : (c.status || 'Draft')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>

                                    <section style={styles.dataSection}>
                                        <h4 style={styles.dataSectionTitle}>
                                            Users <span style={styles.dataCount}>({users.length})</span>
                                        </h4>
                                        <table style={styles.table}>
                                            <thead>
                                                <tr style={styles.tableHeader}>
                                                    <th style={styles.th}>Name</th>
                                                    <th style={styles.th}>Email</th>
                                                    <th style={styles.th}>Role</th>
                                                    <th style={styles.th}>Status</th>
                                                    <th style={styles.th}>Joined</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map(u => (
                                                    <tr key={u.id} style={styles.tr}>
                                                        <td style={styles.td}>{u.name || 'N/A'}</td>
                                                        <td style={styles.td}>{u.email}</td>
                                                        <td style={styles.td}>{u.role || 'N/A'}</td>
                                                        <td style={styles.td}>{u.status || 'N/A'}</td>
                                                        <td style={styles.td}>{u.signupDate || 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>

                                    <section style={styles.dataSection}>
                                        <h4 style={styles.dataSectionTitle}>
                                            Donations <span style={styles.dataCount}>{(campaignsData.donations || []).length}</span>
                                        </h4>
                                        <table style={styles.table}>
                                            <thead>
                                                <tr style={styles.tableHeader}>
                                                    <th style={styles.th}>Donor</th>
                                                    <th style={styles.th}>Email/User</th>
                                                    <th style={styles.th}>Campaign</th>
                                                    <th style={styles.th}>Amount</th>
                                                    <th style={styles.th}>Status</th>
                                                    <th style={styles.th}>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(campaignsData.donations || []).map(d => (
                                                    <tr key={d.id} style={styles.tr}>
                                                        <td style={styles.td}>{d.cardName || 'Anonymous'}</td>
                                                        <td style={styles.td}>{d.email || d.userId}</td>
                                                        <td style={styles.td}>{d.campaignTitle}</td>
                                                        <td style={styles.td}>Rs. {(d.amount || 0).toLocaleString()}</td>
                                                        <td style={styles.td}>{d.status}</td>
                                                        <td style={styles.td}>{d.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>

                                    <section style={styles.dataSection}>
                                        <h4 style={styles.dataSectionTitle}>
                                            Expenses <span style={styles.dataCount}>{(expenses || []).length}</span>
                                        </h4>
                                        <table style={styles.table}>
                                            <thead>
                                                <tr style={styles.tableHeader}>
                                                    <th style={styles.th}>Campaign ID</th>
                                                    <th style={styles.th}>User ID</th>
                                                    <th style={styles.th}>Amount</th>
                                                    <th style={styles.th}>Description</th>
                                                    <th style={styles.th}>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(expenses || []).map(e => (
                                                    <tr key={e.id} style={styles.tr}>
                                                        <td style={styles.td}>{e.campaignId}</td>
                                                        <td style={styles.td}>{e.userId}</td>
                                                        <td style={styles.td}>Rs. {(e.amount || 0).toLocaleString()}</td>
                                                        <td style={styles.td}>{e.description}</td>
                                                        <td style={styles.td}>{e.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>
                                </div>
                            )}
                        </div>
                    </main>

                </div>
            </div>

            <AdminCampaignForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSaveCampaign}
                campaign={editingCampaign}
            />
            <ExpensesViewModal
                isOpen={!!viewExpensesCampaign}
                onClose={() => setViewExpensesCampaign(null)}
                campaign={viewExpensesCampaign}
                expenses={expenses || []}
            />
        </div >
    );
};

const styles = {
    page: { backgroundColor: '#f0f4f8', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    container: { paddingTop: '100px', paddingBottom: '3rem', flex: 1 },
    dashboardLayout: { display: 'flex', gap: '2rem', minHeight: '100vh', position: 'relative' },
    sidebar: {
        width: '280px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '2.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        color: '#1e293b',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 50
    },
    sidebarToggle: {
        display: 'none', // Hidden on desktop, shown via CSS media query
        position: 'absolute',
        top: '-60px',
        left: '0',
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
        maxWidth: '300px'
    },
    mobileSidebarClosed: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        transform: 'translateX(-110%)',
        borderRadius: 0,
        width: '80%',
        maxWidth: '300px'
    },
    adminProfile: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '3rem', textAlign: 'center' },
    adminAvatar: { width: '80px', height: '80px', backgroundColor: '#cbd5e1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' },
    adminRole: { fontSize: '0.75rem', color: '#64748b', margin: 0, textTransform: 'uppercase', fontWeight: 700 },
    adminName: { fontSize: '1.25rem', fontWeight: '700', margin: 0, color: '#1e293b' },
    sideNav: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#64748b',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s'
    },
    activeNavItem: { backgroundColor: '#eff6ff', color: '#4F96FF', fontWeight: 600 },
    sidebarFooter: { marginTop: 'auto', textAlign: 'center' },
    mainArea: { flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    areaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    areaTitle: { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: 0 },
    headerActions: { display: 'flex', gap: '1rem' },
    searchBox: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '0.6rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '300px',
        border: '1px solid #e2e8f0'
    },
    searchInput: { border: 'none', outline: 'none', fontSize: '0.9rem', color: '#1e293b', width: '100%' },
    addBtn: {
        padding: '0.6rem 1.25rem',
        backgroundColor: '#4F96FF',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        cursor: 'pointer'
    },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' },
    statCard: {
        backgroundColor: 'white',
        padding: '1.25rem',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        border: '1px solid #e2e8f0'
    },
    statIcon: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
    statLabel: { fontSize: '0.8rem', color: '#64748b', margin: 0 },
    statValue: { fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 },
    contentCard: {
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '1rem',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { borderBottom: '1px solid #f1f5f9' },
    th: { textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' },
    tr: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' },
    td: { padding: '1.25rem 1.5rem', fontSize: '0.95rem', color: '#1e293b' },
    campaignCell: { display: 'flex', alignItems: 'center', gap: '1rem' },
    tableImg: { width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' },
    tableMainText: { fontWeight: '600', color: '#1e293b' },
    tableSubText: { fontSize: '0.8rem', color: '#64748b' },
    progressCell: { display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '150px' },
    miniProgressTrack: { height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px' },
    miniProgressFill: { height: '100%', backgroundColor: '#4F96FF', borderRadius: '2px' },
    badgeSuccess: { backgroundColor: '#dcfce7', color: '#10b981', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 },
    badgeDanger: { backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 },
    badgeWarning: { backgroundColor: '#fef3c7', color: '#f59e0b', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 },
    actionButtons: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    actionRow: { display: 'flex', gap: '0.5rem' },
    iconBtn: { border: '1px solid #e2e8f0', background: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', color: '#64748b' },
    deleteBtn: { border: '1px solid #fee2e2', background: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' },
    verificationList: { display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' },
    verificationCard: {
        backgroundColor: '#f8fafc',
        borderRadius: '20px',
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #e2e8f0'
    },
    userMain: { display: 'flex', alignItems: 'center', gap: '1rem' },
    userAvatar: { width: '48px', height: '48px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    vUserName: { margin: '0 0 0.25rem 0', fontSize: '1.1rem' },
    vUserEmail: { margin: 0, fontSize: '0.85rem', color: '#64748b' },
    docsList: { display: 'flex', gap: '0.75rem' },
    docLink: { border: '1px solid #cbd5e1', background: 'white', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    vActions: { display: 'flex', gap: '0.75rem' },
    approveBtn: { backgroundColor: '#4F96FF', color: 'white', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    rejectBtn: { backgroundColor: 'white', color: '#ef4444', border: '1px solid #ef4444', padding: '0.5rem 1.25rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    emptyState: { textAlign: 'center', padding: '3rem', color: '#94a3b8' },
    tabBadge: {
        backgroundColor: '#ef4444',
        color: 'white',
        fontSize: '0.7rem',
        padding: '0.1rem 0.4rem',
        borderRadius: '50px',
        marginLeft: '0.5rem',
        fontWeight: 'bold'
    },

    // Payment Approval Styles
    paymentApprovalList: { padding: '1rem' },
    donorCell: { display: 'flex', alignItems: 'center', gap: '1rem' },
    donorIcon: {
        width: '32px', height: '32px', backgroundColor: '#f1f5f9',
        borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#64748b'
    },
    approveIconBtn: {
        border: '1px solid #bfdbfe', background: '#eff6ff', padding: '0.4rem',
        borderRadius: '8px', cursor: 'pointer', color: '#4F96FF',
        transition: 'all 0.2s'
    },
    rejectIconBtn: {
        border: '1px solid #fee2e2', background: '#fef2f2', padding: '0.4rem',
        borderRadius: '8px', cursor: 'pointer', color: '#ef4444',
        transition: 'all 0.2s'
    },

    // Dashboard Overview Styles
    dashboardOverview: { padding: '1rem' },
    overviewTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem' },
    overviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    overviewCard: { backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' },
    overviewCardTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', marginTop: 0 },

    // Activity Feed
    activityList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    activityItem: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start' },
    activityDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb', marginTop: '0.4rem', flexShrink: 0 },
    activityText: { margin: 0, fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' },
    activityTime: { margin: 0, fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' },

    // Quick Stats
    quickStats: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    quickStatItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' },
    quickStatLabel: { fontSize: '0.9rem', color: '#64748b', fontWeight: '500' },
    quickStatValue: { fontSize: '1.25rem', fontWeight: '700', color: '#2563eb' },

    // Support messages
    supportList: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
    supportCard: {
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    supportHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    supportAvatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#e0f2fe',
        color: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700
    },
    supportName: { fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#0f172a' },
    supportMeta: { fontSize: '0.8rem', color: '#64748b', marginTop: '0.1rem' },
    supportMessage: { margin: 0, fontSize: '0.9rem', color: '#1f2933', lineHeight: 1.4 },
    supportActions: { display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' },
    supportDoneBtn: {
        padding: '0.35rem 0.9rem',
        borderRadius: '999px',
        border: '1px solid #22c55e',
        backgroundColor: '#f0fdf4',
        color: '#16a34a',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer'
    }
};

const AdminDashboardWithBoundary = () => (
    <ErrorBoundary>
        <AdminDashboard />
    </ErrorBoundary>
);

export default AdminDashboardWithBoundary;

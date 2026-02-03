import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminCampaignForm from '../components/AdminCampaignForm';
import { useAuth } from '../context/AuthContext';
import { useCampaigns } from '../context/CampaignContext';
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
    Shield
} from 'lucide-react';
import logo from '../assets/logo.png';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const campaignsData = useCampaigns();

    // Safety check for context
    if (!campaignsData) {
        console.error("CampaignContext not found!");
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Error: System context not initialized.</div>;
    }

    const { campaigns = [], users = [], addCampaign, updateCampaign, deleteCampaign, updateUserStatus } = campaignsData;

    const [activeTab, setActiveTab] = useState('Campaigns');
    const [searchQuery, setSearchQuery] = useState('');

    // Redirect to home if user logs out
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);

    // Final safety check for users/campaigns before rendering
    if (!Array.isArray(campaigns) || !Array.isArray(users)) {
        console.error("Campaigns or Users data is not an array", { campaigns, users });
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard data...</div>;
    }

    // Calculate real-time statistics
    const totalRaised = campaigns.reduce((sum, c) => sum + (c.raised || 0), 0);
    const activeCampaignsCount = campaigns.filter(c => c.isActive).length;
    const pendingVerifications = users.filter(u => u.status === 'Pending').length;

    const stats = [
        { label: 'Total Users', value: users.length, icon: <Users size={20} />, color: '#4F96FF' },
        { label: 'Active Campaigns', value: activeCampaignsCount, icon: <TrendingUp size={20} />, color: '#10b981' },
        { label: 'Pending Verifications', value: pendingVerifications, icon: <FileCheck size={20} />, color: '#f59e0b' },
        { label: 'Total Raised', value: `Rs. ${totalRaised.toLocaleString()}`, icon: <Shield size={20} />, color: '#4F96FF' },
    ];

    const filteredCampaigns = campaigns.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddCampaign = () => {
        setEditingCampaign(null);
        setIsFormOpen(true);
    };

    const handleEditCampaign = (campaign) => {
        setEditingCampaign(campaign);
        setIsFormOpen(true);
    };

    const handleSaveCampaign = (data) => {
        if (editingCampaign) {
            updateCampaign(editingCampaign.id, data);
        } else {
            addCampaign({
                ...data,
                image: campaigns[0]?.image // Placeholder image for new campaigns
            });
        }
    };

    return (
        <div style={styles.page}>
            <Navbar minimal={true} />

            <div className="container" style={styles.container}>
                <div style={styles.dashboardLayout}>
                    {/* Admin Sidebar */}
                    <aside style={styles.sidebar}>
                        <div style={styles.adminProfile}>
                            <div style={styles.adminAvatar}>
                                <Shield size={32} color="white" />
                            </div>
                            <div style={styles.adminInfo}>
                                <p style={styles.adminRole}>System Administrator</p>
                                <h3 style={styles.adminName}>{user?.name || 'Admin'}</h3>
                            </div>
                        </div>

                        <nav style={styles.sideNav}>
                            <button
                                onClick={() => setActiveTab('Dashboard')}
                                style={{ ...styles.navItem, ...(activeTab === 'Dashboard' ? styles.activeNavItem : {}) }}
                            >
                                <LayoutDashboard size={20} /> Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('Campaigns')}
                                style={{ ...styles.navItem, ...(activeTab === 'Campaigns' ? styles.activeNavItem : {}) }}
                            >
                                <TrendingUp size={20} /> Manage Campaigns
                            </button>
                            <button
                                onClick={() => setActiveTab('Verification')}
                                style={{ ...styles.navItem, ...(activeTab === 'Verification' ? styles.activeNavItem : {}) }}
                            >
                                <FileCheck size={20} /> Verifications
                            </button>
                            <button
                                onClick={() => setActiveTab('Users')}
                                style={{ ...styles.navItem, ...(activeTab === 'Users' ? styles.activeNavItem : {}) }}
                            >
                                <Users size={20} /> User Management
                            </button>
                        </nav>

                        <div style={styles.sidebarFooter}>
                            <img src={logo} alt="KindCents" style={{ height: '30px', opacity: 0.7 }} />
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main style={styles.mainArea}>
                        <header style={styles.areaHeader}>
                            <h2 style={styles.areaTitle}>{activeTab}</h2>
                            <div style={styles.headerActions}>
                                <div style={styles.searchBox}>
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
                                    <button onClick={handleAddCampaign} style={styles.addBtn}>
                                        <Plus size={18} /> New Campaign
                                    </button>
                                )}
                            </div>
                        </header>

                        {/* Top Stats */}
                        <div style={styles.statsRow}>
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
                        <div style={styles.contentCard}>
                            {activeTab === 'Campaigns' && (
                                <table style={styles.table}>
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
                                                        <img src={c.image} alt="" style={styles.tableImg} />
                                                        <div>
                                                            <div style={styles.tableMainText}>{c.title}</div>
                                                            <div style={styles.tableSubText}>{c.category}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>Rs. {c.goal.toLocaleString()}</td>
                                                <td style={styles.td}>
                                                    <div style={styles.progressCell}>
                                                        <span>Rs. {c.raised.toLocaleString()}</span>
                                                        <div style={styles.miniProgressTrack}>
                                                            <div style={{ ...styles.miniProgressFill, width: `${(c.raised / c.goal) * 100}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={c.isActive ? styles.badgeSuccess : styles.badgeDanger}>
                                                        {c.isActive ? 'Active' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={styles.actionRow}>
                                                        <button
                                                            onClick={() => handleEditCampaign(c)}
                                                            style={styles.iconBtn}
                                                            title="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => { if (window.confirm('Delete this campaign?')) deleteCampaign(c.id); }}
                                                            style={styles.deleteBtn}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
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
                                    {users.filter(u => u.status === 'Pending').length === 0 ? (
                                        <div style={styles.emptyState}>No pending verifications</div>
                                    ) : (
                                        users.filter(u => u.status === 'Pending').map(u => (
                                            <div key={u.id} style={styles.verificationCard}>
                                                <div style={styles.userMain}>
                                                    <div style={styles.userAvatar}>{u.name.charAt(0)}</div>
                                                    <div>
                                                        <h4 style={styles.vUserName}>{u.name}</h4>
                                                        <p style={styles.vUserEmail}>{u.email} • {u.role}</p>
                                                    </div>
                                                </div>
                                                <div style={styles.docsList}>
                                                    <button style={styles.docLink}><Plus size={14} /> View Gov ID</button>
                                                    <button style={styles.docLink}><Plus size={14} /> View Medical Records</button>
                                                </div>
                                                <div style={styles.vActions}>
                                                    <button
                                                        onClick={() => updateUserStatus(u.id, 'Verified')}
                                                        style={styles.approveBtn}
                                                    >
                                                        <Check size={16} /> Approve
                                                    </button>
                                                    <button style={styles.rejectBtn}><X size={16} /> Reject</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'Dashboard' && (
                                <div style={styles.dashboardOverview}>
                                    <h3 style={styles.overviewTitle}>Platform Overview</h3>

                                    <div style={styles.overviewGrid}>
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

                            {activeTab === 'Users' && (
                                <table style={styles.table}>
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
                                                <td style={styles.td}>{u.role}</td>
                                                <td style={styles.td}>{u.signupDate}</td>
                                                <td style={styles.td}>
                                                    <span style={u.status === 'Verified' ? styles.badgeSuccess : styles.badgeWarning}>
                                                        {u.status}
                                                    </span>
                                                </td>
                                                <td style={styles.td}><MoreVertical size={16} color="#94a3b8" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#f0f4f8', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    container: { paddingTop: '100px', paddingBottom: '3rem', flex: 1 },
    dashboardLayout: { display: 'flex', gap: '2rem', minHeight: '700px' },
    sidebar: {
        width: '280px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '2.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        color: '#1e293b',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    },
    adminProfile: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' },
    adminAvatar: { width: '56px', height: '56px', backgroundColor: '#4F96FF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    adminRole: { fontSize: '0.75rem', color: '#64748b', margin: 0, textTransform: 'uppercase', fontWeight: 700 },
    adminName: { fontSize: '1.1rem', fontWeight: '700', margin: 0, color: '#1e293b' },
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
    activeNavItem: { backgroundColor: '#e0f2fe', color: '#4F96FF', fontWeight: 600 },
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
        backgroundColor: '#1e293b',
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
    miniProgressFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: '2px' },
    badgeSuccess: { backgroundColor: '#dcfce7', color: '#10b981', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 },
    badgeDanger: { backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 },
    badgeWarning: { backgroundColor: '#fef3c7', color: '#f59e0b', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 },
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
    approveBtn: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    rejectBtn: { backgroundColor: 'white', color: '#ef4444', border: '1px solid #ef4444', padding: '0.5rem 1.25rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    emptyState: { textAlign: 'center', padding: '3rem', color: '#94a3b8' },

    // Dashboard Overview Styles
    dashboardOverview: { padding: '1rem' },
    overviewTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem' },
    overviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    overviewCard: { backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' },
    overviewCardTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', marginTop: 0 },

    // Activity Feed
    activityList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    activityItem: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start' },
    activityDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4F96FF', marginTop: '0.4rem', flexShrink: 0 },
    activityText: { margin: 0, fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' },
    activityTime: { margin: 0, fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' },

    // Quick Stats
    quickStats: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    quickStatItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' },
    quickStatLabel: { fontSize: '0.9rem', color: '#64748b', fontWeight: '500' },
    quickStatValue: { fontSize: '1.25rem', fontWeight: '700', color: '#4F96FF' }
};

export default AdminDashboard;

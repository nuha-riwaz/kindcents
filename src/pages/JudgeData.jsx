import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCampaigns } from '../context/CampaignContext';

const JudgeData = () => {
    const { user } = useAuth();
    const {
        campaigns = [],
        users = [],
        donations = [],
        expenses = [],
        loading
    } = useCampaigns();

    const navigate = useNavigate();

    // Restrict access to admin only (for judges, via shared admin credentials)
    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        const email = (user.email || '').toLowerCase();
        const role = (user.role || '').toLowerCase();
        const isAdmin = role === 'admin' || email === 'admin@kindcents.org';
        if (!isAdmin) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div style={styles.page}>
            {/* Minimal navbar with no user dropdown for judges */}
            <Navbar minimal={true} hideUserMenu={true} />
            <div className="container" style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Judge Data View (Read‑only)</h1>
                    <p style={styles.subtitle}>
                        This hidden page shows a live, read‑only snapshot of the main Firestore collections for evaluation purposes.
                        It is not linked from the public site and is intended only for judges reviewing the project.
                    </p>
                </div>

                {loading ? (
                    <div style={styles.loading}>Loading live data from Firestore...</div>
                ) : (
                    <div style={styles.grid}>
                        {/* Campaigns */}
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>
                                Campaigns <span style={styles.count}>({campaigns.length})</span>
                            </h2>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Title</th>
                                            <th style={styles.th}>Type</th>
                                            <th style={styles.th}>Goal</th>
                                            <th style={styles.th}>Raised</th>
                                            <th style={styles.th}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaigns.map((c) => (
                                            <tr key={c.id} style={styles.tr}>
                                                <td style={styles.td}>{c.title}</td>
                                                <td style={styles.td}>{c.type || 'campaign'}</td>
                                                <td style={styles.td}>Rs. {(c.goal || 0).toLocaleString()}</td>
                                                <td style={styles.td}>Rs. {(c.raised || 0).toLocaleString()}</td>
                                                <td style={styles.td}>{c.isActive ? 'Active' : (c.status || 'Draft')}</td>
                                            </tr>
                                        ))}
                                        {campaigns.length === 0 && (
                                            <tr>
                                                <td style={styles.emptyCell} colSpan={5}>No campaigns found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Users */}
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>
                                Users <span style={styles.count}>({users.length})</span>
                            </h2>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Name</th>
                                            <th style={styles.th}>Email</th>
                                            <th style={styles.th}>Role</th>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id} style={styles.tr}>
                                                <td style={styles.td}>{u.name || 'N/A'}</td>
                                                <td style={styles.td}>{u.email}</td>
                                                <td style={styles.td}>{u.role || 'N/A'}</td>
                                                <td style={styles.td}>{u.status || 'N/A'}</td>
                                                <td style={styles.td}>{u.signupDate || 'N/A'}</td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td style={styles.emptyCell} colSpan={5}>No users found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Donations */}
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>
                                Donations <span style={styles.count}>({donations.length})</span>
                            </h2>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Donor</th>
                                            <th style={styles.th}>Email/User</th>
                                            <th style={styles.th}>Campaign</th>
                                            <th style={styles.th}>Amount</th>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donations.map((d) => (
                                            <tr key={d.id} style={styles.tr}>
                                                <td style={styles.td}>{d.cardName || 'Anonymous'}</td>
                                                <td style={styles.td}>{d.email || d.userId}</td>
                                                <td style={styles.td}>{d.campaignTitle}</td>
                                                <td style={styles.td}>Rs. {(d.amount || 0).toLocaleString()}</td>
                                                <td style={styles.td}>{d.status}</td>
                                                <td style={styles.td}>{d.date}</td>
                                            </tr>
                                        ))}
                                        {donations.length === 0 && (
                                            <tr>
                                                <td style={styles.emptyCell} colSpan={6}>No donations found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Expenses */}
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>
                                Expenses <span style={styles.count}>({expenses.length})</span>
                            </h2>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Campaign ID</th>
                                            <th style={styles.th}>User ID</th>
                                            <th style={styles.th}>Amount</th>
                                            <th style={styles.th}>Description</th>
                                            <th style={styles.th}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map((e) => (
                                            <tr key={e.id} style={styles.tr}>
                                                <td style={styles.td}>{e.campaignId}</td>
                                                <td style={styles.td}>{e.userId}</td>
                                                <td style={styles.td}>Rs. {(e.amount || 0).toLocaleString()}</td>
                                                <td style={styles.td}>{e.description}</td>
                                                <td style={styles.td}>{e.date}</td>
                                            </tr>
                                        ))}
                                        {expenses.length === 0 && (
                                            <tr>
                                                <td style={styles.emptyCell} colSpan={5}>No expenses found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}

                <p style={styles.footerNote}>
                    Note: This view is read‑only and powered by real‑time listeners on the live Firestore database.
                    It is intended solely for judges evaluating the project remotely.
                </p>
            </div>
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#f0f4f8',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
    },
    container: {
        paddingTop: '100px',
        paddingBottom: '3rem',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem'
    },
    header: {
        marginBottom: '1.5rem'
    },
    title: {
        fontSize: '1.9rem',
        fontWeight: 800,
        color: '#0f172a',
        margin: 0,
        marginBottom: '0.5rem'
    },
    subtitle: {
        margin: 0,
        color: '#64748b',
        fontSize: '0.95rem',
        maxWidth: '720px'
    },
    loading: {
        padding: '2rem',
        textAlign: 'center',
        color: '#64748b'
    },
    grid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    section: {
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e2e8f0',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.03)'
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#0f172a',
        margin: 0,
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    count: {
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#64748b',
        backgroundColor: '#eff6ff',
        padding: '0.1rem 0.6rem',
        borderRadius: '999px'
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '640px'
    },
    th: {
        textAlign: 'left',
        padding: '0.6rem 0.75rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#64748b',
        borderBottom: '1px solid #eef2f7',
        whiteSpace: 'nowrap'
    },
    tr: {
        borderBottom: '1px solid #f1f5f9'
    },
    td: {
        padding: '0.7rem 0.75rem',
        fontSize: '0.85rem',
        color: '#0f172a',
        verticalAlign: 'top'
    },
    emptyCell: {
        padding: '0.8rem 0.75rem',
        fontSize: '0.85rem',
        color: '#94a3b8',
        textAlign: 'center'
    },
    footerNote: {
        marginTop: '1.5rem',
        fontSize: '0.8rem',
        color: '#94a3b8'
    }
};

export default JudgeData;


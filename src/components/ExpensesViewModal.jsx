import React, { useState } from 'react';
import { X, FileText, Calendar, IndianRupee, ZoomIn, Trash2 } from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';

const ExpensesViewModal = ({ isOpen, onClose, campaign, expenses }) => {
    const { deleteExpense } = useCampaigns();

    // Add styles for hover effects
    React.useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .hover-btn-ghost-red:hover { background-color: #fef2f2 !important; color: #dc2626 !important; }
            .hover-btn-ghost-blue:hover { background-color: #eff6ff !important; color: #2563eb !important; }
            .hover-close-btn:hover { background-color: #f1f5f9 !important; }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    if (!isOpen || !campaign) return null;

    const openImageInNewTab = (base64String) => {
        // Convert base64 to Blob to allow opening in new tab without URL length limits
        fetch(base64String)
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            });
    };

    // Filter expenses for this campaign
    const campaignExpenses = expenses.filter(e => e.campaignId === campaign.id);
    const totalSpent = campaignExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <div>
                        <h3 style={styles.title}>Campaign Expenses</h3>
                        <p style={styles.subtitle}>{campaign.title}</p>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn} className="hover-close-btn">
                        <X size={24} />
                    </button>
                </div>

                <div style={styles.summaryCard}>
                    <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>Total Raised</span>
                        <span style={styles.summaryValue}>Rs. {(campaign.raised || 0).toLocaleString()}</span>
                    </div>
                    <div style={styles.divider}></div>
                    <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>Total Spent</span>
                        <span style={{ ...styles.summaryValue, color: '#ef4444' }}>Rs. {totalSpent.toLocaleString()}</span>
                    </div>
                </div>

                <div style={styles.expensesList}>
                    {campaignExpenses.length === 0 ? (
                        <div style={styles.emptyState}>
                            <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p>No expenses uploaded yet.</p>
                        </div>
                    ) : (
                        campaignExpenses.map(expense => (
                            <div key={expense.id} style={styles.expenseCard}>
                                <div style={styles.expenseHeader}>
                                    <div style={styles.expenseDate}>
                                        <Calendar size={14} />
                                        {expense.date || new Date(expense.createdAt?.seconds * 1000).toLocaleDateString()}
                                    </div>
                                    <div style={styles.expenseAmount}>
                                        - Rs. {expense.amount.toLocaleString()}
                                    </div>
                                </div>
                                <p style={styles.expenseDesc}>{expense.description}</p>
                                {expense.image && (
                                    <div style={styles.proofImageContainer}>
                                        <img src={expense.image} alt="Expense Proof" style={styles.proofImage} />
                                        <button
                                            onClick={() => openImageInNewTab(expense.image)}
                                            style={styles.viewProofBtn}
                                            className="hover-btn-ghost-blue"
                                        >
                                            <ZoomIn size={14} /> View Full Image
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={async () => {
                                        if (window.confirm("Are you sure you want to delete this expense?")) {
                                            try {
                                                await deleteExpense(expense.id);
                                            } catch (err) {
                                                alert("Failed to delete expense");
                                            }
                                        }
                                    }}
                                    style={styles.deleteExpenseBtn}
                                    className="hover-btn-ghost-red"
                                >
                                    <Trash2 size={14} /> Delete Expense
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    header: {
        padding: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0
    },
    subtitle: {
        fontSize: '0.9rem',
        color: '#64748b',
        marginTop: '0.25rem',
        margin: 0
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#94a3b8',
        padding: '0.5rem',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s'
    },
    summaryCard: {
        margin: '1.5rem 1.5rem 0',
        backgroundColor: '#f8fafc',
        padding: '1rem',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        border: '1px solid #e2e8f0'
    },
    summaryItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem'
    },
    summaryLabel: {
        fontSize: '0.8rem',
        color: '#64748b',
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    summaryValue: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#1e293b'
    },
    divider: {
        width: '1px',
        height: '40px',
        backgroundColor: '#cbd5e1'
    },
    expensesList: {
        padding: '1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: '#94a3b8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    expenseCard: {
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1rem',
        backgroundColor: 'white'
    },
    expenseHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
    },
    expenseDate: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.8rem',
        color: '#94a3b8'
    },
    expenseAmount: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#ef4444'
    },
    expenseDesc: {
        fontSize: '0.95rem',
        color: '#334155',
        margin: '0 0 1rem 0'
    },
    proofImageContainer: {
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
    },
    proofImage: {
        width: '100%',
        height: 'auto',
        maxHeight: '300px',
        objectFit: 'contain',
        backgroundColor: '#f1f5f9'
    },
    viewProofBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        width: '100%',
        backgroundColor: '#f8fafc',
        color: '#2563eb',
        fontSize: '0.85rem',
        fontWeight: '600',
        border: 'none',
        borderTop: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'background 0.2s'
    },
    deleteExpenseBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        width: '100%',
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        fontSize: '0.85rem',
        fontWeight: '600',
        border: 'none',
        marginTop: '0.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background 0.2s'
    }
};

export default ExpensesViewModal;

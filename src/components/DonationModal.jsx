import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, ChevronRight } from 'lucide-react';

const DonationModal = ({ isOpen, onClose, campaignTitle, onDonate }) => {
    const [amount, setAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleAmountSelect = (val) => {
        setAmount(val);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        setCustomAmount(e.target.value);
        setAmount(Number(e.target.value));
    };

    const handleNext = () => {
        if (amount > 0) setStep(2);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network request
        setTimeout(async () => {
            await onDonate(amount);
            setLoading(false);
            setStep(3);
        }, 2000);
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button style={styles.closeBtn} onClick={onClose}><X size={20} /></button>

                {step === 1 && (
                    <div style={styles.content}>
                        <div style={styles.header}>
                            <h3 style={styles.title}>Donate to a Cause</h3>
                            <p style={styles.subtitle}>Supporting <strong>{campaignTitle}</strong></p>
                        </div>

                        <div style={styles.amountGrid}>
                            {[1000, 5000, 10000].map(val => (
                                <button
                                    key={val}
                                    style={{
                                        ...styles.amountBtn,
                                        ...(amount === val && !customAmount ? styles.activeAmountBtn : {})
                                    }}
                                    onClick={() => handleAmountSelect(val)}
                                >
                                    Rs. {val.toLocaleString()}
                                </button>
                            ))}
                            <div style={styles.inputWrapper}>
                                <span style={styles.currency}>Rs.</span>
                                <input
                                    type="number"
                                    placeholder="Other Amount"
                                    style={styles.customInput}
                                    value={customAmount}
                                    onChange={handleCustomAmountChange}
                                />
                            </div>
                        </div>

                        <button
                            style={{ ...styles.primaryBtn, opacity: amount > 0 ? 1 : 0.5 }}
                            onClick={handleNext}
                            disabled={amount <= 0}
                        >
                            Continue <ChevronRight size={18} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <form style={styles.content} onSubmit={handlePayment}>
                        <div style={styles.header}>
                            <h3 style={styles.title}>Secure Payment</h3>
                            <div style={styles.amountDisplay}>
                                <span style={styles.amountLabel}>Total Donation</span>
                                <span style={styles.amountValue}>Rs. {amount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Card Number</label>
                            <div style={styles.inputWithIcon}>
                                <CreditCard size={18} color="#94a3b8" />
                                <input type="text" placeholder="0000 0000 0000 0000" style={styles.input} required />
                            </div>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Expiry</label>
                                <input type="text" placeholder="MM/YY" style={styles.input} required />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>CVC</label>
                                <input type="text" placeholder="123" style={styles.input} required />
                            </div>
                        </div>

                        <div style={styles.secureNotice}>
                            <Lock size={12} /> This is a secure 256-bit encrypted transaction.
                        </div>

                        <button
                            type="submit"
                            style={styles.payBtn}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Pay Rs. ${amount.toLocaleString()}`}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div style={styles.successState}>
                        <div style={styles.successIcon}>
                            <CheckCircle2 size={48} color="#10b981" />
                        </div>
                        <h3 style={styles.successTitle}>Thank You!</h3>
                        <p style={styles.successText}>
                            Your donation of <strong>Rs. {amount.toLocaleString()}</strong> has been successfully received.
                        </p>
                        <button style={styles.primaryBtn} onClick={onClose}>Done</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    },
    modal: {
        backgroundColor: '#fff', borderRadius: '24px', width: '90%', maxWidth: '420px',
        padding: '2rem', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    closeBtn: {
        position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'
    },
    content: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    header: { textAlign: 'center' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 },
    subtitle: { fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' },
    amountGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
    amountBtn: {
        padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px',
        backgroundColor: '#fff', fontSize: '1rem', fontWeight: '600', color: '#475569', cursor: 'pointer',
        transition: 'all 0.2s'
    },
    activeAmountBtn: { borderColor: '#2563eb', backgroundColor: '#eff6ff', color: '#2563eb' },
    inputWrapper: {
        position: 'relative', border: '1px solid #e2e8f0', borderRadius: '12px',
        display: 'flex', alignItems: 'center', overflow: 'hidden'
    },
    currency: { paddingLeft: '1rem', fontWeight: '600', color: '#64748b' },
    customInput: {
        width: '100%', padding: '1rem', border: 'none', outline: 'none',
        fontSize: '1rem', fontWeight: '600', color: '#1e293b'
    },
    primaryBtn: {
        backgroundColor: '#1e293b', color: 'white', padding: '1rem', borderRadius: '12px',
        border: 'none', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        marginTop: '0.5rem'
    },
    amountDisplay: {
        marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    amountLabel: { fontSize: '0.9rem', color: '#64748b', fontWeight: '500' },
    amountValue: { fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.85rem', fontWeight: '600', color: '#475569' },
    inputWithIcon: {
        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
        border: '1px solid #e2e8f0', borderRadius: '12px'
    },
    input: { border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: '#1e293b' },
    row: { display: 'flex', gap: '1rem' },
    secureNotice: {
        fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center',
        gap: '0.4rem', justifyContent: 'center', marginTop: '0.5rem'
    },
    payBtn: {
        backgroundColor: '#10b981', color: 'white', padding: '1rem', borderRadius: '12px',
        border: 'none', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.5rem'
    },
    successState: { textAlign: 'center', padding: '1rem 0' },
    successIcon: { marginBottom: '1rem' },
    successTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#10b981', margin: '0 0 0.5rem 0' },
    successText: { fontSize: '1rem', color: '#475569', lineHeight: '1.5', marginBottom: '2rem' }
};

export default DonationModal;

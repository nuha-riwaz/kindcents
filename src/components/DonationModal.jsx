import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle2, ChevronRight, Info, ShieldCheck } from 'lucide-react';

const DonationModal = ({ isOpen, onClose, campaignTitle, onDonate }) => {
    const [amount, setAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [email, setEmail] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);
    const [brand, setBrand] = useState('Generic');

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setAmount('');
            setCustomAmount('');
            setCardNumber('');
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAmountSelect = (val) => {
        setAmount(val);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        setCustomAmount(e.target.value);
        setAmount(Number(e.target.value));
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const handleCardChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);

        // Simple brand detection
        if (formatted.startsWith('4')) setBrand('Visa');
        else if (formatted.startsWith('5')) setBrand('Mastercard');
        else setBrand('Generic');
    };

    const handleNext = () => {
        if (amount > 0) setStep(2);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate Stripe-style processing
        setTimeout(async () => {
            await onDonate({ amount, cardName, email });
            setLoading(false);
            setStep(3);
        }, 2200);
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button style={styles.closeBtn} onClick={onClose}><X size={20} /></button>

                {step === 1 && (
                    <div style={styles.content}>
                        <div style={styles.stripeHeader}>
                            <div style={styles.brandCircle}>KC</div>
                            <h3 style={styles.stripeTitle}>Donate to {campaignTitle}</h3>
                        </div>

                        <div style={styles.amountSection}>
                            <p style={styles.sectionLabel}>Select amount</p>
                            <div style={styles.amountGrid}>
                                {[1000, 5000, 10000, 25000].map(val => (
                                    <button
                                        key={val}
                                        style={{
                                            ...styles.amountBtnStripe,
                                            ...(amount === val && !customAmount ? styles.activeAmountBtnStripe : {})
                                        }}
                                        onClick={() => handleAmountSelect(val)}
                                    >
                                        Rs. {val.toLocaleString()}
                                    </button>
                                ))}
                                <div style={styles.inputWrapperStripe}>
                                    <span style={styles.currencyStripe}>Rs.</span>
                                    <input
                                        type="number"
                                        placeholder="Other"
                                        style={styles.customInputStripe}
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            style={{ ...styles.primaryBtnStripe, opacity: amount > 0 ? 1 : 0.6 }}
                            onClick={handleNext}
                            disabled={amount <= 0}
                        >
                            Review donation <ChevronRight size={18} />
                        </button>

                        <div style={styles.stripeFooter}>
                            <Lock size={12} /> Secure donation powered by <strong>Stripe</strong>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <form style={styles.content} onSubmit={handlePayment}>
                        <div style={styles.stripeHeaderSmall}>
                            <span style={styles.backLink} onClick={() => setStep(1)}>← Back</span>
                            <h3 style={styles.amountHeader}>Rs. {amount.toLocaleString()}</h3>
                            <p style={styles.toLabel}>to {campaignTitle}</p>
                        </div>

                        <div style={styles.stripeForm}>
                            <div style={styles.formGroupStripe}>
                                <label style={styles.labelStripe}>Email</label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    style={styles.inputStripe}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={styles.formGroupStripe}>
                                <label style={styles.labelStripe}>Card information</label>
                                <div style={styles.cardInputWrapper}>
                                    <div style={styles.cardNumberBox}>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 1234 5678"
                                            style={styles.inputStripeNoBorder}
                                            value={cardNumber}
                                            onChange={handleCardChange}
                                            maxLength="19"
                                            required
                                        />
                                        <div style={styles.brandIcon}>
                                            {brand === 'Visa' && <img src="https://img.icons8.com/color/48/visa.png" width="24" alt="Visa Card Logo" />}
                                            {brand === 'Mastercard' && <img src="https://img.icons8.com/color/48/mastercard.png" width="24" alt="Mastercard Logo" />}
                                            {brand === 'Generic' && <CreditCard size={18} color="#94a3b8" />}
                                        </div>
                                    </div>
                                    <div style={styles.cardMetaRow}>
                                        <input type="text" placeholder="MM / YY" style={styles.inputStripeHalf} required />
                                        <input type="text" placeholder="CVC" style={styles.inputStripeHalfLast} required />
                                    </div>
                                </div>
                            </div>

                            <div style={styles.formGroupStripe}>
                                <label style={styles.labelStripe}>Name on card</label>
                                <input
                                    type="text"
                                    placeholder="Full name on card"
                                    style={styles.inputStripe}
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={styles.payBtnStripe}
                            disabled={loading}
                        >
                            {loading ? (
                                <div style={styles.loadingFlex}>
                                    <div style={styles.spinnerStripe}></div>
                                    Processing...
                                </div>
                            ) : `Donate Rs. ${amount.toLocaleString()}`}
                        </button>

                        <div style={styles.stripeSecurityRow}>
                            <ShieldCheck size={14} color="#10b981" />
                            <span>This is a secure 256-bit encrypted transaction.</span>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div style={styles.successStateStripe}>
                        <div style={styles.successIconStripe}>
                            <CheckCircle2 size={56} color="#10b981" />
                        </div>
                        <h3 style={styles.successTitleStripe}>Payment successful</h3>
                        <p style={styles.successTextStripe}>
                            Thank you for your donation of <strong>Rs. {amount.toLocaleString()}</strong>.
                            It is currently awaiting admin approval and will reflect in the campaign's total shortly.
                        </p>
                        <button style={styles.primaryBtnStripe} onClick={onClose}>Done</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
    },
    modal: {
        backgroundColor: '#ffffff', borderRadius: '16px', width: '95%', maxWidth: '420px',
        padding: '2.5rem', position: 'relative', boxShadow: '0 50px 100px -20px rgba(50, 50, 93, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.3)'
    },
    closeBtn: {
        position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#424770', opacity: 0.6
    },
    content: { display: 'flex', flexDirection: 'column', gap: '2rem' },

    // Stripe Themed Header
    stripeHeader: { textAlign: 'center', marginBottom: '1rem' },
    brandCircle: { width: '48px', height: '48px', backgroundColor: '#10b981', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.2rem', fontWeight: '800' },
    stripeTitle: { fontSize: '1.25rem', fontWeight: '700', color: '#1a1f36', margin: 0 },

    // Amount Selection
    amountSection: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    sectionLabel: { fontSize: '0.85rem', color: '#4f566b', fontWeight: '600', margin: 0 },
    amountGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
    amountBtnStripe: {
        padding: '0.85rem', border: '1px solid #e3e8ee', borderRadius: '8px',
        backgroundColor: '#ffffff', fontSize: '0.95rem', fontWeight: '600', color: '#4f566b', cursor: 'pointer',
        transition: 'all 0.15s ease', textAlign: 'center'
    },
    activeAmountBtnStripe: { borderColor: '#10b981', backgroundColor: '#ffffff', color: '#10b981', boxShadow: '0 0 0 1px #10b981' },
    inputWrapperStripe: { position: 'relative', border: '1px solid #e3e8ee', borderRadius: '8px', display: 'flex', alignItems: 'center', overflow: 'hidden' },
    currencyStripe: { paddingLeft: '0.75rem', fontWeight: '600', color: '#94a3b8', fontSize: '0.9rem' },
    customInputStripe: { width: '100%', padding: '0.85rem 0.5rem', border: 'none', outline: 'none', fontSize: '0.95rem', fontWeight: '600', color: '#1a1f36' },

    // Stripe Inputs
    stripeForm: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    formGroupStripe: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
    labelStripe: { fontSize: '0.85rem', fontWeight: '600', color: '#1a1f36' },
    inputStripe: { padding: '0.75rem 1rem', border: '1px solid #e3e8ee', borderRadius: '8px', fontSize: '1rem', color: '#1a1f36', outlineColor: '#10b981' },
    cardInputWrapper: { border: '1px solid #e3e8ee', borderRadius: '8px', overflow: 'hidden' },
    cardNumberBox: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #e3e8ee', paddingRight: '1rem' },
    inputStripeNoBorder: { border: 'none', outline: 'none', width: '100%', padding: '0.75rem 1rem', fontSize: '1rem', color: '#1a1f36' },
    cardMetaRow: { display: 'flex' },
    inputStripeHalf: { border: 'none', borderRight: '1px solid #e3e8ee', outline: 'none', width: '50%', padding: '0.75rem 1rem', fontSize: '1rem', color: '#1a1f36' },
    inputStripeHalfLast: { border: 'none', outline: 'none', width: '50%', padding: '0.75rem 1rem', fontSize: '1rem', color: '#1a1f36' },

    // Buttons
    primaryBtnStripe: {
        backgroundColor: '#10b981', color: 'white', padding: '0.85rem', borderRadius: '8px',
        border: 'none', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)', transition: 'background 0.2s'
    },
    payBtnStripe: {
        backgroundColor: '#10b981', color: 'white', padding: '1rem', borderRadius: '8px',
        border: 'none', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)', transition: 'background 0.2s'
    },

    // UI Extras
    stripeHeaderSmall: { textAlign: 'center', marginBottom: '0.5rem' },
    backLink: { position: 'absolute', left: '2.5rem', top: '2.5rem', fontSize: '0.85rem', color: '#10b981', cursor: 'pointer', fontWeight: '600' },
    amountHeader: { fontSize: '1.75rem', fontWeight: '800', color: '#1a1f36', margin: '0.5rem 0 0.25rem' },
    toLabel: { fontSize: '0.9rem', color: '#4f566b', margin: 0 },
    stripeFooter: { textAlign: 'center', fontSize: '0.75rem', color: '#a3acb9', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' },
    stripeSecurityRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontSize: '0.75rem', color: '#4f566b', marginTop: '0.5rem' },

    // Loading State
    loadingFlex: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' },
    spinnerStripe: { width: '18px', height: '18px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 1s linear infinite' },

    // Success State
    successStateStripe: { textAlign: 'center', padding: '1rem 0' },
    successIconStripe: { marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' },
    successTitleStripe: { fontSize: '1.5rem', fontWeight: '700', color: '#1a1f36', margin: '0 0 1rem 0' },
    successTextStripe: { fontSize: '0.95rem', color: '#4f566b', lineHeight: '1.6', marginBottom: '2.5rem' }
};

// Add global styles for animation
const styleTag = document.createElement('style');
styleTag.innerHTML = `
    @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(styleTag);

export default DonationModal;

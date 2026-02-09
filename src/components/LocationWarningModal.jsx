import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import logo from '../assets/logo.png';

const LocationWarningModal = ({ isOpen, onClose, onConfirm }) => {
    const [showExplanation, setShowExplanation] = useState(false);

    // Reset explanation when modal opens
    useEffect(() => {
        if (isOpen) {
            setShowExplanation(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNoClick = () => {
        setShowExplanation(true);
    };

    const handleClose = () => {
        setShowExplanation(false);
        onClose();
    };

    return (
        <div style={styles.overlay} onClick={handleClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>

                {!showExplanation ? (
                    <>
                        <div style={styles.headerContent}>
                            <img src={logo} alt="KindCents Logo" style={styles.logo} />
                            <h3 style={styles.title}>Are you based in Sri Lanka?</h3>
                        </div>

                        <div style={styles.messageBox}>
                            <p style={styles.description}>
                                Only registered nonprofits and individuals in Sri Lanka can create accounts.
                            </p>
                            <p style={styles.subDescription}>
                                International donors are also required to register to support causes.
                            </p>
                        </div>

                        <div style={styles.actions}>
                            <button style={styles.btn} onClick={onConfirm}>
                                Yes, Continue
                            </button>
                            <button style={styles.btn} onClick={handleNoClick}>
                                No, Learn More
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={styles.headerContent}>
                            <div style={styles.iconWrapper}>
                                <Info size={48} color="#2897c8" />
                            </div>
                            <h3 style={styles.title}>Why Account Registration Is Limited</h3>
                        </div>

                        <div style={styles.messageBox}>
                            <p style={styles.description}>
                                KindCents currently operates primarily in Sri Lanka to ensure:
                            </p>
                            <ul style={styles.list}>
                                <li style={styles.listItem}>✓ Proper verification of nonprofits and campaigns</li>
                                <li style={styles.listItem}>✓ Compliance with local regulations</li>
                                <li style={styles.listItem}>✓ Secure and transparent donations</li>
                                <li style={styles.listItem}>✓ Direct support to Sri Lankan communities</li>
                            </ul>
                            <p style={styles.description}>
                                Account registration is currently limited to:
                            </p>
                            <ul style={styles.bulletList}>
                                <li style={styles.bulletItem}>• Sri Lankan nonprofits</li>
                                <li style={styles.bulletItem}>• Sri Lankan individuals</li>
                                <li style={styles.bulletItem}>• Verified international donors</li>
                            </ul>
                            <p style={styles.subDescription}>
                                Foreign nonprofits and individuals outside Sri Lanka are not eligible to register at this time.
                            </p>
                        </div>

                        <div style={styles.actions}>
                            <button style={styles.btn} onClick={handleClose}>
                                Got it
                            </button>
                        </div>
                    </>
                )}
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(3px)',
        overflowY: 'auto',
        padding: '2rem 0',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '480px',
        padding: '3rem 2rem 2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        animation: 'fadeIn 0.2s ease-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
    },
    closeBtn: {
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#64748b',
        padding: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s'
    },
    headerContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '0.5rem'
    },
    iconWrapper: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#E0F2FE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        height: '60px', // Increased size
        objectFit: 'contain'
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: '#0f172a',
        margin: 0,
        textAlign: 'center',
        lineHeight: 1.3
    },
    messageBox: {
        width: '100%',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#fff', // White background for inner box
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    description: {
        fontSize: '1rem',
        color: '#334155',
        fontWeight: '400', // Unbolded
        margin: 0,
        lineHeight: '1.5'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: '1rem 0',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    listItem: {
        fontSize: '0.95rem',
        color: '#475569',
        lineHeight: '1.5',
        paddingLeft: '0.5rem',
    },
    bulletList: {
        listStyle: 'none',
        padding: 0,
        margin: '1rem 0',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    bulletItem: {
        fontSize: '0.95rem',
        color: '#475569',
        lineHeight: '1.5',
        paddingLeft: '0.5rem',
    },
    subDescription: {
        fontSize: '0.95rem',
        color: '#64748b',
        margin: 0,
        lineHeight: '1.5'
    },
    actions: {
        display: 'flex',
        gap: '2rem', // Increased from 1rem
        width: '100%',
        marginTop: '0.5rem',
        justifyContent: 'center'
    },
    btn: {
        padding: '0.65rem 1.25rem',
        backgroundColor: '#2897c8', // Specific blue
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'opacity 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '140px' // Fixed smaller width instead of flex: 1
    }
};

export default LocationWarningModal;

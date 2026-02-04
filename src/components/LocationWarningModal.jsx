import React from 'react';
import { X } from 'lucide-react';
import logo from '../assets/logo.png';

const LocationWarningModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button style={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>

                <div style={styles.headerContent}>
                    <img src={logo} alt="KindCents" style={styles.logo} />
                    <h3 style={styles.title}>Are you based in Sri Lanka?</h3>
                </div>

                <div style={styles.messageBox}>
                    <p style={styles.description}>
                        Only registered nonprofits and individuals in Sri Lanka can create accounts.
                    </p>
                    <p style={styles.subDescription}>
                        International donors are welcome to support causes.
                    </p>
                </div>

                <div style={styles.actions}>
                    <button style={styles.btn} onClick={onConfirm}>
                        Yes, continue
                    </button>
                    <button style={styles.btn} onClick={onClose}>
                        No
                    </button>
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(3px)',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '480px',
        padding: '3rem 2rem 2rem', // Added top padding for spacing
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        animation: 'fadeIn 0.2s ease-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
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
    logo: {
        height: '45px', // Adjusted size to match proportion
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
    subDescription: {
        fontSize: '0.95rem',
        color: '#64748b',
        margin: 0,
        lineHeight: '1.5'
    },
    actions: {
        display: 'flex',
        gap: '1rem',
        width: '100%',
        marginTop: '0.5rem',
        justifyContent: 'center'
    },
    btn: {
        padding: '0.75rem 1.5rem',
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

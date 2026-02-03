import React, { useState } from 'react';
import { X, Facebook, Twitter, Link as LinkIcon, Check, MessageCircle } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, campaignTitle, campaignUrl }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareLinks = [
        {
            name: 'Facebook',
            icon: <Facebook size={24} />,
            color: '#1877F2',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`
        },
        {
            name: 'X (Twitter)',
            icon: <Twitter size={24} />,
            color: '#000000',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this cause: ${campaignTitle}`)}&url=${encodeURIComponent(campaignUrl)}`
        },
        {
            name: 'WhatsApp',
            icon: <MessageCircle size={24} />,
            color: '#25D366',
            url: `https://wa.me/?text=${encodeURIComponent(`${campaignTitle} - ${campaignUrl}`)}`
        }
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(campaignUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Share Campaign</h3>
                    <button style={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div style={styles.grid}>
                    {shareLinks.map(platform => (
                        <a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.shareItem}
                        >
                            <div style={{ ...styles.iconWrapper, backgroundColor: platform.color }}>
                                {platform.icon}
                            </div>
                            <span style={styles.platformName}>{platform.name}</span>
                        </a>
                    ))}
                    <button style={styles.shareItem} onClick={handleCopy}>
                        <div style={{ ...styles.iconWrapper, backgroundColor: copied ? '#10b981' : '#64748b' }}>
                            {copied ? <Check size={24} /> : <LinkIcon size={24} />}
                        </div>
                        <span style={styles.platformName}>{copied ? 'Copied!' : 'Copy Link'}</span>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(4px)',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '400px',
        padding: '2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        position: 'relative',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0,
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#64748b',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '50%',
        display: 'flex',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#f1f5f9',
        }
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
    },
    shareItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        color: '#475569',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '16px',
        transition: 'transform 0.2s',
    },
    iconWrapper: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    platformName: {
        fontSize: '0.9rem',
        fontWeight: '600',
    }
};

export default ShareModal;

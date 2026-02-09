import React, { useState, useEffect } from 'react';
import { Instagram, Youtube, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
    const { user } = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getUserDashboardPath = () => {
        if (!user) return '/';
        const role = (user.role || 'donor').toLowerCase();

        if (role === 'admin') return '/dashboard/admin';
        if (role === 'ngo' || role === 'nonprofit') return '/dashboard/ngo';
        if (role === 'individual') return '/dashboard/individual';
        return '/dashboard/donor';
    };

    return (
        <footer id="contact" style={styles.footer}>
            <div className="container" style={styles.container}>
                <div style={{
                    ...styles.topSection,
                    gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1.2fr',
                    display: isMobile ? 'flex' : 'grid',
                    flexDirection: isMobile ? 'column' : 'row',
                    textAlign: isMobile ? 'center' : 'left',
                    alignItems: isMobile ? 'center' : 'start',
                    width: '100%',
                    gap: isMobile ? '2rem' : '3rem'
                }}>
                    {/* Logo and Description Column */}
                    <div style={{ ...styles.logoColumn, alignItems: isMobile ? 'center' : 'flex-start', width: '100%' }}>
                        <img src={logo} alt="KindCents Footer Logo" style={{
                            ...styles.logo,
                            marginLeft: isMobile ? '0' : '50px',
                            height: isMobile ? '80px' : '100px'
                        }} />
                        <p style={styles.tagline}>Verified donations. Real Impact.</p>
                        <p style={{ ...styles.description, textAlign: isMobile ? 'center' : 'left' }}>
                            {isMobile ?
                                "A transparent crowdfunding platform connecting verified recipients with trusted donors." :
                                <>A transparent crowdfunding platform<br />connecting verified recipients with<br />trusted donors.</>
                            }
                        </p>
                        <div style={{ ...styles.socials, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                {/* Twitter X Logo */}
                                <svg
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    style={styles.socialIcon}
                                    fill="currentColor"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <Instagram size={20} style={styles.socialIcon} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <Youtube size={20} style={styles.socialIcon} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <Linkedin size={20} style={styles.socialIcon} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div style={{ ...styles.linkColumn, alignItems: isMobile ? 'center' : 'flex-start', width: '100%' }}>
                        <h4 style={styles.heading}>Quick Links</h4>
                        <ul style={{ ...styles.list, alignItems: isMobile ? 'center' : 'flex-start', textAlign: isMobile ? 'center' : 'left' }}>
                            <li style={{ textAlign: isMobile ? 'center' : 'left' }}><Link to="/#about" style={styles.footerLink}>About Us</Link></li>
                            {user && <li style={{ textAlign: isMobile ? 'center' : 'left' }}><Link to={getUserDashboardPath()} style={styles.footerLink}>Dashboard</Link></li>}
                        </ul>
                    </div>

                    {/* Policy Column */}
                    <div style={{ ...styles.linkColumn, alignItems: isMobile ? 'center' : 'flex-start', width: '100%' }}>
                        <h4 style={styles.heading}>Policy</h4>
                        <ul style={{ ...styles.list, alignItems: isMobile ? 'center' : 'flex-start', textAlign: isMobile ? 'center' : 'left' }}>
                            <li style={{ textAlign: isMobile ? 'center' : 'left' }}><Link to="/privacy-policy" style={styles.footerLink}>Privacy Policy</Link></li>
                            <li style={{ textAlign: isMobile ? 'center' : 'left' }}><Link to="/terms-and-conditions" style={styles.footerLink}>Terms & Conditions</Link></li>
                            <li style={{ textAlign: isMobile ? 'center' : 'left' }}><Link to="/verification-process" style={styles.footerLink}>Verification Process</Link></li>
                            <li style={{ textAlign: isMobile ? 'center' : 'left' }}><Link to="/cookie-policy" style={styles.footerLink}>Cookies</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div style={{ ...styles.linkColumn, alignItems: isMobile ? 'center' : 'flex-start', width: '100%' }}>
                        <h4 style={styles.heading}>Contact</h4>
                        <ul style={{ ...styles.list, alignItems: isMobile ? 'center' : 'flex-start', textAlign: isMobile ? 'center' : 'left' }}>
                            <li style={{ textAlign: isMobile ? 'center' : 'left' }}>support@kindcents.org</li>
                            <li style={{ textAlign: isMobile ? 'center' : 'left' }}>3rd Floor, Orion</li>
                            <li style={{ textAlign: isMobile ? 'center' : 'left' }}>Business Centre,</li>
                            <li style={{ textAlign: isMobile ? 'center' : 'left' }}>Alexandra Place,</li>
                            <li style={{ textAlign: isMobile ? 'center' : 'left' }}>Colombo 04,</li>
                            <li style={{ textAlign: isMobile ? 'center' : 'left' }}>Sri Lanka.</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div style={styles.copyright}>
                    © 2026 KindCents | All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#D6E6FF',
        padding: '3rem 0 1.5rem 0',
        marginTop: '4rem',
        color: '#1e293b',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0 1.5rem', // Add horizontal padding to prevent edge collision
    },
    topSection: {
        display: 'grid',
        alignItems: 'start',
    },
    logoColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    logo: {
        width: 'auto',
        maxWidth: '100%', // Prevent overflow on small screens
        objectFit: 'contain',
        marginBottom: '0.5rem',
    },
    tagline: {
        fontWeight: 600,
        fontSize: '1rem',
        margin: 0,
    },
    description: {
        fontSize: '0.85rem',
        lineHeight: '1.5',
        margin: 0,
        color: '#475569',
    },
    socials: {
        display: 'flex',
        gap: '1rem',
        marginTop: '0.5rem',
    },
    socialLink: {
        textDecoration: 'none',
        color: 'inherit',
        display: 'inline-flex',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        cursor: 'pointer',
    },
    socialIcon: {
        color: '#1e293b',
        pointerEvents: 'none',
    },
    linkColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    heading: {
        fontSize: '1.05rem',
        fontWeight: '700',
        margin: 0,
        marginBottom: '0.25rem',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        fontSize: '0.9rem',
        color: '#475569',
    },
    copyright: {
        textAlign: 'center',
        fontSize: '0.85rem',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        paddingTop: '1.5rem',
        color: '#64748b',
    },
    footerLink: {
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
    }
};

export default Footer;

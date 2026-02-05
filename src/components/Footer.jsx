import React from 'react';
import { Instagram, Youtube, Linkedin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
    const { user } = useAuth();

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
                <div style={styles.topSection}>
                    {/* Logo and Description Column */}
                    <div style={styles.logoColumn}>
                        <img src={logo} alt="KindCents" style={styles.logo} />
                        <p style={styles.tagline}>Verified donations. Real Impact.</p>
                        <p style={styles.description}>
                            A transparent crowdfunding platform<br />connecting verified recipients with<br />trusted donors.
                        </p>
                        <div style={styles.socials}>
                            <X size={20} style={styles.socialIcon} />
                            <Instagram size={20} style={styles.socialIcon} />
                            <Youtube size={20} style={styles.socialIcon} />
                            <Linkedin size={20} style={styles.socialIcon} />
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div style={styles.linkColumn}>
                        <h4 style={styles.heading}>Quick Links</h4>
                        <ul style={styles.list}>
                            <li><Link to="/#about" style={styles.footerLink}>About Us</Link></li>
                            {user && <li><Link to={getUserDashboardPath()} style={styles.footerLink}>Dashboard</Link></li>}
                        </ul>
                    </div>

                    {/* Policy Column */}
                    <div style={styles.linkColumn}>
                        <h4 style={styles.heading}>Policy</h4>
                        <ul style={styles.list}>
                            <li><Link to="/privacy-policy" style={styles.footerLink}>Privacy Policy</Link></li>
                            <li><Link to="/terms-and-conditions" style={styles.footerLink}>Terms & Conditions</Link></li>
                            <li><Link to="/verification-process" style={styles.footerLink}>Verification Process</Link></li>
                            <li><Link to="/cookie-policy" style={styles.footerLink}>Cookies</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div style={styles.linkColumn}>
                        <h4 style={styles.heading}>Contact</h4>
                        <ul style={styles.list}>
                            <li>support@kindcents.org</li>
                            <li>3rd Floor, Orion</li>
                            <li>Business Centre,</li>
                            <li>Alexandra Place,</li>
                            <li>Colombo 04,</li>
                            <li>Sri Lanka.</li>
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
    },
    topSection: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
        gap: '3rem',
        marginBottom: '2rem',
        alignItems: 'start',
    },
    logoColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    logo: {
        height: '100px', // Adjusted to 100px
        width: 'auto',
        objectFit: 'contain',
        marginBottom: '0.5rem',
        marginLeft: '-150px', // Shifted left significantly
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
    socialIcon: {
        cursor: 'pointer',
        color: '#1e293b',
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

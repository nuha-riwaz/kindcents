import React from 'react';
import { Facebook, Instagram, Youtube, Linkedin, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div className="container" style={styles.container}>
                <div style={styles.column}>
                    <img src="/src/assets/logo.png" alt="KindCents" style={{ height: '40px', marginBottom: '1rem' }} />
                    <p style={styles.tagline}>Verified donations. Real Impact.</p>
                    <p style={styles.description}>
                        A transparent crowdfunding platform connecting verified recipients with trusted donors.
                    </p>
                    <div style={styles.socials}>
                        <X size={20} />
                        <Instagram size={20} />
                        <Youtube size={20} />
                        <Linkedin size={20} />
                    </div>
                </div>

                <div style={styles.column}>
                    <h4 style={styles.heading}>Quick Links</h4>
                    <ul style={styles.list}>
                        <li>
                            <Link to="/about" style={styles.footerLink}>About Us</Link>
                        </li>
                        <li>
                            <Link to="/campaigns" style={styles.footerLink}>Campaigns</Link>
                        </li>
                        <li>Impact Dashboard</li>
                    </ul>
                </div>

                <div style={styles.column}>
                    <h4 style={styles.heading}>Policy</h4>
                    <ul style={styles.list}>
                        <li>
                            <Link to="/privacy-policy" style={styles.footerLink}>Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="/terms-and-conditions" style={styles.footerLink}>Terms & Conditions</Link>
                        </li>
                        <li>
                            <Link to="/verification-process" style={styles.footerLink}>Verification Process</Link>
                        </li>
                        <li>
                            <Link to="/cookie-policy" style={styles.footerLink}>Cookies</Link>
                        </li>
                    </ul>
                </div>

                <div style={styles.column}>
                    <h4 style={styles.heading}>Contact</h4>
                    <ul style={styles.list}>
                        <li>support@kindcents.org</li>
                        <li>3rd Floor, Orion Business Centre,</li>
                        <li>Alexandra Place,</li>
                        <li>Colombo 04,</li>
                        <li>Sri Lanka.</li>
                    </ul>
                </div>
            </div>
            <div style={styles.copyright}>
                © 2026 KindCents | All Rights Reserved.
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#D6E6FF', // Light blue from image
        padding: '4rem 0 1rem 0',
        marginTop: '4rem',
        color: '#1e293b',
    },
    container: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr',
        gap: '2rem',
        marginBottom: '3rem',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    logoText: {
        fontFamily: 'var(--font-script)',
        fontSize: '2rem',
        color: 'var(--color-primary)',
    },
    tagline: {
        fontWeight: 600,
    },
    description: {
        fontSize: '0.9rem',
        lineHeight: '1.5',
        maxWidth: '300px',
    },
    socials: {
        display: 'flex',
        gap: '1rem',
        marginTop: '0.5rem',
    },
    heading: {
        fontSize: '1.1rem',
        marginBottom: '0.5rem',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        fontSize: '0.95rem',
    },
    copyright: {
        textAlign: 'center',
        fontSize: '0.8rem',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        paddingTop: '1rem',
        color: '#64748b',
    },
    footerLink: {
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
    }
};

export default Footer;

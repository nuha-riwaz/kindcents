import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CookiePolicy = () => {
    return (
        <div style={styles.page}>
            <Navbar />

            <div className="container" style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Cookie Policy</h1>
                    <p style={styles.date}>Last Update: 16 January 2026</p>
                </div>

                <div style={styles.section}>
                    <p style={styles.intro}>
                        KindCents uses cookies and similar technologies to ensure the platform functions securely and efficiently.
                        Cookies help us recognize your device, maintain your login session, and improve your experience on our website.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Types of Cookies We Use:</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Essential Cookies:</strong> Required for core features such as login, account security, fraud prevention, and safe navigation.
                            These cannot be disabled, as the platform will not function properly without them.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Analytics Cookies:</strong> Help us understand how users interact with the platform and identify areas for improvement.
                            These cookies are optional.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Functionality Cookies:</strong> Remember your preferences to provide a smoother, personalized experience.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Security Cookies:</strong> Used to detect suspicious activity, verify authenticity of sessions, and protect user accounts.
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Your Choices:</h2>
                    <p style={styles.text}>
                        You may manage or disable non-essential cookies through your browser settings at any time.
                        Please note that blocking essential cookies may prevent certain features such as logging in,
                        tracking donations, or completing verification steps from working correctly.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Third-Party Cookies:</h2>
                    <p style={styles.text}>
                        Some trusted third-party services (such as payment processors and analytics tools) may use
                        their own cookies in accordance with their policies. These are used only to support platform
                        functionality, security, and performance.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Updates:</h2>
                    <p style={styles.text}>
                        We may update this Cookie Policy from time to time to reflect changes in technology or our practices.
                        The latest version will always be available on this page.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: 1,
        padding: '4rem 1rem',
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        textAlign: 'center',
        marginBottom: '3rem',
    },
    title: {
        display: 'inline-block',
        backgroundColor: '#D6E6FF',
        padding: '1rem 3rem',
        borderRadius: '8px',
        fontSize: '2.5rem',
        color: '#1e293b',
        fontWeight: '700',
        marginBottom: '1rem',
    },
    date: {
        color: '#64748b',
        fontStyle: 'italic',
        fontSize: '0.95rem',
    },
    section: {
        marginBottom: '2.5rem',
    },
    intro: {
        fontSize: '1.1rem',
        color: '#334155',
        lineHeight: '1.6',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '1rem',
    },
    text: {
        fontSize: '1rem',
        color: '#334155',
        lineHeight: '1.6',
    },
    list: {
        paddingLeft: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    listItem: {
        fontSize: '1rem',
        color: '#334155',
        lineHeight: '1.6',
    }
};

export default CookiePolicy;

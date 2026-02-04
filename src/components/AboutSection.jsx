import React from 'react';
import { ShieldCheck, Eye, Heart } from 'lucide-react';
import logo from '../assets/logo.png';

const AboutSection = () => {
    return (
        <section id="about" style={styles.section}>
            <div className="container" style={styles.container}>
                <div style={styles.content}>
                    <h2 style={styles.heading}>
                        About <img src={logo} alt="KindCents" style={{ height: '50px', marginLeft: '0.5rem' }} />
                    </h2>
                    <p style={styles.description}>
                        KindCents is a transparent, AI-powered web application designed to eliminate
                        fraud and restore trust in digital donations. We ensure every contribution
                        reaches genuine causes with 100% accountability. Our mission is to bridge the
                        trust gap in philanthropy through secure, data-driven transparency.
                    </p>
                </div>

                <div style={styles.features}>
                    <div style={styles.featureCard}>
                        <ShieldCheck size={28} style={styles.icon} />
                        <span style={styles.featureText}>100% Secure</span>
                    </div>
                    <div style={styles.featureCard}>
                        <Eye size={28} style={styles.icon} />
                        <span style={styles.featureText}>Full Transparency</span>
                    </div>
                    <div style={styles.featureCard}>
                        <Heart size={28} style={styles.icon} />
                        <span style={styles.featureText}>Maximum Impact</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '4rem 0',
        backgroundColor: '#F1F5F9',
        margin: '4rem 0',
        borderRadius: '24px',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 2rem',
    },
    content: {
        maxWidth: '800px',
        marginBottom: '3rem',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    description: {
        color: '#475569',
        fontSize: '1.1rem',
        lineHeight: '1.8',
    },
    features: {
        display: 'flex',
        gap: '2rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    featureCard: {
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        minWidth: '220px',
    },
    featureText: {
        fontWeight: 600,
        color: '#1e293b',
        fontSize: '1.1rem',
    },
    icon: {
        color: '#1e293b',
    }
};

export default AboutSection;

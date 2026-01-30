import React from 'react';
import { MessageCircle } from 'lucide-react';
import ChatBot from './ChatBot';
import { useAuth } from '../context/AuthContext';

const HeroSection = () => {
    const { user } = useAuth();

    const ctaText = (user?.userType === 'nonprofit' || user?.userType === 'individual')
        ? "Fundraise Now"
        : "Donate Now";

    return (
        <section style={styles.section}>
            <div className="container" style={styles.container}>
                <div style={styles.content}>
                    <img src="/src/assets/hero-text-v2.png" alt="Kind Cents" style={{ maxWidth: '650px', width: '100%', marginBottom: '0.5rem' }} />
                    <h2 style={styles.headline}>
                        Transparent donation tracking that shows<br />
                        exactly where your generosity goes.
                    </h2>
                    <p style={styles.subheadline}>
                        Watch your contributions create real change in real-time.
                    </p>
                    <button className="btn btn-primary" style={styles.ctaButton}>{ctaText}</button>
                </div>

                <ChatBot />
            </div>
        </section>
    );
};

const styles = {
    section: {
        paddingTop: '40px', // Reduced closer to navbar to remove gap
        paddingBottom: '60px',
        // Using the new hero background image with a light blue overlay to match the brand color
        backgroundImage: 'linear-gradient(rgba(224, 242, 254, 0.9), rgba(224, 242, 254, 0.9)), url("/src/assets/hero-bg-new.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        position: 'relative',
        minHeight: '60vh', // Reduced height as requested
        display: 'flex',
        alignItems: 'flex-start', // Align items to the top vertically
        justifyContent: 'center', // Center items horizontally
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    content: {
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logoTitle: {
        fontFamily: 'var(--font-script)',
        fontSize: '8rem',
        color: '#93C5FD', // Light blue
        marginBottom: '1rem',
        fontWeight: 'normal',
        lineHeight: 1,
    },
    headline: {
        fontSize: '2rem',
        color: '#334155',
        marginBottom: '1rem',
        fontWeight: 700,
    },
    subheadline: {
        fontSize: '1.2rem',
        color: '#64748B',
        marginBottom: '2rem',
    },
    ctaButton: {
        fontSize: '1.2rem',
        padding: '1rem 3rem',
        boxShadow: '0 4px 6px -1px rgba(79, 150, 255, 0.4)',
    },
    chatWidget: {
        position: 'absolute',
        bottom: '40px',
        right: '40px',
    },
    chatIcon: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#4F96FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        width: '12px',
        height: '12px',
        backgroundColor: '#FB923C', // Orange dot
        borderRadius: '50%',
        border: '2px solid white',
    }
};

export default HeroSection;

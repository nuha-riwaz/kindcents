import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBot from './ChatBot';
import { useAuth } from '../context/AuthContext';
import heroTextImg from '../assets/hero-text-v2.png';
import heroBgImg from '../assets/hero-bg-new.jpg';

const HeroSection = () => {
    const { user, openAuthModal } = useAuth();
    const navigate = useNavigate();

    const userRole = user?.role?.toLowerCase();
    const ctaText = (userRole === 'ngo' || userRole === 'individual')
        ? "Fundraise Now"
        : "Donate Now";

    const handleCtaClick = () => {
        if (!user) {
            openAuthModal('signup');
            return;
        }

        if (userRole === 'ngo' || userRole === 'individual') {
            navigate('/create-campaign');
        } else {
            navigate('/campaigns');
        }
    };

    return (
        <section style={{
            ...styles.section,
            backgroundImage: `linear-gradient(rgba(224, 242, 254, 0.75), rgba(224, 242, 254, 0.75)), url(${heroBgImg})`
        }}>
            <div className="container" style={styles.container}>
                <div style={styles.content}>
                    <img src={heroTextImg} alt="Kind Cents" style={{ maxWidth: '650px', width: '100%', marginBottom: '0.5rem' }} />
                    <h2 style={styles.headline}>
                        Transparent donation tracking that shows<br />
                        exactly where your generosity goes.
                    </h2>
                    <p style={styles.subheadline}>
                        Watch your contributions create real change in real-time.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={styles.ctaButton}
                        onClick={handleCtaClick}
                    >
                        {ctaText}
                    </button>
                </div>

                <ChatBot />
            </div>
        </section>
    );
};

const styles = {
    section: {
        paddingTop: '40px',
        paddingBottom: '60px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
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
};

export default HeroSection;

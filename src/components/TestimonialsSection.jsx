import React from 'react';
import { Quote, User } from 'lucide-react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Anonymous Donor",
            location: "Colombo",
            color: "#E2E8F0",
            iconColor: "#94A3B8",
            quote: "I love being able to see exactly where my donation goes. It makes giving feel meaningful."
        },
        {
            name: "Anonymous Donor",
            location: "Kandy",
            color: "#E2E8F0",
            iconColor: "#94A3B8",
            quote: "The transparency on this platform gave me confidence to donate again."
        },
        {
            name: "Anonymous Donor",
            location: "Galle",
            color: "#E2E8F0",
            iconColor: "#94A3B8",
            quote: "Everything was laid out in a way that just made sense."
        },
        {
            name: "Anonymous Donor",
            location: "Jaffna",
            color: "#E2E8F0",
            iconColor: "#94A3B8",
            quote: "For my first donation, this was smooth and reassuring."
        }
    ];

    return (
        <section style={styles.section}>
            <div className="container">
                <h2 style={styles.mainHeading}>Words from Our Donors</h2>
                <p style={styles.subHeading}>Hear from the generous hearts who are making a difference every day</p>

                <div style={styles.grid}>
                    {testimonials.map((t, i) => (
                        <figure key={i} style={styles.card} className="testimonial">
                            <div style={styles.header}>
                                <div style={{ ...styles.avatar, backgroundColor: t.color }}>
                                    <User size={40} color={t.iconColor} strokeWidth={1.5} />
                                </div>
                                <Quote size={40} color="#CBD5E1" style={styles.quoteIcon} />
                            </div>

                            <figcaption style={styles.figcaption}>
                                <cite style={styles.cite}>
                                    <strong>{t.name}</strong>
                                </cite>
                                <div style={styles.location}>{t.location}</div>
                                <div style={styles.stars}>★★★★★</div>
                            </figcaption>

                            <blockquote style={styles.blockquote}>
                                <p style={styles.quote}>
                                    "{t.quote}"
                                </p>
                            </blockquote>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '4rem 0',
        backgroundColor: 'white',
        textAlign: 'center',
    },
    mainHeading: {
        fontSize: '2.5rem',
        marginBottom: '0.5rem',
        color: '#1e293b',
    },
    subHeading: {
        color: '#64748b',
        marginBottom: '4rem',
        fontSize: '1.1rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
    },
    card: {
        backgroundColor: '#F8FAFC',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    header: {
        display: 'flex',
        justifyContent: 'center', // Centered avatar
        width: '100%',
        marginBottom: '1rem',
        position: 'relative',
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        fontWeight: '600',
        border: '4px solid white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
    quoteIcon: {
        position: 'absolute',
        right: '10%',
        top: '0',
        opacity: 0.5,
    },
    blockquote: {
        margin: '1rem 0',
        padding: 0,
    },
    quote: {
        color: '#475569',
        fontSize: '0.95rem',
        fontStyle: 'italic',
        lineHeight: '1.5',
        margin: 0,
    },
    figcaption: {
        marginTop: '1rem',
    },
    stars: {
        color: '#EAB308', // Yellow
        marginTop: '0.5rem',
        fontSize: '1.2rem',
    },
    cite: {
        fontSize: '1.1rem',
        fontWeight: '700',
        fontStyle: 'normal',
        color: '#1e293b',
    },
    location: {
        fontSize: '0.9rem',
        color: '#64748b',
        marginTop: '0.25rem',
        fontStyle: 'italic',
    }
};

export default TestimonialsSection;

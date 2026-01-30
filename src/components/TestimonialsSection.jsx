import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Anjali Josep",
            initials: "AJ",
            color: "#DBEAFE",
            textColor: "#1D4ED8",
            quote: "I love being able to see exactly where my donation goes. It makes giving feel meaningful."
        },
        {
            name: "Sarah Lokman",
            initials: "SL",
            color: "#DBEAFE",
            textColor: "#1D4ED8",
            quote: "The transparency on this platform gave me confidence to donate again."
        },
        {
            name: "Rivindu G.",
            initials: "RG",
            color: "#DBEAFE",
            textColor: "#1D4ED8",
            quote: "Everything was laid out in a way that just made sense."
        },
        {
            name: "Chamod K.",
            initials: "CK",
            color: "#DBEAFE",
            textColor: "#1D4ED8",
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
                        <div key={i} style={styles.card}>
                            <div style={styles.header}>
                                <div style={{ ...styles.avatar, backgroundColor: t.color, color: t.textColor }}>
                                    {t.initials}
                                </div>
                                <Quote size={40} color="#CBD5E1" style={styles.quoteIcon} />
                            </div>

                            <h4 style={styles.name}>{t.name}</h4>
                            <div style={styles.stars}>★★★★★</div>

                            <p style={styles.quote}>
                                "{t.quote}"
                            </p>
                        </div>
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
    name: {
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '0.25rem',
    },
    stars: {
        color: '#EAB308', // Yellow
        marginBottom: '1rem',
        fontSize: '1.2rem',
    },
    quote: {
        color: '#475569',
        fontSize: '0.95rem',
        fontStyle: 'italic',
        lineHeight: '1.5',
    }
};

export default TestimonialsSection;

import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const ProjectsSection = () => {
    const projects = [
        {
            title: "Rebuild Emma's Home",
            status: "Completed",
            image: "/src/assets/project-emma.jpg",
            raised: "LKR 100,000"
        },
        {
            title: "Renovations in Arklow",
            subtitle: "Ireland Boys Home",
            status: "Completed",
            image: "/src/assets/project-arklow.png",
            raised: "LKR 80,000"
        },
        {
            title: "Medical Aid for Mrs. Perera",
            status: "Completed",
            image: "https://images.unsplash.com/photo-1516574187841-693019054ca1?q=80&w=2670&auto=format&fit=crop", // Keep placeholder for 3rd
            raised: "LKR 80,000"
        }
    ];

    return (
        <section style={styles.section}>
            <div className="container">
                <h2 style={styles.heading}>Together, We Achieved</h2>
                <p style={styles.subHeading}>Real projects. Real impact. See the difference your generosity makes.</p>

                <div style={styles.carouselContainer}>
                    <button style={styles.navButton}><ChevronLeft size={24} /></button>

                    <div style={styles.cardsWrapper}>
                        {projects.map((project, index) => (
                            <div key={index} style={styles.card}>
                                <div style={styles.statusBadge}>
                                    <CheckCircle2 size={16} fill="#22C55E" color="white" />
                                    <span>{project.status}</span>
                                </div>

                                <h3 style={styles.cardTitle}>
                                    {project.title}
                                    {project.subtitle && <><br />{project.subtitle}</>}
                                </h3>

                                <div style={styles.imageContainer}>
                                    <img src={project.image} alt={project.title} style={styles.image} />
                                </div>

                                <div style={styles.cardFooter}>
                                    {project.raised} raised and<br />completed
                                </div>
                            </div>
                        ))}
                    </div>

                    <button style={styles.navButton}><ChevronRight size={24} /></button>
                </div>

                <div style={styles.dots}>
                    <div style={styles.dotActive}></div>
                    <div style={styles.dot}></div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '4rem 0',
        backgroundColor: '#F8FAFC',
        borderRadius: '32px',
        maxWidth: '1200px',
        margin: '4rem auto',
        textAlign: 'center',
    },
    heading: {
        fontSize: '2.5rem',
        color: '#1e293b',
        marginBottom: '0.5rem',
    },
    subHeading: {
        color: '#64748b',
        marginBottom: '3rem',
        fontSize: '1.1rem',
    },
    carouselContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '2rem',
    },
    navButton: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
    },
    cardsWrapper: {
        display: 'flex',
        gap: '2rem',
        overflowX: 'auto',
        padding: '1rem',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        width: '380px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#22C55E',
        fontWeight: '600',
        fontSize: '0.9rem',
        marginBottom: '1rem',
        alignSelf: 'flex-start',
    },
    cardTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '1rem',
        height: '3.5rem', // Fixed height for alignment
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '160px',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '1rem',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    cardFooter: {
        fontSize: '0.9rem',
        color: '#475569',
        fontWeight: '500',
    },
    dots: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#CBD5E1',
    },
    dotActive: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#1e293b',
    }
};

export default ProjectsSection;

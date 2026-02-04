import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import projectEmma from '../assets/project-emma.jpg';
import projectArklow from '../assets/project-arklow.png';
import mrsPerera from '../assets/mrs-perera.jpg';
import ayaanSurgery from '../assets/ayaan-surgery.png';
import templeRenovation from '../assets/temple-renovation.png';
import ruralMedical from '../assets/rural-medical.jpg';

// Image mapping to resolve Firestore strings to local assets
const imageMap = {
    projectEmma,
    projectArklow,
    mrsPerera,
    ayaanSurgery,
    templeRenovation,
    ruralMedical
};

const ProjectsSection = () => {
    const navigate = useNavigate();
    const { campaigns } = useCampaigns();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Hardcoded past projects (always shown as completed)
    const pastProjects = [
        {
            id: 'emma-home',
            title: "Rebuild Emma's Home",
            image: projectEmma,
            raised: 100000,
            status: 'completed',
            isPastProject: true
        },
        {
            id: 'mrs-perera',
            title: "Medical Aid for Mrs. Perera",
            image: mrsPerera,
            raised: 80000,
            status: 'completed',
            isPastProject: true
        },
        {
            id: 'arklow-boys',
            title: "Renovations in Arklow Ireland Boys Home",
            image: projectArklow,
            raised: 80000,
            status: 'completed',
            isPastProject: true
        }
    ];

    // Filter real completed campaigns from Firestore
    const realCompletedCampaigns = Object.values(campaigns).filter(campaign => campaign.status === 'completed');

    // Combine past projects with real completed campaigns
    const allCompletedProjects = [...pastProjects, ...realCompletedCampaigns];

    // Number of cards to show at once
    const cardsToShow = 4;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % allCompletedProjects.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? allCompletedProjects.length - 1 : prev - 1));
    };

    // Auto-slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [allCompletedProjects.length]);

    // Always render (we have past projects as fallback)

    return (
        <section style={styles.section}>
            <div className="container">
                <h2 style={styles.heading}>Together, We Achieved</h2>
                <p style={styles.subHeading}>Real projects. Real impact. See the difference your generosity makes.</p>

                <div style={styles.carouselContainer}>
                    <button
                        onClick={prevSlide}
                        style={styles.navButton}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div style={styles.cardsWrapper}>
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            transition: 'transform 0.5s ease-in-out',
                            transform: `translateX(-${currentIndex * (100 / (allCompletedProjects.length > cardsToShow ? cardsToShow : allCompletedProjects.length))}%)`
                        }}>
                            {/* Render items twice to ensure continuity */}
                            {[...allCompletedProjects, ...allCompletedProjects].map((campaign, index) => (
                                <div
                                    key={`${campaign.id}-${index}`}
                                    style={{
                                        ...styles.card,
                                        minWidth: `calc(${100 / cardsToShow}% - ${(1.5 * (cardsToShow - 1)) / cardsToShow}rem)`,
                                        cursor: campaign.isPastProject ? 'default' : 'pointer'
                                    }}
                                    onClick={() => !campaign.isPastProject && navigate(`/campaign/${campaign.id}`)}
                                >
                                    <div style={styles.statusBadge}>
                                        <CheckCircle2 size={16} fill="#22C55E" color="white" />
                                        <span>Completed</span>
                                    </div>

                                    <h3 style={styles.cardTitle}>
                                        {campaign.title}
                                    </h3>

                                    <div style={styles.imageContainer}>
                                        <img
                                            src={imageMap[campaign.image] || campaign.image}
                                            alt={campaign.title}
                                            style={styles.image}
                                        />
                                    </div>

                                    <div style={styles.cardFooter}>
                                        Rs. {campaign.raised.toLocaleString()} raised and<br />completed
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={nextSlide}
                        style={styles.navButton}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div style={styles.dots}>
                    {allCompletedProjects.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.dot,
                                ...(index === currentIndex ? styles.dotActive : {})
                            }}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '3rem 0',
        backgroundColor: '#F8FAFC',
        borderRadius: '32px',
        maxWidth: '1100px',
        margin: '3rem auto',
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
        overflow: 'hidden',
        width: '100%',
        padding: '1rem 0',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #e2e8f0',
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
        height: '3.5rem',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '140px',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '0.75rem',
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

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import projectEmma from '../assets/project-emma.jpg';
import projectArklow from '../assets/project-arklow.png';
import mrsPerera from '../assets/mrs-perera.jpg';
import ayaanSurgery from '../assets/ayaan-surgery.png';
import templeRenovation from '../assets/temple-renovation.png';
import orphanCare from '../assets/orphan-care.png';
import ruralMedical from '../assets/rural-medical.jpg';
import orgAkshay from '../assets/org-akshay.jpg';
import orgKeithston from '../assets/org-keithston.jpg';
import orgSmile from '../assets/org-smile.jpg';
import orgLotus from '../assets/org-lotus.jpg';

// Image mapping to resolve Firestore strings to local assets
const imageMap = {
    projectEmma,
    projectArklow,
    mrsPerera,
    ayaanSurgery,
    templeRenovation,
    orphanCare,
    ruralMedical,
    orgAkshay,
    orgKeithston,
    orgSmile,
    orgLotus
};

const ProjectsSection = () => {
    const navigate = useNavigate();
    const { campaigns } = useCampaigns();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Hardcoded past projects (always shown as completed)
    const pastProjects = [
        {
            id: 'emma-home',
            title: "Rebuild Emma's Home",
            image: projectEmma,
            imageAlt: "A tan ranch-style house heavily damaged by a landslide in Ratnapura, Sri Lanka, with a large pile of rocks, uprooted trees, and wooden debris covering the front entrance",
            raised: 100000,
            status: 'completed',
            isPastProject: true
        },
        {
            id: 'mrs-perera',
            title: "Medical Aid for Mrs. Perera",
            image: mrsPerera,
            imageAlt: "An elderly Sri Lankan woman in Colombo receiving medical care, sitting in a hospital bed with medical equipment and caring healthcare staff nearby",
            raised: 80000,
            status: 'completed',
            isPastProject: true
        },
        {
            id: 'arklow-boys',
            title: "Renovations in Arklow Ireland Boys Home",
            image: "orphanCare",
            imageAlt: "A children's home facility showing areas under renovation, with construction materials and improvement work visible to create a better living environment for the boys",
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
    const cardsToShow = isMobile ? 1.2 : 3;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % allCompletedProjects.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? allCompletedProjects.length - 1 : prev - 1));
    };

    // Auto-slide every 5 seconds only if there are more items than cardsToShow
    useEffect(() => {
        if (allCompletedProjects.length <= (isMobile ? 1 : 3)) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [allCompletedProjects.length, isMobile]);

    // Always render (we have past projects as fallback)

    return (
        <section style={styles.section}>
            <div className="container">
                <h2 style={{ ...styles.heading, fontSize: isMobile ? '1.8rem' : '2.5rem' }}>Together, We Achieved</h2>
                <p style={{ ...styles.subHeading, fontSize: isMobile ? '0.95rem' : '1.1rem' }}>Real projects. Real impact. See the difference your generosity makes.</p>

                <div style={{ ...styles.carouselContainer, gap: isMobile ? '0' : '2rem' }}>
                    {!isMobile && allCompletedProjects.length > 3 && (
                        <button
                            onClick={prevSlide}
                            style={styles.navButton}
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    <div style={{
                        ...styles.cardsWrapper,
                        overflowX: isMobile ? 'auto' : 'hidden',
                        padding: isMobile ? '1rem' : '1rem 0',
                        scrollSnapType: isMobile ? 'x mandatory' : 'none',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none', // Hide scrollbar for Firefox
                        msOverflowStyle: 'none',   // Hide scrollbar for Edge/IE
                    }} className="hide-scrollbar">
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            justifyContent: allCompletedProjects.length <= (isMobile ? 1 : 3) ? 'center' : 'flex-start',
                            transition: isMobile ? 'none' : 'transform 0.5s ease-in-out',
                            transform: isMobile ? 'none' : `translateX(-${currentIndex * (100 / Math.min(allCompletedProjects.length, 3))}%)`,
                            width: isMobile ? 'max-content' : '100%'
                        }}>
                            {allCompletedProjects.map((campaign, index) => (
                                <div
                                    key={campaign.id}
                                    style={{
                                        ...styles.card,
                                        minWidth: isMobile
                                            ? '75vw' // Show part of the next card to invite scrolling
                                            : `calc(${100 / 3}% - ${(1.5 * 2) / 3}rem)`,
                                        scrollSnapAlign: 'center',
                                        cursor: campaign.isPastProject ? 'default' : 'pointer'
                                    }}
                                    onClick={() => !campaign.isPastProject && navigate(`/campaign/${campaign.id}`)}
                                >
                                    <div style={styles.statusBadge}>
                                        <CheckCircle2 size={16} fill="#22C55E" color="white" />
                                        <span>Completed</span>
                                    </div>

                                    <h3 style={{ ...styles.cardTitle, fontSize: isMobile ? '1rem' : '1.1rem' }}>
                                        {campaign.title}
                                    </h3>

                                    <div style={styles.imageContainer}>
                                        <img
                                            src={imageMap[campaign.image] || campaign.image}
                                            alt={campaign.imageAlt || campaign.title}
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

                    {!isMobile && allCompletedProjects.length > 3 && (
                        <button
                            onClick={nextSlide}
                            style={styles.navButton}
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}
                </div>

                {!isMobile && allCompletedProjects.length > 3 && (
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
                )}
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
        justifyContent: 'center',
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

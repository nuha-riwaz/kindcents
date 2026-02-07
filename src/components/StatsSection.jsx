import React, { useState, useEffect } from 'react';
import statMoney from '../assets/stat-money.png';
import statDonors from '../assets/stat-donors.png';
import statHeart from '../assets/stat-heart.png';
import statChart from '../assets/stat-chart.png';

import { useCampaigns } from '../context/CampaignContext';

const StatsSection = () => {
    const { campaigns } = useCampaigns();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filter out NGO profile cards, only count real campaigns
    const realCampaigns = campaigns.filter(c => c.type === 'campaign');

    const totalRaised = realCampaigns.reduce((sum, c) => sum + (c.raised || 0), 0);
    const totalDonors = realCampaigns.reduce((sum, c) => sum + (c.contributors || 0), 0);
    const totalProjects = realCampaigns.length;

    const stats = [
        {
            image: statMoney,
            value: totalRaised >= 1000000
                ? `LKR ${(totalRaised / 1000000).toFixed(1)}M`
                : `LKR ${(totalRaised / 1000).toFixed(1)}K`,
            label: "Total Donated"
        },
        {
            image: statDonors,
            value: totalDonors.toLocaleString(),
            label: "Active Donors"
        },
        {
            image: statHeart,
            value: totalProjects,
            label: "Projects Funded"
        },
        {
            image: statChart,
            value: "100%",
            label: "Funds to Cause"
        }
    ];

    return (
        <section style={styles.section}>
            <div className="container stats-row" style={{
                ...styles.grid,
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                gap: isMobile ? '0.75rem' : '2rem'
            }}>
                {stats.map((stat, index) => (
                    <div key={index} style={{
                        ...styles.card,
                        flexDirection: isMobile ? 'row' : 'column',
                        alignItems: 'center',
                        justifyContent: isMobile ? 'flex-start' : 'center', // Align left on mobile
                        padding: isMobile ? '0.75rem' : '0',
                        backgroundColor: isMobile ? '#f8fafc' : 'transparent', // Add subtle background on mobile for "card" feel
                        borderRadius: isMobile ? '12px' : '0',
                        border: isMobile ? '1px solid #e2e8f0' : 'none'
                    }}>
                        <div style={{
                            ...styles.iconWrapper,
                            width: isMobile ? '60px' : '100px', // Smaller icon on mobile
                            height: isMobile ? '60px' : '100px',
                            marginBottom: isMobile ? '0' : '1.5rem', // Remove bottom margin on mobile
                            marginRight: isMobile ? '1.5rem' : '0' // Add right margin on mobile
                        }}>
                            <img src={stat.image} alt={stat.label} style={styles.icon} />
                        </div>
                        <div style={{ textAlign: isMobile ? 'left' : 'center' }}>
                            <h3 style={{ ...styles.value, fontSize: isMobile ? '1.5rem' : '1.8rem', marginBottom: '0' }}>{stat.value}</h3>
                            <p style={{ ...styles.label, fontSize: isMobile ? '0.9rem' : '1rem', margin: 0 }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '2rem 0',
        backgroundColor: 'white',
    },
    grid: {
        display: 'grid',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    iconWrapper: {
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
    },
    value: {
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: '0.25rem',
    },
    label: {
        color: '#64748b',
        fontWeight: 500,
    }
};

export default StatsSection;

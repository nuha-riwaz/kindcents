import React from 'react';
import statMoney from '../assets/stat-money.png';
import statDonors from '../assets/stat-donors.png';
import statHeart from '../assets/stat-heart.png';
import statChart from '../assets/stat-chart.png';

import { useCampaigns } from '../context/CampaignContext';

const StatsSection = () => {
    const { campaigns } = useCampaigns();

    // Filter out NGO profile cards, only count real campaigns
    const realCampaigns = campaigns.filter(c => c.type === 'campaign');

    const totalRaised = realCampaigns.reduce((sum, c) => sum + (c.raised || 0), 0);
    const totalDonors = realCampaigns.reduce((sum, c) => sum + (c.contributors || 0), 0);
    const totalProjects = realCampaigns.length;

    const stats = [
        {
            image: statMoney,
            value: `LKR ${(totalRaised / 1000).toFixed(1)}K`, // Simple formatting
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
            <div className="container" style={styles.grid}>
                {stats.map((stat, index) => (
                    <div key={index} style={styles.card}>
                        <div style={styles.iconWrapper}>
                            <img src={stat.image} alt={stat.label} style={styles.icon} />
                        </div>
                        <h3 style={styles.value}>{stat.value}</h3>
                        <p style={styles.label}>{stat.label}</p>
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
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2rem',
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
        width: '100px',
        height: '100px',
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
        fontSize: '1.8rem',
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: '0.25rem',
    },
    label: {
        color: '#64748b',
        fontSize: '1rem',
        fontWeight: 500,
    }
};

export default StatsSection;

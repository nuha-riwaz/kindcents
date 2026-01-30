import React from 'react';

const StatsSection = () => {
    const stats = [
        {
            image: "/src/assets/stat-money.png",
            value: "LKR 2.4M",
            label: "Total Donated"
        },
        {
            image: "/src/assets/stat-donors.png",
            value: "5,000",
            label: "Active Donors"
        },
        {
            image: "/src/assets/stat-heart.png",
            value: "150",
            label: "Projects Funded"
        },
        {
            image: "/src/assets/stat-chart.png",
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
        maxWidth: '1200px', // Reverting to constrained width for the grid
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

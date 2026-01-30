import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
    return (
        <div style={styles.page}>
            <Navbar />

            <div className="container" style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Terms & Conditions</h1>
                    <p style={styles.date}>Last Update: 16 January 2026</p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Acceptance of Terms</h2>
                    <p style={styles.text}>
                        By accessing or using the KindCents platform, users (Donors, Recipients, and NGOs) agree to be bound by these Terms and Conditions, our Privacy Policy, and all applicable laws and regulations in Sri Lanka and internationally.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>User Registration and Eligibility</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Account Creation:</strong> All users must register with valid information. Donors must be at least 18 years old or have parental consent.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Verification:</strong> Recipients (Individuals and NGOs) must undergo a mandatory hybrid verification process. This includes providing Government IDs, medical documentation, and legal certifications.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Accuracy:</strong> Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Recipient and NGO Responsibilities</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Truthfulness:</strong> Recipients must provide 100% accurate and non-fraudulent documentation. Any attempt to upload forged documents will result in immediate account termination and reporting to authorities (e.g., Sri Lanka CERT).
                        </li>
                        <li style={styles.listItem}>
                            <strong>Fund Usage:</strong> Funds received must be used strictly for the purpose stated in the campaign. KindCents reserves the right to monitor transactions via provided credit cards or expense sheet audits.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Credibility Scoring:</strong> NGOs acknowledge that their "Credibility Score" is determined by independent audits, community reviews, and transparency levels, and this score will be visible to the public.
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Donor Terms</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Donation Finality:</strong> Donations are generally non-refundable once processed through the Stripe API or bank transfer, as they are immediately allocated to the chosen cause.
                        </li>
                        <li style={styles.listItem}>
                            <strong>No Guarantee:</strong> While KindCents uses AI and manual review to verify causes, the platform does not guarantee the absolute success of a medical treatment or the total impact of an NGO project.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Gamification:</strong> Badges and rewards earned through the platform have no monetary value and are for engagement purposes only.
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Transparency and AI Monitoring</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Real-time Tracking:</strong> Donors have the right to view real-time progress and impact dashboards for their contributions.
                        </li>
                        <li style={styles.listItem}>
                            <strong>AI Verification:</strong> Users consent to the use of AI algorithms for document analysis and anomaly detection. KindCents is not liable for temporary delays caused by manual reviews triggered by AI flags.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Fair Exposure:</strong> The platform uses a neutral algorithm to ensure equal visibility for grassroots organizations and established NGOs.
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Prohibited Conduct</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            Users are strictly prohibited from:
                            <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                                <li>Using the platform for money laundering or any illegal financial activity.</li>
                                <li>Submitting suspicious or anomalous expense sheets to bypass monitoring.</li>
                                <li>Harassing other users through the testimonial or contact features. Account will be suspended in such circumstances.</li>
                            </ol>
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Data Privacy and Security</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Encryption:</strong> All data is protected via SSL/TLS encryption and MFA.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Storage:</strong> Sensitive documents (NIC, medical records) are stored in secure cloud storage and accessed only for verification purposes.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Third-party Sharing:</strong> Information may be shared with verified third parties (doctors, hospitals, lawyers) solely for the purpose of recipient verification.
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Termination</h2>
                    <p style={styles.text}>
                        KindCents reserves the right to suspend or terminate any account that violates these terms, displays suspicious transaction patterns, or fails the verification/audit process.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Governing Law</h2>
                    <p style={styles.text}>
                        These terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka. Any disputes shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: 1,
        padding: '4rem 1rem',
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        textAlign: 'center',
        marginBottom: '3rem',
    },
    title: {
        display: 'inline-block',
        backgroundColor: '#D6E6FF',
        padding: '1rem 3rem',
        borderRadius: '8px',
        fontSize: '2.5rem',
        color: '#1e293b',
        fontWeight: '700',
        marginBottom: '1rem',
    },
    date: {
        color: '#64748b',
        fontStyle: 'italic',
        fontSize: '0.95rem',
    },
    section: {
        marginBottom: '2.5rem',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '1rem',
    },
    text: {
        fontSize: '1rem',
        color: '#334155',
        lineHeight: '1.6',
    },
    list: {
        paddingLeft: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        listStyleType: 'disc',
    },
    listItem: {
        fontSize: '1rem',
        color: '#334155',
        lineHeight: '1.6',
    }
};

export default TermsAndConditions;

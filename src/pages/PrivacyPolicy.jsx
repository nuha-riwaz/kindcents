import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    return (
        <div style={styles.page}>
            <Navbar />

            <div className="container" style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Privacy Policy</h1>
                    <p style={styles.date}>Last Update: 16 January 2026</p>
                </div>

                <div style={styles.section}>
                    <p style={styles.text}>
                        KindCents is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application. We prioritize transparency and credibility to bridge the trust gap in digital donations.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Information We Collect</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Personal Identification Information:</strong> Name, email address (for account access and notifications), contact number, and (where applicable) address.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Verification Data (Recipients):</strong> Government ID documents (e.g., NIC), birth certificates (where applicable), and legal certifications for NGOs.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Sensitive Medical Data:</strong> For medical assistance campaigns, medical reports, hospital documentation, and related supporting documents.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Financial Information:</strong> Bank account details for receiving funds (where applicable), donation/transfer records, and expense sheets/bills uploaded for accountability. Payment card details are processed via payment providers (e.g., Stripe) and are not stored in full on our servers.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Technical Data:</strong> Device and log information such as IP address, browser type, pages visited, timestamps, and approximate location derived from IP (if available).
                        </li>
                        <li style={styles.listItem}>
                            <strong>User Content:</strong> Campaign descriptions, testimonials, messages, and any files uploaded to the platform.
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>How We Use Your Information</h2>
                    <p style={styles.text}>We use collected information to:</p>
                    <ol style={styles.orderedList}>
                        <li>Create and manage user accounts (Donors, Recipients, NGOs).</li>
                        <li>Perform recipient/NGO verification and fraud prevention checks.</li>
                        <li>Enable donations, fund tracking, and platform transparency features (e.g., progress updates and dashboards).</li>
                        <li>Provide customer support and respond to inquiries.</li>
                        <li>Send essential service communications (e.g., receipts, security alerts, verification updates).</li>
                        <li>Send Marketing emails. (New campaign updates, feel good emails).</li>
                        <li>Improve platform functionality, security, and user experience.</li>
                        <li>Detect, investigate, and prevent prohibited or suspicious activity.</li>
                    </ol>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>AI Processing and Automated Checks</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            We may use AI tools to analyze uploaded documents (e.g., bills, IDs, medical documents) for anomaly detection, completeness, and potential fraud indicators.
                        </li>
                        <li style={styles.listItem}>
                            Automated flags may trigger manual review. Processing delays can occur during these reviews.
                        </li>
                        <li style={styles.listItem}>
                            AI outputs are used as decision-support and may not be perfectly accurate; we may request additional documentation when needed.
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Data Sharing and Disclosure</h2>
                    <p style={styles.text}>We may share data only as necessary for platform operation and verification:</p>
                    <ol style={styles.orderedList}>
                        <li><strong>Public/Platform Visibility:</strong> Campaign information, progress indicators, and certain impact updates may be visible to users to support transparency (highly sensitive documents are not made public).</li>
                        <li><strong>Patients:</strong> Patients have the liberty to remain anonymous to the public but will be requested to submit the documents required for verification.</li>
                        <li><strong>Verification Partners:</strong> Limited information may be shared with trusted third parties for verification (e.g., hospitals, medical professionals, legal validators) strictly for validation purposes.</li>
                        <li><strong>Service Providers:</strong> Hosting, storage, analytics, security, email delivery, and payment processing providers may process data on our behalf under appropriate safeguards.</li>
                        <li><strong>Legal / Safety Reasons:</strong> We may disclose information if required by law, court order, or to protect users, the platform, or the public from fraud and harm.</li>
                        <li><strong>Business Transfers:</strong> If KindCents undergoes a merger, acquisition, or asset sale, data may be transferred subject to this policy.</li>
                    </ol>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Data Security</h2>
                    <p style={styles.text}>We use reasonable administrative, technical, and organizational measures, including:</p>
                    <ol style={styles.orderedList}>
                        <li>SSL/TLS encryption in transit.</li>
                        <li>Secure authentication controls (e.g., MFA where available).</li>
                        <li>Password hashing (e.g., bcrypt).</li>
                        <li>Access controls and least-privilege practices.</li>
                        <li>Secure cloud storage for sensitive documents.</li>
                    </ol>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Data Retention</h2>
                    <p style={styles.text}>We retain information only as long as needed to:</p>
                    <ol style={styles.orderedList}>
                        <li>Provide services and maintain transparency/auditability of donations.</li>
                        <li>Comply with legal, tax, financial, and fraud-prevention obligations.</li>
                        <li>Resolve disputes and enforce agreements.</li>
                    </ol>
                    <p style={{ ...styles.text, marginTop: '1rem' }}>
                        Retention periods may be longer for verified campaign records and financial logs to protect against repeat fraud and support accountability.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Your Rights and Choices</h2>
                    <p style={styles.text}>Depending on applicable laws, you may have rights to:</p>
                    <ol style={styles.orderedList}>
                        <li>Access and review your personal information.</li>
                        <li>Correct inaccurate or incomplete information.</li>
                        <li>Request deletion of your account/data (subject to legal/audit requirements and active campaign obligations).</li>
                        <li>Object to or restrict certain processing (where applicable).</li>
                        <li>Opt out of non-essential communications.</li>
                    </ol>
                    <p style={{ ...styles.text, marginTop: '1rem' }}>
                        Some transparency-related records (e.g., donation logs) may need to be retained for compliance and fraud prevention.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Cookies and Tracking</h2>
                    <p style={styles.text}>We may use cookies and similar technologies to:</p>
                    <ol style={styles.orderedList}>
                        <li>Maintain sessions and authentication,</li>
                        <li>Prevent fraud and abuse,</li>
                        <li>Measure and improve site performance.</li>
                    </ol>
                    <p style={{ ...styles.text, marginTop: '1rem' }}>
                        You can control cookies via browser settings, but disabling them may affect functionality.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Children's Privacy</h2>
                    <p style={styles.text}>
                        The platform is not intended for use by individuals who are considered minors under applicable law without guardian consent. If we learn that we collected data from a minor without required consent, we will take steps to delete it where legally permissible.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Changes to This Policy</h2>
                    <p style={styles.text}>
                        We may update this Privacy Policy periodically. Updated versions will be posted on the platform with an updated effective date. Continued use of the platform after changes means you accept the updated policy.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>How to Contact Us</h2>
                    <p style={styles.text}>
                        You can contact the KindCents administrators through the platform's official support/contact mechanism <a href="mailto:kindcents.org@gmail.com" style={{ color: '#2596be', textDecoration: 'none' }}>kindcents.org@gmail.com</a>
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
    orderedList: {
        paddingLeft: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginTop: '0.5rem',
        color: '#334155',
        lineHeight: '1.6',
    },
    listItem: {
        fontSize: '1rem',
        color: '#334155',
        lineHeight: '1.6',
    }
};

export default PrivacyPolicy;

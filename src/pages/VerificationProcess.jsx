import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VerificationProcess = () => {
    return (
        <div style={styles.page}>
            <Navbar />

            <div className="container" style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Verification Process</h1>
                    <p style={styles.date}>Last Update: 16 January 2026</p>
                </div>

                <div style={styles.section}>
                    <p style={styles.text}>
                        The KindCents platform employs a rigorous, multi-tiered Hybrid Verification Framework designed to uphold the highest standards of transparency, accountability, and fraud prevention. This protocol integrates advanced technological solutions with traditional validation methods to ensure that all contributions reach legitimate beneficiaries.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>I. Individual Recipient Verification (Medical and Financial Aid)</h2>
                    <p style={styles.text}>The verification of individual applicants is conducted through a systematic four-stage process:</p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Documentary Submission:</strong> Applicants are required to submit primary identification (National Identity Card and Birth Certificate) alongside comprehensive supporting evidence. For medical emergencies, this includes official diagnostic reports, hospital-issued cost estimates, and formal treatment plans.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Automated Forensic Analysis:</strong> All submitted documentation undergoes analysis via an AI-integrated microservice. This system performs forensic scans to detect digital tampering, inconsistencies in metadata, or structural anomalies that may indicate fraudulent documentation.
                        </li>
                        <li style={styles.listItem}>
                            <strong>External Third-Party Validation:</strong> To ensure absolute credibility, the platform conducts independent verification with relevant authorities. This involves direct communication with medical practitioners, hospital administrations, or legal professionals (such as a Justice of the Peace or Attorney-at-Law) to confirm the authenticity of the claim and the identity of the claimant.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Administrative Adjudication:</strong> Upon the successful reconciliation of AI findings and third-party confirmations, the administrative team performs a final review to grant "Verified" status, thereby authorizing the commencement of the fundraising campaign.
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>II. NGO Credibility and Compliance Assessment</h2>
                    <p style={styles.text}>Non-Governmental Organizations are subject to a specialized vetting process focused on institutional integrity:</p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Statutory Compliance Review:</strong> Organizations must provide valid legal registration certificates and proof of regulatory compliance within their respective jurisdictions.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Performance Metrics and Audit:</strong> The platform evaluates the organization's historical performance, focusing on project completion rates (where applicable) and financial transparency. This includes a mandatory review of independent audit reports and prior fund utilization records.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Algorithmic Credibility Scoring:</strong> A proprietary "Trust Score" is calculated based on financial transparency, community feedback, and historical accountability. This score is publicly displayed as star count out of four to facilitate informed donor decision-making.
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>III. Post-Donation Fund Monitoring and Accountability</h2>
                    <p style={styles.text}>Verification remains an ongoing process throughout the lifecycle of a campaign to prevent the misappropriation of funds:</p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Restricted Fund Disbursement:</strong> Where applicable, recipients are provided with monitored financial instruments (e.g., dedicated credit cards) to ensure that expenditures are restricted to pre-approved categories.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Continuous AI Surveillance:</strong> All uploaded receipts, invoices, and expense sheets are subjected to continuous AI monitoring. The system is programmed to identify and flag suspicious expenditure patterns or non-compliant financial requests.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Intervention and Enforcement:</strong> In the event of a flagged anomaly, KindCents initiates an immediate manual audit. During this review process, account access, fund disbursements, and payment methods associated with the platform may be temporarily restricted. If fraud, misuse of funds, or policy violations are substantiated, KindCents reserves the right to suspend or terminate accounts, block transactions, recover misused funds where feasible, and report the matter to relevant authorities. Where donor funds are impacted, appropriate corrective measures, including reversals or reimbursements where practicable, will be taken to protect donor trust.
                        </li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>IV. Security and Authentication Standards</h2>
                    <p style={styles.text}>To maintain the integrity of the ecosystem, all users including donors must adhere to strict security protocols:</p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <strong>Identity Authentication:</strong> Mandatory email verification and pass key during the registration phase.
                        </li>
                        <li style={styles.listItem}>
                            <strong>Enhanced Security Protocols:</strong> Implementation of Multi-Factor Authentication (MFA) and SSL/TLS encryption to safeguard sensitive data and high-value financial transactions.
                        </li>
                    </ul>
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
        marginTop: '1rem',
    },
    listItem: {
        fontSize: '1rem',
        color: '#334155',
        lineHeight: '1.6',
    }
};

export default VerificationProcess;

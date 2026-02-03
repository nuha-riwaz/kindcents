import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CloudUpload, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const CreateCampaign = () => {
    const navigate = useNavigate();

    const uploadSections = [
        { id: 'gov', label: 'Government ID/Passport*' },
        { id: 'birth', label: 'Birth Certificate*' },
        { id: 'medical', label: 'Medical Records*' },
        { id: 'doctor', label: 'Letter from Attending Doctor*' },
        { id: 'lawyer', label: 'Lawyer/ Justice of Peace Attestation*' },
        { id: 'finance', label: 'Financial Statement' },
    ];

    const handleSubmit = () => {
        alert("Documents submitted for verification! Our team will review your application.");
        navigate('/dashboard/individual');
    };

    return (
        <div style={styles.page}>
            <Navbar />

            <div className="container" style={styles.content}>
                <div style={styles.modalContent}>
                    {/* Header with Logo and Progress */}
                    <div style={styles.headerTop}>
                        <img src={logo} alt="KindCents" style={styles.logo} />
                    </div>

                    <div style={styles.progressSection}>
                        <p style={styles.stepIndicator}>Step 4 of 4</p>
                        <div style={styles.progressTrack}>
                            <div style={styles.progressFill} />
                        </div>
                    </div>

                    <h2 style={styles.title}>Upload documents for verification</h2>

                    {/* Upload Sections */}
                    <div style={styles.uploadGrid}>
                        {uploadSections.map((section) => (
                            <div key={section.id} style={styles.uploadSection}>
                                <label style={styles.label}>{section.label}</label>
                                <div style={styles.uploadCard}>
                                    <CloudUpload size={28} color="#3b82f6" style={{ marginBottom: '0.4rem' }} />
                                    <p style={styles.uploadText}>Drag and drop a file to upload</p>
                                    <button style={styles.browseBtn}>Browse file</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div style={styles.buttonRow}>
                        <button onClick={() => navigate(-1)} style={styles.backLinkBtn}>
                            <ChevronLeft size={16} /> Back
                        </button>
                        <button
                            style={styles.nextBtn}
                            onClick={handleSubmit}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: 1,
        paddingTop: '100px',
        paddingBottom: '4rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '550px',
        padding: '2.5rem 3rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        border: '1px solid #f1f5f9',
    },
    headerTop: {
        width: '100%',
        textAlign: 'left',
        marginBottom: '0.5rem',
    },
    logo: {
        height: '60px',
    },
    progressSection: {
        width: '100%',
        textAlign: 'left',
        marginBottom: '1.5rem',
    },
    stepIndicator: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '0.4rem',
    },
    progressTrack: {
        width: '100%',
        height: '6px',
        backgroundColor: '#f1f5f9',
        borderRadius: '3px',
    },
    progressFill: {
        width: '100%',
        height: '100%',
        backgroundColor: '#2596be',
        borderRadius: '3px',
    },
    title: {
        fontSize: '1.4rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '2rem',
        textAlign: 'center',
        width: '100%',
    },
    uploadGrid: {
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    uploadSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
    },
    label: {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#334155',
    },
    uploadCard: {
        width: '100%',
        padding: '1rem',
        border: '1px dashed #cbd5e1',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    uploadText: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        marginBottom: '0.5rem',
    },
    browseBtn: {
        padding: '4px 12px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: '500',
        cursor: 'pointer',
    },
    buttonRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2.5rem',
        width: '100%',
    },
    backLinkBtn: {
        background: 'none',
        border: 'none',
        color: '#64748b',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: 0,
    },
    nextBtn: {
        padding: '8px 32px',
        backgroundColor: '#2596be',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
    }
};

export default CreateCampaign;

import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CloudUpload, ChevronLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const CreateCampaign = () => {
    const navigate = useNavigate();
    const { user, updateUserDocuments } = useAuth();
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const userRole = (user?.role || 'individual').toLowerCase();

    const uploadSections = userRole === 'ngo' || userRole === 'nonprofit'
        ? [
            { id: 'cert', label: 'Government certification*', mandatory: true },
            { id: 'projects', label: 'Previous projects completed', mandatory: false },
            { id: 'proposal', label: 'Project proposal*', mandatory: true },
        ]
        : [
            { id: 'govId', label: 'Government ID/Passport*', mandatory: true },
            { id: 'birthCert', label: 'Birth Certificate*', mandatory: true },
            { id: 'medicalRecords', label: 'Medical Records*', mandatory: true },
            { id: 'doctorLetter', label: 'Letter from Attending Doctor*', mandatory: true },
            { id: 'attestation', label: 'Lawyer/ Justice of Peace Attestation*', mandatory: true },
            { id: 'finance', label: 'Financial Statement', mandatory: false },
        ];

    // Create a ref for each section
    const fileInputRefs = useRef({});

    const handleFileChange = (e, id) => {
        const file = e.target.files[0];
        if (file) {
            // Check size (limit to 300KB to prevent Firestore bloat)
            if (file.size > 300 * 1024) {
                alert("File too large. Please upload documents smaller than 300KB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedFiles(prev => ({
                    ...prev,
                    [id]: { name: file.name, url: reader.result }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBrowseClick = (id) => {
        if (fileInputRefs.current[id]) {
            fileInputRefs.current[id].click();
        }
    };

    const isDocsValid = () => {
        return uploadSections
            .filter(section => section.mandatory)
            .every(section => uploadedFiles[section.id]);
    };

    const handleSubmit = async () => {
        console.log("CreateCampaign: Submit clicked");
        if (!isDocsValid()) {
            const missing = uploadSections.filter(s => s.mandatory && !uploadedFiles[s.id]).map(s => s.label);
            alert(`Please upload all mandatory documents:\n${missing.join('\n')}`);
            return;
        }

        setIsSaving(true);

        // Global Safety Valve: Force stop after 45 seconds
        const safetyTimer = setTimeout(() => {
            if (isSaving) {
                console.error("Global Safety Timeout reached. Forcing stop.");
                setIsSaving(false);
                alert("Submission is taking longer than expected. Please check your connection and try again, or contact support if this persists.");
            }
        }, 45000);

        try {
            // Update user logic (set status to pending and save docs)
            await updateUserDocuments(uploadedFiles);
            clearTimeout(safetyTimer); // Clear timer if successful
            setIsSubmitted(true);
        } catch (error) {
            clearTimeout(safetyTimer);
            console.error("Error submitting documents:", error);
            alert("Failed to submit documents. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        // After submitting documents:
        // - NGOs/nonprofits: go to their main NGO home route
        // - Individuals: go to the public home page
        const path = (userRole === 'ngo' || userRole === 'nonprofit')
            ? '/dashboard/nonprofit'
            : '/';
        navigate(path);
    };

    if (isSubmitted) {
        return (
            <div style={styles.page}>
                <Navbar />
                <div className="container" style={styles.content}>
                    <div style={styles.modalContent}>
                        <div style={styles.headerTop}>
                            <img src={logo} alt="KindCents Logo" style={styles.logo} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 0' }}>
                            <div style={styles.spinnerWrapper}>
                                <Loader2 size={48} color="#94a3b8" className="animate-spin" />
                            </div>
                            <h2 style={{ ...styles.title, marginBottom: '1rem' }}>Documents being Verified!</h2>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '2rem' }}>
                                Our team will get back to you soon after the documents are verified.
                            </p>
                            <button onClick={handleClose} style={styles.nextBtn}>Home</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <Navbar />

            <div className="container" style={styles.content}>
                <div style={styles.modalContent}>
                    {/* Header with Logo and Progress */}
                    <div style={styles.headerTop}>
                        <img src={logo} alt="KindCents Logo" style={styles.logo} />
                    </div>

                    <div style={styles.progressSection}>
                        <p style={styles.stepIndicator}>Verification Step</p>
                        <div style={styles.progressTrack}>
                            <div style={{ ...styles.progressFill, width: '100%' }} />
                        </div>
                    </div>

                    <h2 style={styles.title}>Upload verification documents</h2>
                    <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem', marginTop: '-1.5rem' }}>
                        To start a new campaign, please submit the required documents. Our team will review them and contact you for further details.
                    </p>

                    <div style={styles.uploadGrid}>
                        {uploadSections.map((section) => (
                            <div key={section.id} style={styles.uploadSection}>
                                <label style={styles.label}>{section.label}</label>
                                <div
                                    style={{
                                        ...styles.uploadCard,
                                        borderColor: uploadedFiles[section.id] ? '#10b981' : '#cbd5e1',
                                        backgroundColor: uploadedFiles[section.id] ? '#f0fdf4' : '#fff',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleBrowseClick(section.id)}
                                >
                                    <CloudUpload size={28} color={uploadedFiles[section.id] ? "#10b981" : "#3b82f6"} style={{ marginBottom: '0.4rem' }} />
                                    <p style={{
                                        ...styles.uploadText,
                                        color: uploadedFiles[section.id] ? '#059669' : '#94a3b8'
                                    }}>
                                        {uploadedFiles[section.id] ? `✓ ${uploadedFiles[section.id].name || uploadedFiles[section.id]}` : 'Drag and drop a file to upload'}
                                    </p>
                                    <button style={styles.browseBtn}>
                                        {uploadedFiles[section.id] ? 'Change file' : 'Browse file'}
                                    </button>
                                    <input
                                        type="file"
                                        ref={el => fileInputRefs.current[section.id] = el}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileChange(e, section.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={styles.buttonRow}>
                        <button onClick={() => navigate(-1)} style={styles.backLinkBtn}>
                            <ChevronLeft size={16} /> Cancel
                        </button>
                        <button
                            style={{
                                ...styles.nextBtn,
                                opacity: isSaving ? 0.7 : 1,
                                cursor: isSaving ? 'not-allowed' : 'pointer',
                                backgroundColor: isDocsValid() ? '#2596be' : '#94a3b8' // Visual cue
                            }}
                            onClick={handleSubmit}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Submitting...' : 'Submit Documents'}
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
        gap: '0.8rem',
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
    },
    spinnerWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1.5rem',
    }
};

export default CreateCampaign;

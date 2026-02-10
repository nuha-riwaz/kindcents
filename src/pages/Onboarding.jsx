import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, User, Heart, ChevronRight, CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo.png';

const Onboarding = () => {
    const { user, saveUserRole } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(2); // Start at step 2 (Role Selection)
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState({});

    const stepsCount = selectedRole === 'donor' ? 3 : 4;

    const roleSpecs = {
        ngo: {
            title: "Nonprofit Organization",
            desc: "A nonprofit with registered charity status from the government",
            icon: <Building2 size={24} />,
            docs: [
                { id: 'reg', label: 'Registration Certificate*', mandatory: true },
                { id: 'tax', label: 'Tax Exemption Record*', mandatory: true },
                { id: 'audit', label: 'Recent Audit Report', mandatory: false }
            ]
        },
        individual: {
            title: "Individual",
            desc: "An individual looking to fundraise for medical purposes",
            icon: <User size={24} />,
            docs: [
                { id: 'nic', label: 'National Identity Card*', mandatory: true },
                { id: 'medical', label: 'Medical Reports*', mandatory: true },
                { id: 'doctor', label: 'Doctor Attestation*', mandatory: true }
            ]
        },
        donor: {
            title: "Donor",
            desc: "An individual looking to donate online",
            icon: <Heart size={24} />,
            docs: []
        }
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleFileChange = (docId) => {
        // Simulated file upload
        setUploadedFiles(prev => ({
            ...prev,
            [docId]: { name: `document_${Math.random().toString(36).substr(2, 5)}.pdf`, size: '1.2MB' }
        }));
    };

    const isStep3Valid = () => {
        if (!selectedRole || !roleSpecs[selectedRole]) return false;
        const mandatoryDocs = roleSpecs[selectedRole].docs.filter(d => d.mandatory);
        return mandatoryDocs.every(d => uploadedFiles[d.id]);
    };

    const handleContinue = async () => {
        if (!selectedRole) return;

        if (step === 2) {
            if (selectedRole === 'donor') {
                await finishOnboarding();
            } else {
                setStep(3);
            }
            return;
        }

        if (step === 3) {
            await finishOnboarding();
        }
    };

    const finishOnboarding = async () => {
        setLoading(true);
        try {
            await saveUserRole(selectedRole);
            setStep(stepsCount); // Success step
        } catch (error) {
            console.error("Failed to save role", error);
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const handleFinish = () => {
        // After onboarding, always send users to home; no implicit default role
        navigate('/');
    };

    const renderStep2 = () => (
        <>
            <h1 style={{ ...styles.title, fontSize: '1.75rem', fontWeight: '800', marginBottom: '2.5rem' }}>
                Which best describes you?
            </h1>

            <div style={styles.options}>
                {Object.entries(roleSpecs).map(([id, spec]) => (
                    <div
                        key={id}
                        style={{ ...styles.roleCard, ...(selectedRole === id ? styles.activeCard : {}) }}
                        onClick={() => handleRoleSelect(id)}
                    >
                        <div style={{ ...styles.roleIconCircle, ...(selectedRole === id ? styles.activeIcon : {}) }}>
                            {spec.icon}
                        </div>
                        <div style={styles.optionContent}>
                            <h3 style={styles.optionTitle}>{spec.title}</h3>
                            <p style={styles.optionDesc}>{spec.desc}</p>
                        </div>
                        {selectedRole === id ? (
                            <CheckCircle2 size={24} color="#10b981" />
                        ) : (
                            <ChevronRight size={20} color="#cbd5e1" />
                        )}
                    </div>
                ))}
            </div>

            <button
                style={{
                    ...styles.continueBtn,
                    opacity: selectedRole ? 1 : 0.5,
                    marginTop: '2rem',
                }}
                onClick={handleContinue}
                disabled={!selectedRole || loading}
            >
                {loading ? 'Setting up...' : 'Continue'}
            </button>
        </>
    );

    const renderStep3 = () => (
        <>
            <h1 style={{ ...styles.title, fontSize: '1.75rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                Verify your identity
            </h1>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>
                To ensure platform safety, we require the following documents for {roleSpecs[selectedRole].title} accounts.
            </p>

            <div style={styles.uploadContainer}>
                {roleSpecs[selectedRole].docs.map(doc => (
                    <div key={doc.id} style={styles.uploadRow}>
                        <div style={styles.uploadInfo}>
                            <p style={styles.uploadLabel}>{doc.label}</p>
                            {uploadedFiles[doc.id] && (
                                <p style={styles.fileName}>
                                    <CheckCircle2 size={12} color="#10b981" /> {uploadedFiles[doc.id].name}
                                </p>
                            )}
                        </div>
                        <label style={styles.uploadBtn}>
                            {uploadedFiles[doc.id] ? 'Change' : 'Upload'}
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={() => handleFileChange(doc.id)}
                            />
                        </label>
                    </div>
                ))}
            </div>

            <button
                style={{
                    ...styles.continueBtn,
                    opacity: isStep3Valid() ? 1 : 0.5,
                    marginTop: '3rem',
                }}
                onClick={handleContinue}
                disabled={!isStep3Valid() || loading}
            >
                {loading ? 'Submitting...' : 'Submit Documents'}
            </button>
            {!isStep3Valid() && (
                <p style={styles.validationText}>* Please upload all mandatory documents to proceed</p>
            )}
        </>
    );

    const renderSuccess = () => (
        <div style={styles.successContainer}>
            <div style={styles.successIconBox}>
                <CheckCircle2 size={64} color="#10b981" />
            </div>
            <h1 style={styles.successTitle}>Profile Setup Complete!</h1>
            <p style={styles.successDesc}>
                {selectedRole === 'donor'
                    ? "Welcome to KindCents. You can now start supporting verified causes."
                    : "Your documents have been submitted for verification. You can still browse the platform while we review your application."}
            </p>
            <button style={styles.finishBtn} onClick={handleFinish}>
                Go to Dashboard
            </button>
        </div>
    );

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={{ width: '100%', textAlign: 'center', marginBottom: '2rem' }}>
                    <img src={logo} alt="KindCents Logo" style={{ height: '70px' }} />
                    {step < stepsCount && (
                        <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                            <p style={styles.stepText}>Step {step} of {stepsCount}</p>
                            <div style={styles.progressBar}>
                                <div style={{
                                    ...styles.progressFill,
                                    width: `${(step / stepsCount) * 100}%`
                                }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === stepsCount && renderSuccess()}
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '4rem'
    },
    header: { width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'center' },
    logo: { height: '60px' },
    container: { width: '100%', maxWidth: '500px', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column' },
    progressRow: { marginBottom: '2rem' },
    stepText: { fontSize: '0.9rem', color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' },
    progressBar: { width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#10b981', transition: 'width 0.3s ease' },
    title: { fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '2rem', textAlign: 'center' },
    options: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' },
    optionContent: { flex: 1 },
    optionTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.25rem 0' },
    optionDesc: { fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: '1.4' },
    roleCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '1.25rem',
        border: '1px solid #f1f5f9',
        borderRadius: '20px',
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        width: '100%',
    },
    roleIconCircle: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: '#f0fdf4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1.25rem',
        flexShrink: 0,
        color: '#10b981',
    },
    activeCard: { borderColor: '#10b981', backgroundColor: '#eefcf5', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)' },
    activeIcon: { backgroundColor: '#10b981', color: 'white' },
    continueBtn: { width: '100%', padding: '1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
    uploadContainer: { display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' },
    uploadRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' },
    uploadInfo: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    uploadLabel: { fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', margin: 0 },
    fileName: { fontSize: '0.8rem', color: '#10b981', fontWeight: '500', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' },
    uploadBtn: { padding: '0.5rem 1.25rem', backgroundColor: 'white', color: '#10b981', border: '1px solid #10b981', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' },
    validationText: { textAlign: 'center', color: '#ef4444', fontSize: '0.85rem', marginTop: '1rem', fontWeight: '500' },
    successContainer: { textAlign: 'center', padding: '2rem 2rem' },
    successIconBox: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
    successTitle: { fontSize: '1.6rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem' },
    successDesc: { fontSize: '1rem', color: '#64748b', lineHeight: '1.6', marginBottom: '2rem' },
    finishBtn: { width: '100%', padding: '1rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' }
};

export default Onboarding;

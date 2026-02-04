import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, User, Heart, ChevronRight, CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo.png';

const Onboarding = () => {
    const { user, saveUserRole } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleContinue = async () => {
        if (!selectedRole) return;
        setLoading(true);
        try {
            await saveUserRole(selectedRole);

            // Redirect based on role
            if (selectedRole === 'admin') navigate('/dashboard/admin');
            else if (selectedRole === 'ndo') navigate('/dashboard/nonprofit');
            else if (selectedRole === 'ngo') navigate('/dashboard/nonprofit');
            else if (selectedRole === 'individual') navigate('/dashboard/individual');
            else navigate('/dashboard/donor'); // Default for donor

        } catch (error) {
            console.error("Failed to save role", error);
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <img src={logo} alt="KindCents" style={styles.logo} />
            </div>

            <div style={styles.container}>
                <div style={styles.progressRow}>
                    <p style={styles.stepText}>Step 2 of 4</p>
                    <div style={styles.progressBar}>
                        <div style={styles.progressFill}></div>
                    </div>
                </div>

                <div style={styles.backLink} onClick={() => navigate(-1)}>&lt; Back</div>

                <h1 style={styles.title}>Which best describes you?</h1>

                <div style={styles.options}>
                    <div
                        style={{ ...styles.optionCard, ...(selectedRole === 'ngo' ? styles.activeCard : {}) }}
                        onClick={() => handleRoleSelect('ngo')}
                    >
                        <div style={styles.iconCircle}>
                            <Building2 size={24} color="#4F96FF" />
                        </div>
                        <div style={styles.optionContent}>
                            <h3 style={styles.optionTitle}>Nonprofit Organization</h3>
                            <p style={styles.optionDesc}>A nonprofit with registered charity status from the government</p>
                        </div>
                        {selectedRole === 'ngo' ? <CheckCircle2 size={24} color="#10b981" /> : <ChevronRight size={24} color="#cbd5e1" />}
                    </div>

                    <div
                        style={{ ...styles.optionCard, ...(selectedRole === 'individual' ? styles.activeCard : {}) }}
                        onClick={() => handleRoleSelect('individual')}
                    >
                        <div style={styles.iconCircle}>
                            <User size={24} color="#4F96FF" />
                        </div>
                        <div style={styles.optionContent}>
                            <h3 style={styles.optionTitle}>Individual</h3>
                            <p style={styles.optionDesc}>An individual looking to fundraise for medical purposes</p>
                        </div>
                        {selectedRole === 'individual' ? <CheckCircle2 size={24} color="#10b981" /> : <ChevronRight size={24} color="#cbd5e1" />}
                    </div>

                    <div
                        style={{ ...styles.optionCard, ...(selectedRole === 'donor' ? styles.activeCard : {}) }}
                        onClick={() => handleRoleSelect('donor')}
                    >
                        <div style={styles.iconCircle}>
                            <Heart size={24} color="#4F96FF" />
                        </div>
                        <div style={styles.optionContent}>
                            <h3 style={styles.optionTitle}>Donor</h3>
                            <p style={styles.optionDesc}>An individual looking to donate online</p>
                        </div>
                        {selectedRole === 'donor' ? <CheckCircle2 size={24} color="#10b981" /> : <ChevronRight size={24} color="#cbd5e1" />}
                    </div>
                </div>

                <button
                    style={{ ...styles.continueBtn, opacity: selectedRole ? 1 : 0.5 }}
                    onClick={handleContinue}
                    disabled={!selectedRole || loading}
                >
                    {loading ? 'Setting up...' : 'Continue'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    header: { width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'center' },
    logo: { height: '40px' },
    container: { width: '100%', maxWidth: '500px', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column' },
    progressRow: { marginBottom: '2rem' },
    stepText: { fontSize: '0.9rem', color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' },
    progressBar: { width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' },
    progressFill: { width: '50%', height: '100%', backgroundColor: '#0ea5e9' },
    backLink: { color: '#64748b', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '1.5rem' },
    title: { fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '2rem', textAlign: 'center' },
    options: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' },
    optionCard: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' },
    activeCard: { borderColor: '#4F96FF', backgroundColor: '#eff6ff', boxShadow: '0 4px 6px -1px rgba(79, 150, 255, 0.1)' },
    iconCircle: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    optionContent: { flex: 1 },
    optionTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.25rem 0' },
    optionDesc: { fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: '1.4' },
    continueBtn: { width: 'fit-content', margin: '0 auto', padding: '0.75rem 2.5rem', backgroundColor: '#e0f2fe', color: '#0ea5e9', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }
};

export default Onboarding;

import React, { useState } from 'react';
import { X, Building2, User, Heart, ChevronRight, ChevronLeft, CloudUpload, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/logo.png';

const AuthModal = ({ isOpen, onClose, initialMode = 'signup' }) => {
    const [mode, setMode] = useState(initialMode); // 'signup', 'login', or 'email-signup'
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState(null); // 'nonprofit', 'individual', 'donor'
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: ''
    });
    const { login, signup, loginEmail } = useAuth();
    const navigate = useNavigate();

    const fileInputRefs = {
        cert: React.useRef(null),
        projects: React.useRef(null),
        proposal: React.useRef(null),
        govId: React.useRef(null),
        birthCert: React.useRef(null),
        medicalRecords: React.useRef(null),
        doctorLetter: React.useRef(null),
        attestation: React.useRef(null),
        financialStatement: React.useRef(null)
    };

    const isCardStyle = {
        width: '100%',
        padding: '2.5rem',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        textAlign: 'left',
    };

    // Reset mode and step when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setMode(initialMode); // Directly use initialMode, no more location-check overwrite
            setStep(1);
            setUserType(null);
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                password: ''
            });
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        const googleUser = await login("Google User");
        if (googleUser) {
            // Check if user has a role in Firestore
            try {
                const userRef = doc(db, 'users', googleUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    if (userData.role) {
                        // User already has a role, log them in fully
                        onClose();
                        navigate(`/dashboard/${userData.role}`);
                        return;
                    }
                }
            } catch (error) {
                console.error("Error checking user role:", error);
            }

            // New user or no role set - proceed to onboarding
            const displayName = googleUser.displayName || '';
            const nameParts = displayName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            setFormData({
                email: googleUser.email || '',
                firstName,
                lastName,
                password: '' // Not needed for Google auth
            });
            setMode('email-signup');
            setStep(2);
        }
    };

    const handleEmailClick = () => {
        setMode('email-signup');
    };

    const handleEmailLoginAction = async (e) => {
        e.preventDefault(); // Prevent form submission refresh
        try {
            // For demo, keep admin check if you want, or remove it.
            // Let's try real login first.
            await loginEmail(formData.email, formData.password);

            // If successful, close and navigate (AuthContext updates user state automatically)
            onClose();
            // Note: Navigation might depend on role, which useEffect in Main App handles, 
            // but here we can just default to dashboard or let the state update redirect.
            // For now, let's just close. The main layout likely redirects based on user.
            // Or we can fetch the user role and redirect. 
            // But since loginEmail returns the user object (firebase user), it doesn't have the firestore role yet synchronously attached 
            // unless we wait for AuthContext to sync. 
            // AuthContext syncs and updates `user` state. 
            // Let's just navigate to /dashboard/donor as default or check email.
            if (formData.email === 'admin@kindcents.org') {
                navigate('/dashboard/admin');
            } else {
                navigate('/dashboard/donor');
            }
        } catch (error) {
            console.error("Login failed", error);
            alert("Login Failed: " + error.message);
        }
    };

    const toggleMode = () => {
        if (mode === 'signup') {
            setMode('login');
        } else {
            setMode('signup');
        }
    };

    // Render the Email Sign Up Form
    if (mode === 'email-signup') {
        const handleStep1Submit = async (e) => {
            e.preventDefault();

            // If user logged in via google, they are already authenticated, so we just proceed to step 2 for role selection.
            // But if they are filling out the email form, we need to create the account.

            // Check if we already have a user (Google Sign In case)
            // Actually, handleGoogleLogin sets step to 2 directly.
            // So if we are at step 1, it MUST be email signup.

            try {
                const fullName = `${formData.firstName} ${formData.lastName}`;
                await signup(formData.email, formData.password, fullName);
                // Signup successful - User is now logged in.
                setStep(2);
            } catch (error) {
                console.error("Signup failed", error);
                alert("Signup Failed: " + error.message);
            }
        };

        // ... (rest of step 1 render)

        const handleBrowseClick = (key) => {
            if (fileInputRefs[key].current) {
                fileInputRefs[key].current.click();
            }
        };

        const handleFileChange = (e, key) => {
            const file = e.target.files[0];
            if (file) {
                console.log(`File selected for ${key}:`, file.name);
                // In a real app, we'd store this in state
            }
        };

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        if (step === 1) {
            return (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <button onClick={onClose} style={styles.closeBtn}>
                            <X size={24} />
                        </button>

                        <div style={styles.content}>
                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1rem' }}>
                                <img src={logo} alt="KindCents" style={{ height: '60px' }} />
                            </div>

                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Step 1 of 4</p>
                                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}>
                                    <div style={{ width: '25%', height: '100%', backgroundColor: '#2596be', borderRadius: '3px' }}></div>
                                </div>
                            </div>

                            <h2 style={{ ...styles.title, fontSize: '1.5rem', marginBottom: '2rem' }}>
                                Let's set up your account
                            </h2>

                            <form style={{ width: '100%', textAlign: 'left' }} onSubmit={handleStep1Submit}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Email*</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Enter your email"
                                        style={styles.input}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ ...styles.formGroup, flex: 1 }}>
                                        <label style={styles.label}>First Name*</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            placeholder="First name"
                                            style={styles.input}
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div style={{ ...styles.formGroup, flex: 1 }}>
                                        <label style={styles.label}>Last Name*</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            placeholder="Last name"
                                            style={styles.input}
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Password*</label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="Create a password"
                                        style={styles.input}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                                        Your password must include at least 8 characters, an uppercase letter, a lowercase letter, and a number.
                                    </p>
                                </div>

                                <button type="submit" style={{ ...styles.emailBtn, marginTop: '1rem' }}>
                                    Create a free account
                                </button>
                            </form>

                            <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '1rem' }}>
                                By clicking on "Create an account", you accept our <a href="#" style={{ color: '#2596be', textDecoration: 'none' }}>Terms of Use</a>
                            </p>

                            <div style={{ ...styles.trustBadge, marginTop: '2rem' }}>
                                <span style={styles.heartIcon}>♥</span> 80k+
                            </div>
                            <p style={styles.trustText}>nonprofits use KindCents to fundraise</p>
                        </div>
                    </div>
                </div>
            );
        }

        if (step === 2) {
            return (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <button onClick={onClose} style={styles.closeBtn}>
                            <X size={24} />
                        </button>

                        <div style={styles.content}>
                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1rem' }}>
                                <img src={logo} alt="KindCents" style={{ height: '60px' }} />
                            </div>

                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Step 2 of 4</p>
                                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}>
                                    <div style={{ width: '50%', height: '100%', backgroundColor: '#2596be', borderRadius: '3px' }}></div>
                                </div>
                            </div>

                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1.5rem' }}>
                                <button onClick={() => setStep(1)} style={styles.backLinkBtn}>
                                    <ChevronLeft size={16} /> Back
                                </button>
                            </div>

                            <h2 style={{ ...styles.title, fontSize: '1.5rem', marginBottom: '2rem' }}>
                                Which best describes you?
                            </h2>

                            <div style={styles.optionsList}>
                                <div style={styles.optionCard} onClick={() => { setUserType('nonprofit'); setStep(3); }}>
                                    <div style={{ ...styles.iconCircle, color: '#3b82f6' }}>
                                        <Building2 size={24} />
                                    </div>
                                    <div style={styles.optionContent}>
                                        <h3 style={styles.optionTitle}>Nonprofit Organization</h3>
                                        <p style={styles.optionDesc}>A nonprofit with registered charity status from the government</p>
                                    </div>
                                    <ChevronRight size={20} color="#94a3b8" />
                                </div>

                                <div style={styles.optionCard} onClick={() => { setUserType('individual'); setStep(3); }}>
                                    <div style={{ ...styles.iconCircle, color: '#3b82f6' }}>
                                        <User size={24} />
                                    </div>
                                    <div style={styles.optionContent}>
                                        <h3 style={styles.optionTitle}>Individual</h3>
                                        <p style={styles.optionDesc}>An individual looking to fundraise for medical purposes</p>
                                    </div>
                                    <ChevronRight size={20} color="#94a3b8" />
                                </div>

                                <div style={styles.optionCard} onClick={() => { setUserType('donor'); setStep(3); }}>
                                    <div style={{ ...styles.iconCircle, color: '#3b82f6' }}>
                                        <Heart size={24} />
                                    </div>
                                    <div style={styles.optionContent}>
                                        <h3 style={styles.optionTitle}>Donor</h3>
                                        <p style={styles.optionDesc}>An individual looking to donate online</p>
                                    </div>
                                    <ChevronRight size={20} color="#94a3b8" />
                                </div>
                            </div>

                            <div style={{ ...styles.trustBadge, marginTop: '2rem' }}>
                                <span style={styles.heartIcon}>♥</span> 80k+
                            </div>
                            <p style={styles.trustText}>nonprofits use KindCents to fundraise</p>
                        </div>
                    </div>
                </div>
            );
        }

        if (step === 3) {
            const isDonor = userType === 'donor';
            const progress = isDonor ? '100%' : '75%';
            const stepTotal = isDonor ? 3 : 4;

            return (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <button onClick={onClose} style={styles.closeBtn}>
                            <X size={24} />
                        </button>

                        <div style={styles.content}>
                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1rem' }}>
                                <img src={logo} alt="KindCents" style={{ height: '60px' }} />
                            </div>

                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Step 3 of {stepTotal}</p>
                                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}>
                                    <div style={{ width: progress, height: '100%', backgroundColor: '#2596be', borderRadius: '3px' }}></div>
                                </div>
                            </div>

                            {userType === 'nonprofit' && (
                                <>
                                    <h2 style={{ ...styles.title, fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'left', width: '100%' }}>
                                        What is the name of your nonprofit?
                                    </h2>
                                    <form style={{ width: '100%', textAlign: 'left' }} onSubmit={(e) => { e.preventDefault(); setStep(4); }}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Legal nonprofit name*</label>
                                            <input type="text" required placeholder="Enter your nonprofit's legal name" style={styles.input} />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Registration number*</label>
                                            <input type="text" required placeholder="Enter your registration number" style={styles.input} />
                                        </div>
                                        <div style={styles.buttonRow}>
                                            <button type="button" onClick={() => setStep(2)} style={styles.backLinkBtn}>
                                                <ChevronLeft size={16} /> Back
                                            </button>
                                            <button type="submit" style={styles.nextBtn}>Next</button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {userType === 'individual' && (
                                <>
                                    <h2 style={{ ...styles.title, fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center', width: '100%' }}>
                                        Individuals on KindCents
                                    </h2>
                                    <div style={isCardStyle}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center' }}>I'm an individual</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', lineHeight: '1.5', textAlign: 'justify' }}>
                                            I'm an individual looking to fundraise online for medical assistance.
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.5rem', lineHeight: '1.5', textAlign: 'justify' }}>
                                            KindCents is designed for individuals seeking financial assistance for medical causes only and does not support other causes at the moment!
                                        </p>
                                        <form style={{ width: '100%', textAlign: 'left' }} onSubmit={(e) => { e.preventDefault(); setStep(4); }}>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Name*</label>
                                                <input type="text" required placeholder="Enter your name" style={styles.input} />
                                            </div>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Government ID/Passport No.*</label>
                                                <input type="text" required placeholder="Enter your Government ID/Passport No." style={styles.input} />
                                            </div>
                                            <div style={styles.buttonRow}>
                                                <button type="button" onClick={() => setStep(2)} style={styles.backLinkBtn}>
                                                    <ChevronLeft size={16} /> Back
                                                </button>
                                                <button type="submit" style={styles.nextBtn}>Next</button>
                                            </div>
                                        </form>
                                    </div>
                                </>
                            )}

                            {userType === 'donor' && (
                                <>
                                    <h2 style={{ ...styles.title, fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center', width: '100%' }}>
                                        Donor on KindCents
                                    </h2>
                                    <div style={isCardStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>I'm a donor</h3>
                                            <Heart size={20} color="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.5rem', lineHeight: '1.5', textAlign: 'justify' }}>
                                            If you have previously donated through KindCents, you can track your donations from your KindCents account.<br />
                                            Please <a href="#" style={{ color: '#2596be', textDecoration: 'none', fontWeight: '600' }}>log in</a> to KindCents to make a donation.
                                        </p>
                                        <div style={styles.buttonRow}>
                                            <button type="button" onClick={() => setStep(2)} style={styles.backLinkBtn}>
                                                <ChevronLeft size={16} /> Back
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    login("Simulated", formData.firstName, "donor");
                                                    onClose();
                                                    navigate('/dashboard/donor');
                                                }}
                                                style={styles.nextBtn}
                                            >
                                                Donor Sign Up
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (step === 4) {
            return (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <button onClick={onClose} style={styles.closeBtn}>
                            <X size={24} />
                        </button>

                        <div style={styles.content}>
                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1rem' }}>
                                <img src={logo} alt="KindCents" style={{ height: '60px' }} />
                            </div>

                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Step 4 of 4</p>
                                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}>
                                    <div style={{ width: '100%', height: '100%', backgroundColor: '#2596be', borderRadius: '3px' }}></div>
                                </div>
                            </div>

                            <h2 style={{ ...styles.title, fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', width: '100%' }}>
                                Upload documents for verification
                            </h2>

                            <div style={{ width: '100%', textAlign: 'left' }}>
                                {userType === 'nonprofit' ? (
                                    <>
                                        <div style={styles.uploadSection}>
                                            <label style={styles.label}>Government certification*</label>
                                            <div style={styles.uploadCard} onClick={() => handleBrowseClick('cert')}>
                                                <CloudUpload size={32} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                                                <p style={styles.uploadText}>Drag and drop a file to upload</p>
                                                <button style={styles.browseBtn}>Browse file</button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRefs.cert}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, 'cert')}
                                                />
                                            </div>
                                        </div>

                                        <div style={styles.uploadSection}>
                                            <label style={styles.label}>Previous projects completed</label>
                                            <div style={styles.uploadCard} onClick={() => handleBrowseClick('projects')}>
                                                <CloudUpload size={32} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                                                <p style={styles.uploadText}>Drag and drop a file to upload</p>
                                                <button style={styles.browseBtn}>Browse file</button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRefs.projects}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, 'projects')}
                                                />
                                            </div>
                                        </div>

                                        <div style={styles.uploadSection}>
                                            <label style={styles.label}>Project proposal*</label>
                                            <div style={styles.uploadCard} onClick={() => handleBrowseClick('proposal')}>
                                                <CloudUpload size={32} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                                                <p style={styles.uploadText}>Drag and drop a file to upload</p>
                                                <button style={styles.browseBtn}>Browse file</button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRefs.proposal}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, 'proposal')}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={styles.uploadSection}>
                                            <label style={styles.label}>Government ID/Passport*</label>
                                            <div style={styles.uploadCard} onClick={() => handleBrowseClick('govId')}>
                                                <CloudUpload size={32} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                                                <p style={styles.uploadText}>Drag and drop a file to upload</p>
                                                <button style={styles.browseBtn}>Browse file</button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRefs.govId}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, 'govId')}
                                                />
                                            </div>
                                        </div>

                                        <div style={styles.uploadSection}>
                                            <label style={styles.label}>Birth Certificate*</label>
                                            <div style={styles.uploadCard} onClick={() => handleBrowseClick('birthCert')}>
                                                <CloudUpload size={32} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                                                <p style={styles.uploadText}>Drag and drop a file to upload</p>
                                                <button style={styles.browseBtn}>Browse file</button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRefs.birthCert}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, 'birthCert')}
                                                />
                                            </div>
                                        </div>

                                        <div style={styles.uploadSection}>
                                            <label style={styles.label}>Medical Records*</label>
                                            <div style={styles.uploadCard} onClick={() => handleBrowseClick('medicalRecords')}>
                                                <CloudUpload size={32} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                                                <p style={styles.uploadText}>Drag and drop a file to upload</p>
                                                <button style={styles.browseBtn}>Browse file</button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRefs.medicalRecords}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, 'medicalRecords')}
                                                />
                                            </div>
                                        </div>

                                        <div style={styles.uploadSection}>
                                            <label style={styles.label}>Letter from Attending Doctor*</label>
                                            <div style={styles.uploadCard} onClick={() => handleBrowseClick('doctorLetter')}>
                                                <CloudUpload size={32} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                                                <p style={styles.uploadText}>Drag and drop a file to upload</p>
                                                <button style={styles.browseBtn}>Browse file</button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRefs.doctorLetter}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, 'doctorLetter')}
                                                />
                                            </div>
                                        </div>

                                        <div style={styles.uploadSection}>
                                            <label style={styles.label}>Lawyer/ Justice of Peace Attestation*</label>
                                            <div style={styles.uploadCard} onClick={() => handleBrowseClick('attestation')}>
                                                <CloudUpload size={32} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                                                <p style={styles.uploadText}>Drag and drop a file to upload</p>
                                                <button style={styles.browseBtn}>Browse file</button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRefs.attestation}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, 'attestation')}
                                                />
                                            </div>
                                        </div>

                                        <div style={styles.uploadSection}>
                                            <label style={styles.label}>Financial Statement</label>
                                            <div style={styles.uploadCard} onClick={() => handleBrowseClick('financialStatement')}>
                                                <CloudUpload size={32} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                                                <p style={styles.uploadText}>Drag and drop a file to upload</p>
                                                <button style={styles.browseBtn}>Browse file</button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRefs.financialStatement}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, 'financialStatement')}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div style={styles.buttonRow}>
                                    <button type="button" onClick={() => setStep(3)} style={styles.backLinkBtn}>
                                        <ChevronLeft size={16} /> Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (userType === 'nonprofit' || userType === 'individual') {
                                                setStep(5);
                                            } else {
                                                login("Simulated", formData.firstName || (userType === 'nonprofit' ? 'Nonprofit Admin' : 'Individual'), userType);
                                                onClose();
                                                navigate(`/dashboard/${userType}`);
                                            }
                                        }}
                                        style={styles.nextBtn}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (step === 5) {
            return (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <div style={styles.content}>
                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1rem' }}>
                                <img src={logo} alt="KindCents" style={{ height: '60px' }} />
                            </div>

                            <div style={{ ...isCardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
                                <div style={styles.spinnerWrapper}>
                                    <Loader2 size={48} color="#94a3b8" />
                                </div>
                                <h2 style={{ ...styles.title, fontSize: '1.5rem', marginBottom: '1rem' }}>
                                    Documents being Verified!
                                </h2>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
                                    Our team will get back to you soon after the documents are verified.
                                </p>
                            </div>

                            <div style={styles.buttonRow}>
                                <button type="button" onClick={() => setStep(4)} style={styles.backLinkBtn}>
                                    <ChevronLeft size={16} /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        login("Simulated", formData.firstName || (userType === 'nonprofit' ? 'Nonprofit Admin' : 'Individual'), userType);
                                        onClose();
                                        navigate(`/dashboard/${userType}`);
                                    }}
                                    style={{ ...styles.nextBtn, minWidth: '100px' }}
                                >
                                    Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }



    // Render the Main Mode (Login/Signup Selection)
    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button onClick={onClose} style={styles.closeBtn}>
                    <X size={24} />
                </button>

                <div style={styles.content}>
                    <img src={logo} alt="KindCents" style={{ height: '60px', marginBottom: '1rem' }} />

                    {mode === 'signup' ? (
                        <>
                            <h2 style={styles.title}>Start Donating or Fundraising!</h2>
                            <p style={styles.subtitle}>The only 100% free fundraising platform</p>

                            <div style={styles.actions}>
                                <button onClick={handleGoogleLogin} style={styles.googleBtn}>
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: '18px', marginRight: '10px' }} />
                                    Sign up with Google
                                </button>

                                <div style={styles.divider}>
                                    <span style={styles.dividerLine}></span>
                                    <span style={styles.dividerText}>or</span>
                                    <span style={styles.dividerLine}></span>
                                </div>

                                <button onClick={handleEmailClick} style={styles.emailBtn}>
                                    Sign up with Email
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ width: '100%', textAlign: 'left' }}>
                            <h2 style={{ ...styles.title, textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>

                            <div style={{ width: '100%', marginBottom: '1.5rem' }}>
                                <button onClick={handleGoogleLogin} style={styles.googleBtn}>
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: '18px', marginRight: '10px' }} />
                                    Log in with Google
                                </button>
                                <div style={{ ...styles.divider, marginTop: '1.5rem' }}>
                                    <span style={styles.dividerLine}></span>
                                    <span style={styles.dividerText}>or</span>
                                    <span style={styles.dividerLine}></span>
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    style={styles.input}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Password*</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    style={styles.input}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input type="checkbox" id="remember" style={{ cursor: 'pointer' }} />
                                    <label htmlFor="remember" style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>Remember me</label>
                                </div>
                                <button style={{ ...styles.linkBtn, fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>Forgot password?</button>
                            </div>

                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                                <button
                                    onClick={handleEmailLoginAction}
                                    style={{ ...styles.nextBtn, width: 'auto', padding: '10px 40px' }}
                                >
                                    Log in
                                </button>
                            </div>
                        </div>
                    )}

                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <p style={{ ...styles.footerText, marginBottom: '1rem' }}>
                            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                            <button onClick={toggleMode} style={styles.linkBtn}>
                                {mode === 'signup' ? 'Log in' : 'Sign up'}
                            </button>
                        </p>

                        <div style={styles.trustBadge}>
                            <span style={styles.heartIcon}>♥</span> 80k+
                        </div>
                        <p style={styles.trustText}>nonprofits use KindCents to fundraise</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'flex-start', // Changed from center to flex-start to prevent top clipping
        justifyContent: 'center',
        zIndex: 2000,
        overflowY: 'auto',
        paddingTop: '3rem', // Add space at top
        paddingBottom: '3rem'
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '500px',
        padding: '3rem 2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        textAlign: 'center',
        border: '1px solid #f1f5f9',
        margin: '2rem 0',
    },
    closeBtn: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#64748b',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '0.5rem',
        lineHeight: 1.2,
    },
    subtitle: {
        fontSize: '1rem',
        color: '#64748b',
        marginBottom: '2rem',
    },
    actions: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    googleBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '1rem',
        color: '#334155',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        transition: 'background-color 0.2s',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1.5rem',
        color: '#94a3b8',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        padding: '0 10px',
        fontSize: '0.9rem',
    },
    emailBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2897c8',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: '1.5rem',
    },
    footerText: {
        fontSize: '0.95rem',
        color: '#64748b',
        marginBottom: '2rem',
    },
    linkBtn: {
        background: 'none',
        border: 'none',
        color: '#2897c8',
        fontWeight: '600',
        cursor: 'pointer',
        marginLeft: '5px',
        fontSize: '0.95rem',
    },
    trustBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#e0f2fe',
        color: '#0ea5e9',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
    },
    heartIcon: {
        marginRight: '5px',
    },
    trustText: {
        fontSize: '0.85rem',
        color: '#94a3b8',
    },
    formGroup: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#334155',
        marginBottom: '0.5rem',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '1rem',
        outline: 'none',
        color: '#1e293b',
    },
    optionsList: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    optionCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
    },
    iconCircle: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1rem',
        flexShrink: 0,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '0.25rem',
    },
    optionDesc: {
        fontSize: '0.85rem',
        color: '#64748b',
        lineHeight: '1.4',
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
    buttonRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2rem',
        width: '100%',
    },
    nextBtn: {
        padding: '10px 24px',
        backgroundColor: '#2897c8',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    uploadSection: {
        marginBottom: '1rem',
    },
    uploadCard: {
        width: '100%',
        padding: '1.5rem',
        border: '2px dashed #e2e8f0',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        transition: 'border-color 0.2s',
        cursor: 'pointer',
    },
    uploadText: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        marginBottom: '0.75rem',
    },
    browseBtn: {
        padding: '6px 16px',
        backgroundColor: '#2897c8',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '0.85rem',
        fontWeight: '500',
        cursor: 'pointer',
    },
    spinnerWrapper: {
        marginBottom: '1.5rem',
        animation: 'spin 2s linear infinite',
    }
};

// Add CSS animation for the spinner if not already present in global CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);

export default AuthModal;

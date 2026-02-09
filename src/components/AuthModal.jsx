import React, { useState } from 'react';
import { X, Building2, User, Heart, ChevronRight, ChevronLeft, CloudUpload, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
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
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetStatus, setResetStatus] = useState({ type: '', message: '' });
    const { login, signup, loginEmail, saveUserRole, updateUserDocuments, resetPassword } = useAuth();
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
        finance: React.useRef(null)
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
            setUploadedFiles({});
            setShowPassword(false);
            setResetEmail('');
            setResetStatus({ type: '', message: '' });
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

                const userExists = userSnap.exists() && userSnap.data().role;

                if (mode === 'login') {
                    if (!userExists) {
                        // User is trying to login but has no account. 
                        // Sign them out and ask them to sign up.
                        await auth.signOut();
                        alert("Account not found. Please sign up to create a new account.");
                        setMode('signup');
                        setStep(1); // Go back to start of signup
                        return;
                    }
                    // If user exists, proceed to navigation logic below
                } else if (mode === 'signup' || mode === 'email-signup') {
                    if (userExists) {
                        alert("Account already exists. Logging you in...");
                        // Proceed to navigation logic below as if logged in
                    }
                    // If new user in signup mode, proceed to Step 2 below
                }

                if (userExists) {
                    const userData = userSnap.data();
                    const role = userData.role.toLowerCase();
                    onClose();
                    // Admin check
                    if (role === 'admin' || googleUser.email === 'admin@kindcents.org') {
                        navigate('/dashboard/admin');
                        return;
                    }
                    // For all other roles, go to home
                    navigate('/');
                    return;
                }
            } catch (error) {
                console.error("Error checking user role:", error);
            }

            // If we are here, it means:
            // 1. We are in signup mode (or switched to it)
            // 2. User does not exist in DB
            // So we proceed to role selection
            setMode('email-signup'); // Ensure UI is in signup mode
            setStep(2);
        }
    };

    const handleEmailClick = () => {
        setMode('email-signup');
    };

    const getFriendlyErrorMessage = (error) => {
        switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return "The email or password you entered is incorrect.";
            case 'auth/too-many-requests':
                return "Access disabled temporarily due to many failed attempts. Try again later.";
            case 'auth/network-request-failed':
                return "Network error. Please check your internet connection.";
            default:
                return "Login failed. Please try again.";
        }
    };

    const handleEmailLoginAction = async (e) => {
        e.preventDefault(); // Prevent form submission refresh
        setLoginError('');

        const email = formData.email ? formData.email.trim().toLowerCase() : '';
        const password = formData.password ? formData.password.trim() : '';

        // Bypass for test accounts
        if (password === 'Test@123') {
            if (email === 'rashid.hsn@gmail.com') {
                login("Simulated", "Rashid Hassan", "individual", email);
                onClose();
                navigate('/');
                return;
            }
            if (email === 'admin@akshay.org') {
                login("Simulated", "Akshay Society", "ngo", email);
                onClose();
                navigate('/');
                return;
            }
        }

        try {
            // For demo, keep admin check if you want, or remove it.
            const loggedInUser = await loginEmail(email, password);

            if (loggedInUser) {
                // Fetch the user role to decide where to go
                const userRef = doc(db, 'users', loggedInUser.uid);
                const userSnap = await getDoc(userRef);

                onClose();

                if (userSnap.exists()) {
                    const role = (userSnap.data().role || 'donor').toLowerCase();
                    if (role === 'admin' || email === 'admin@kindcents.org') navigate('/dashboard/admin');
                    else navigate('/');
                } else {
                    // Fallback for admin email even if doc missing
                    if (email === 'admin@kindcents.org') navigate('/dashboard/admin');
                    else navigate('/');
                }
            }
        } catch (error) {
            console.error("Login failed", error);
            setLoginError(getFriendlyErrorMessage(error));
        }
    };


    const toggleMode = () => {
        if (mode === 'signup') {
            setMode('login');
        } else {
            setMode('signup');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'email' || name === 'password') {
            setLoginError('');
        }
    };

    const handleFileChange = (e, key) => {
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
                    [key]: { name: file.name, url: reader.result }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBrowseClick = (key) => {
        if (fileInputRefs[key].current) {
            fileInputRefs[key].current.click();
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            setResetStatus({ type: 'error', message: 'Please enter your email address.' });
            return;
        }

        try {
            setResetStatus({ type: '', message: '' });
            await resetPassword(resetEmail);
            setResetStatus({ type: 'success', message: 'Password reset link sent! Check your email.' });
        } catch (error) {
            console.error("Reset password error", error);
            if (error.code === 'auth/user-not-found') {
                setResetStatus({ type: 'error', message: 'No account found with this email.' });
            } else {
                setResetStatus({ type: 'error', message: 'Failed to send reset email. Please try again.' });
            }
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

            const validatePassword = (pass) => {
                const requirements = [
                    pass.length >= 8,
                    /[A-Z]/.test(pass),
                    /[a-z]/.test(pass),
                    /[0-9]/.test(pass)
                ];
                return requirements.every(Boolean);
            };

            try {
                if (!validatePassword(formData.password)) {
                    setPasswordError('Password does not meet the requirements.');
                    return;
                }
                setPasswordError('');

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


        if (step === 1) {
            return (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        {mode === 'login' && (
                            <button onClick={onClose} style={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        )}

                        <div style={styles.content}>
                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1rem' }}>
                                <img src={logo} alt="KindCents Logo" style={{ height: '60px', marginBottom: '1rem' }} />
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
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            placeholder="Create a password"
                                            style={{ ...styles.input, paddingRight: '40px' }}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#94a3b8'
                                            }}
                                        >
                                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                        </button>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: passwordError ? '#ef4444' : '#64748b', marginTop: '0.5rem' }}>
                                        {passwordError || "Your password must include at least 8 characters, an uppercase letter, a lowercase letter, and a number."}
                                    </p>
                                </div>

                                <button type="submit" style={{ ...styles.emailBtn, marginTop: '1rem' }}>
                                    Create a free account
                                </button>
                            </form>

                            <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '1rem' }}>
                                By clicking on "Create an account", you accept our <a href="/terms-and-conditions" style={{ color: '#2596be', textDecoration: 'none' }}>Terms of Use</a>
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
                        {mode === 'login' && (
                            <button onClick={onClose} style={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        )}

                        <div style={styles.content}>
                            <div style={{ width: '100%', textAlign: 'center', marginBottom: '2rem' }}>
                                <img src={logo} alt="KindCents" style={{ height: '70px' }} />
                                <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Step 2 of 4</p>
                                    <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}>
                                        <div style={{ width: '50%', height: '100%', backgroundColor: '#2596be', borderRadius: '3px' }}></div>
                                    </div>
                                </div>
                            </div>

                            <h2 style={{ ...styles.title, fontSize: '1.75rem', fontWeight: '800', marginBottom: '2.5rem', textAlign: 'center' }}>
                                Which best describes you?
                            </h2>

                            <div style={styles.optionsList}>
                                <div style={styles.roleCard} onClick={() => {
                                    setUserType('nonprofit');
                                    setStep(3);
                                }}>
                                    <div style={{ ...styles.roleIconCircle, color: '#3b82f6' }}>
                                        <Building2 size={24} />
                                    </div>
                                    <div style={styles.optionContent}>
                                        <h3 style={styles.optionTitle}>Nonprofit Organization</h3>
                                        <p style={styles.optionDesc}>A nonprofit with registered charity status from the government</p>
                                    </div>
                                    <ChevronRight size={20} color="#cbd5e1" />
                                </div>

                                <div style={styles.roleCard} onClick={() => {
                                    setUserType('individual');
                                    setStep(3);
                                }}>
                                    <div style={{ ...styles.roleIconCircle, color: '#3b82f6' }}>
                                        <User size={24} />
                                    </div>
                                    <div style={styles.optionContent}>
                                        <h3 style={styles.optionTitle}>Individual</h3>
                                        <p style={styles.optionDesc}>An individual looking to fundraise for medical purposes</p>
                                    </div>
                                    <ChevronRight size={20} color="#cbd5e1" />
                                </div>

                                <div style={styles.roleCard} onClick={() => {
                                    setUserType('donor');
                                    setStep(3);
                                }}>
                                    <div style={{ ...styles.roleIconCircle, color: '#3b82f6' }}>
                                        <Heart size={24} />
                                    </div>
                                    <div style={styles.optionContent}>
                                        <h3 style={styles.optionTitle}>Donor</h3>
                                        <p style={styles.optionDesc}>An individual looking to donate online</p>
                                    </div>
                                    <ChevronRight size={20} color="#cbd5e1" />
                                </div>
                            </div>

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
                        {mode === 'login' && (
                            <button onClick={onClose} style={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        )}

                        <div style={styles.content}>
                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1rem' }}>
                                <img src={logo} alt="KindCents Logo" style={{ height: '60px', marginBottom: '1rem' }} />
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
                                                onClick={async () => {
                                                    await saveUserRole('donor');
                                                    onClose();
                                                    navigate('/');
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
                        {mode === 'login' && (
                            <button onClick={onClose} style={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        )}

                        <div style={styles.content}>
                            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1rem' }}>
                                <img src={logo} alt="KindCents Logo" style={{ height: '60px', marginBottom: '1rem' }} />
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
                                                {uploadedFiles.cert && (
                                                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>
                                                        ✓ {uploadedFiles.cert?.name || uploadedFiles.cert}
                                                    </p>
                                                )}
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
                                                {uploadedFiles.projects && (
                                                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>
                                                        ✓ {uploadedFiles.projects?.name || uploadedFiles.projects}
                                                    </p>
                                                )}
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
                                                {uploadedFiles.proposal && (
                                                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>
                                                        ✓ {uploadedFiles.proposal?.name || uploadedFiles.proposal}
                                                    </p>
                                                )}
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
                                                {uploadedFiles.govId && (
                                                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>
                                                        ✓ {uploadedFiles.govId?.name || uploadedFiles.govId}
                                                    </p>
                                                )}
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
                                                {uploadedFiles.birthCert && (
                                                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>
                                                        ✓ {uploadedFiles.birthCert?.name || uploadedFiles.birthCert}
                                                    </p>
                                                )}
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
                                                {uploadedFiles.medicalRecords && (
                                                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>
                                                        ✓ {uploadedFiles.medicalRecords?.name || uploadedFiles.medicalRecords}
                                                    </p>
                                                )}
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
                                                {uploadedFiles.doctorLetter && (
                                                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>
                                                        ✓ {uploadedFiles.doctorLetter?.name || uploadedFiles.doctorLetter}
                                                    </p>
                                                )}
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
                                                {uploadedFiles.attestation && (
                                                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>
                                                        ✓ {uploadedFiles.attestation?.name || uploadedFiles.attestation}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div style={styles.uploadSection}>
                                            <label style={styles.label}>Financial Statement</label>
                                            <div style={styles.uploadCard} onClick={() => handleBrowseClick('finance')}>
                                                <CloudUpload size={32} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                                                <p style={styles.uploadText}>Drag and drop a file to upload</p>
                                                <button style={styles.browseBtn}>Browse file</button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRefs.finance}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, 'finance')}
                                                />
                                                {uploadedFiles.finance && (
                                                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>
                                                        ✓ {uploadedFiles.finance?.name || uploadedFiles.finance}
                                                    </p>
                                                )}
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
                                        onClick={async () => {
                                            if (userType === 'nonprofit' || userType === 'individual') {
                                                setStep(5);
                                            } else {
                                                await saveUserRole('donor');
                                                onClose();
                                                navigate('/');
                                            }
                                        }}
                                        style={{
                                            ...styles.nextBtn,
                                            opacity: (userType === 'donor' || (userType === 'individual' && uploadedFiles.govId && uploadedFiles.birthCert && uploadedFiles.medicalRecords && uploadedFiles.doctorLetter && uploadedFiles.attestation) || (userType === 'nonprofit' && uploadedFiles.cert && uploadedFiles.proposal)) ? 1 : 0.5
                                        }}
                                        disabled={(userType === 'individual' && !(uploadedFiles.govId && uploadedFiles.birthCert && uploadedFiles.medicalRecords && uploadedFiles.doctorLetter && uploadedFiles.attestation)) || (userType === 'nonprofit' && !(uploadedFiles.cert && uploadedFiles.proposal))}
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
                                <img src={logo} alt="KindCents Logo" style={{ height: '60px', marginBottom: '1rem' }} />
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
                                    onClick={async () => {
                                        if (Object.keys(uploadedFiles).length > 0) {
                                            await updateUserDocuments(uploadedFiles);
                                        }
                                        await saveUserRole(userType);
                                        onClose();
                                        const role = (userType || 'donor').toLowerCase();
                                        if (role === 'admin') navigate('/dashboard/admin');
                                        else navigate('/');
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

    if (mode === 'forgot-password') {
        return (
            <div style={styles.overlay}>
                <div style={styles.modal}>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <X size={24} />
                    </button>

                    <div style={styles.content}>
                        <div style={{ width: '100%', textAlign: 'left', marginBottom: '1rem' }}>
                            <img src={logo} alt="KindCents Logo" style={{ height: '60px', marginBottom: '1rem' }} />
                        </div>

                        <h2 style={{ ...styles.title, fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'left', width: '100%' }}>
                            Reset Password
                        </h2>
                        <p style={{ ...styles.subtitle, textAlign: 'left', marginBottom: '1.5rem' }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <form style={{ width: '100%', textAlign: 'left' }} onSubmit={handleForgotPassword}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email*</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    style={styles.input}
                                    value={resetEmail}
                                    onChange={(e) => {
                                        setResetEmail(e.target.value);
                                        setResetStatus({ type: '', message: '' });
                                    }}
                                />
                            </div>

                            {resetStatus.message && (
                                <div style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    marginBottom: '1.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    backgroundColor: resetStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
                                    border: `1px solid ${resetStatus.type === 'success' ? '#dcfce7' : '#fee2e2'}`,
                                    color: resetStatus.type === 'success' ? '#166534' : '#ef4444'
                                }}>
                                    {resetStatus.type === 'success' ? <CloudUpload size={20} /> : <AlertCircle size={20} />}
                                    <span>{resetStatus.message}</span>
                                </div>
                            )}

                            <div style={styles.buttonRow}>
                                <button type="button" onClick={() => setMode('login')} style={styles.backLinkBtn}>
                                    <ChevronLeft size={16} /> Back to Login
                                </button>
                                <button type="submit" style={styles.nextBtn}>
                                    Send Reset Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }



    // Render the Main Mode (Login/Signup Selection)
    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {mode === 'login' && (
                    <button onClick={onClose} style={styles.closeBtn}>
                        <X size={24} />
                    </button>
                )}

                <div style={styles.content}>
                    <img src={logo} alt="KindCents" style={{ height: '60px', marginBottom: '1rem' }} />

                    {mode === 'signup' ? (
                        <>
                            <h2 style={styles.title}>Start Donating or Fundraising!</h2>
                            <p style={styles.subtitle}>The only 100% free fundraising platform</p>

                            <div style={styles.actions}>
                                <button onClick={handleGoogleLogin} style={styles.googleBtn}>
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Sign-In Logo" style={{ width: '18px', marginRight: '10px' }} />
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
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Sign-In Logo" style={{ width: '18px', marginRight: '10px' }} />
                                    Log in with Google
                                </button>
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
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        style={{ ...styles.input, paddingRight: '40px' }}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#94a3b8'
                                        }}
                                    >
                                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input type="checkbox" id="remember" style={{ cursor: 'pointer' }} />
                                    <label htmlFor="remember" style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>Remember me</label>
                                </div>
                                <button
                                    onClick={() => setMode('forgot-password')}
                                    style={{ ...styles.linkBtn, fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {loginError && (
                                <div style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: '#fef2f2',
                                    border: '1px solid #fee2e2',
                                    borderRadius: '8px',
                                    marginBottom: '1.5rem',
                                    color: '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    textAlign: 'left'
                                }}>
                                    <AlertCircle size={20} />
                                    <span>{loginError}</span>
                                </div>
                            )}

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
        </div >
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 2000,
        overflowY: 'auto',
        paddingTop: '3rem',
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
    roleCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '1.25rem',
        border: '1px solid #f8fafc',
        borderRadius: '16px',
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        width: '100%',
        '&:hover': {
            borderColor: '#e2e8f0',
            backgroundColor: '#f8fafc',
        }
    },
    roleIconCircle: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: '#f0f9ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1.25rem',
        flexShrink: 0,
        color: '#3b82f6',
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

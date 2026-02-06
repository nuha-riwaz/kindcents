import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // Fetch user document once (no real-time listener)
                    const userRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        const firestoreData = docSnap.data();
                        const isAdmin = currentUser.email.toLowerCase() === 'admin@kindcents.org';
                        setUser({
                            ...currentUser,
                            ...firestoreData,
                            role: firestoreData.role,
                            status: firestoreData.status,
                            name: isAdmin ? "Admin" : (firestoreData.name || currentUser.displayName),
                            photoURL: firestoreData.photoURL || currentUser.photoURL,
                            stats: firestoreData.stats || {}
                        });
                    } else {
                        // Create new user profile if missing
                        const newUserData = {
                            uid: currentUser.uid,
                            name: currentUser.displayName || "User",
                            email: currentUser.email,
                            signupDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            stats: {
                                totalDonated: 0,
                                campaignsSupported: 0,
                                livesImpacted: 0,
                                badges: 0
                            }
                        };
                        await setDoc(userRef, newUserData);
                        setUser({ ...currentUser, ...newUserData });
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setUser(currentUser); // Fallback to auth data
                }
                setLoading(false);
            } else {
                // Check for simulated user in localStorage
                const simulatedUser = localStorage.getItem('simulatedUser');
                if (simulatedUser) {
                    try {
                        setUser(JSON.parse(simulatedUser));
                    } catch (e) {
                        console.error('Error parsing simulated user:', e);
                        localStorage.removeItem('simulatedUser');
                    }
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        });
        return unsubscribe;
    }, []);

    const signup = async (email, password, fullName) => {
        // Validation check
        const validatePassword = (pass) => {
            const requirements = [
                pass.length >= 8,
                /[A-Z]/.test(pass),
                /[a-z]/.test(pass),
                /[0-9]/.test(pass)
            ];
            return requirements.every(Boolean);
        };

        if (!validatePassword(password)) {
            throw new Error("Password must be at least 8 characters long, and include an uppercase letter, a lowercase letter, and a number.");
        }

        try {
            // 1. Create User in Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Auth Profile
            await updateProfile(user, { displayName: fullName });

            // 3. Create Firestore Document Immediately (to avoid race conditions)
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                name: fullName,
                email: user.email,
                signupDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            });

            return user;
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    };

    const loginEmail = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    };

    const login = async (method, customName = null, userType = 'donor', email = null) => {
        if (method === "Google User") {
            try {
                const result = await signInWithPopup(auth, googleProvider);

                // Fetch user profile from Firestore to check for existing role
                const userDocRef = doc(db, 'users', result.user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // Return combined object so the caller knows the role immediately
                    return { ...result.user, ...userData };
                }

                return result.user;
            } catch (error) {
                console.error("Error signing in with Google", error);
                if (error.code === 'auth/configuration-not-found') {
                    alert("Login Failed: Google Sign-In is disabled in your Firebase Console.");
                } else if (error.code === 'auth/unauthorized-domain') {
                    alert("Login Failed: Unauthorized Domain.");
                } else if (error.code !== 'auth/popup-closed-by-user') {
                    alert(`Login Failed!\nError: ${error.message}`);
                }
                return null;
            }
        } else if (method === "Simulated") {
            // Keep simulated login for testing/admin backup
            const emailLower = email?.toLowerCase() || "";
            const isAdmin = emailLower === 'admin@kindcents.org' || customName === 'Admin';

            let uid = isAdmin ? "admin-999" : "simulated-123";
            if (emailLower === 'rashid.hsn@gmail.com') uid = "1";
            if (emailLower === 'admin@akshay.org') uid = "3";

            const mockUser = {
                uid: uid,
                name: isAdmin ? "Admin" : (customName || "User"),
                email: emailLower || (isAdmin ? "admin@kindcents.org" : "demo@kindcents.org"),
                photoURL: null,
                role: isAdmin ? 'admin' : userType,
                status: 'Verified'
            };

            // Store in localStorage for persistence across page reloads
            localStorage.setItem('simulatedUser', JSON.stringify(mockUser));
            setUser(mockUser);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('simulatedUser'); // Clear simulated user from localStorage
            setUser(null); // Explicitly clear for simulated cases
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const saveUserRole = async (role) => {
        const currentUser = user || auth.currentUser;
        if (!currentUser) {
            console.error("No user found to save role for");
            return;
        }
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(userRef, {
                role,
                status: role === 'donor' ? 'Verified' : 'Pending' // NGOs/Individuals need verification
            }, { merge: true });

            // Update local state
            setUser(prev => prev ? { ...prev, role, status: role === 'donor' ? 'Verified' : 'Pending' } : null);
        } catch (error) {
            console.error("Error saving user role:", error);
            throw error;
        }
    };

    const updateUserDocuments = async (uploadedFiles) => {
        const currentUser = user || auth.currentUser;
        if (!currentUser) return;
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(userRef, {
                uploadedFiles: uploadedFiles,
                documentsSubmittedAt: new Date(),
                status: 'Pending' // Reset status to pending for re-verification
            }, { merge: true });

            // Update local state
            setUser(prev => prev ? { ...prev, uploadedFiles, status: 'Pending' } : null);
        } catch (error) {
            console.error("Error updating user documents:", error);
            throw error;
        }
    };

    const updateUserProfile = async (updates) => {
        if (!user) return;
        try {
            // 1. Update Firestore
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, updates, { merge: true });

            // 2. Update Local State immediately
            setUser(prev => ({ ...prev, ...updates }));

            // 3. Keep Auth Profile in sync
            if (auth.currentUser) {
                const authUpdates = {};
                if (updates.name) authUpdates.displayName = updates.name;
                // Only update photoURL in Firebase Auth if it's a regular URL (not Base64)
                if (updates.photoURL && !updates.photoURL.startsWith('data:')) {
                    authUpdates.photoURL = updates.photoURL;
                }

                if (Object.keys(authUpdates).length > 0) {
                    await updateProfile(auth.currentUser, authUpdates);
                }
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signup');

    const openAuthModal = (mode) => {
        if (mode === 'signup') {
            setIsLocationModalOpen(true);
        } else {
            setAuthMode(mode);
            setIsAuthModalOpen(true);
        }
    };

    return (
        <AuthContext.Provider value={{
            user, login, logout, signup, loginEmail, saveUserRole, updateUserDocuments, updateUserProfile,
            isAuthModalOpen, setIsAuthModalOpen,
            isLocationModalOpen, setIsLocationModalOpen,
            authMode, setAuthMode, openAuthModal
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

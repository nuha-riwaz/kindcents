import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, googleProvider, db, storage } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkIsSimulated = (uid, email) => {
        // If they have a real Firebase UID, they are NOT simulated
        if (auth.currentUser && auth.currentUser.uid === uid) return false;

        const u = String(uid || '');
        const e = String(email || '').toLowerCase();
        return u.startsWith('simulated-') ||
            u.startsWith('admin-') ||
            u === '1' || u === '2' || u === '3';
    };

    const getLocalUserKey = (uid) => `simulatedUser_${uid}`;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                let finalUser = { ...currentUser };

                // 1. Try to get Firestore data
                try {
                    const userRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        const firestoreData = docSnap.data();
                        const isAdmin = currentUser.email?.toLowerCase() === 'admin@kindcents.org';
                        finalUser = {
                            ...finalUser,
                            ...firestoreData,
                            role: firestoreData.role,
                            status: firestoreData.status,
                            name: isAdmin ? "Admin" : (firestoreData.name || currentUser.displayName),
                            photoURL: firestoreData.photoURL || currentUser.photoURL,
                            stats: firestoreData.stats || {}
                        };
                    } else {
                        // Create skeleton if missing
                        try {
                            const newUserData = {
                                uid: currentUser.uid,
                                name: currentUser.displayName || "User",
                                email: currentUser.email,
                                signupDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                stats: { totalDonated: 0, campaignsSupported: 0, livesImpacted: 0, badges: 0 }
                            };
                            await setDoc(userRef, newUserData);
                            finalUser = { ...finalUser, ...newUserData };
                        } catch (e) {
                            console.warn("Could not create Firestore doc, using Auth fallback:", e);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching Firestore profile:", error);
                }

                // 2. ALWAYS merge local storage data as a fast cache/source of truth for the local machine
                try {
                    // Try basic profile first (Name, Role, etc)
                    const basicData = localStorage.getItem(`profile_basic_${currentUser.uid}`);
                    if (basicData) {
                        const parsedBasic = JSON.parse(basicData);
                        finalUser = { ...finalUser, ...parsedBasic };
                        console.log("AuthContext: Merged basic local data for:", currentUser.uid);
                    }

                    // Then photo (Large data)
                    const photoData = localStorage.getItem(`profile_photo_${currentUser.uid}`);
                    if (photoData) {
                        finalUser.photoURL = photoData;
                        console.log("AuthContext: Merged photo local data for:", currentUser.uid);
                    }

                    // Fallback to old key for backward compatibility
                    const legacyData = localStorage.getItem(getLocalUserKey(currentUser.uid));
                    if (legacyData && !basicData) {
                        const parsedLegacy = JSON.parse(legacyData);
                        finalUser = { ...finalUser, ...parsedLegacy };
                    }
                } catch (e) {
                    console.error("Error parsing local user data fallback:", e);
                }

                setUser(finalUser);
                setLoading(false);
            } else {
                // Check for simulated user in localStorage (Legacy check for non-auth users)
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
            const isAkshay = emailLower === 'admin@akshay.org';
            const isAdmin = emailLower === 'admin@kindcents.org' || customName === 'Admin';

            let uid = isAdmin ? "admin-999" : (emailLower ? `sim-${emailLower.replace(/[^a-z0-9]/g, '')}` : "simulated-123");
            if (emailLower === 'rashid.hsn@gmail.com') uid = "1";
            if (isAkshay) uid = "3";

            // Default mock data
            let mockUser = {
                uid: uid,
                name: isAdmin ? "Admin" : (customName || "User"),
                email: emailLower || (isAdmin ? "admin@kindcents.org" : "demo@kindcents.org"),
                photoURL: null,
                role: isAdmin ? 'admin' : userType,
                status: 'Verified'
            };

            // Load existing partitioned data for this UID before overwriting with defaults
            try {
                // PARTITION 1: Basic Profile
                const basicData = localStorage.getItem(`profile_basic_${uid}`);
                if (basicData) {
                    const parsedBasic = JSON.parse(basicData);
                    mockUser = { ...mockUser, ...parsedBasic };
                }

                // PARTITION 2: Photo
                const photoData = localStorage.getItem(`profile_photo_${uid}`);
                if (photoData) {
                    mockUser.photoURL = photoData;
                }

                // Legacy fallback
                const legacyData = localStorage.getItem(getLocalUserKey(uid));
                if (legacyData && !basicData) {
                    const parsedLocal = JSON.parse(legacyData);
                    mockUser = { ...mockUser, ...parsedLocal };
                }
            } catch (e) {
                console.error("Error loading existing simulated user data:", e);
            }

            // Store in localStorage for persistence across page reloads
            try {
                localStorage.setItem('simulatedUser', JSON.stringify(mockUser));
                localStorage.setItem(getLocalUserKey(uid), JSON.stringify(mockUser));
            } catch (e) {
                console.warn("Storage full, could not save simulation:", e);
            }
            setUser(mockUser);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('simulatedUser');
            setUser(null);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error("Error sending password reset email", error);
            throw error;
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
                status: role === 'donor' ? 'Verified' : 'Pending'
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
            // Upload Base64 files to Storage first
            const updatedFiles = { ...uploadedFiles };

            for (const [key, fileData] of Object.entries(updatedFiles)) {
                // Check if fileData has a url that is a base64 string
                if (fileData && fileData.url && fileData.url.startsWith('data:')) {
                    const storagePath = `user_docs/${currentUser.uid}/${key}_${Date.now()}`;
                    const storageRef = ref(storage, storagePath);

                    // Upload base64 string
                    await uploadString(storageRef, fileData.url, 'data_url');

                    // Get download URL
                    const downloadURL = await getDownloadURL(storageRef);

                    // Replace base64 with storage URL
                    updatedFiles[key] = {
                        ...fileData,
                        url: downloadURL
                    };
                }
            }

            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(userRef, {
                uploadedFiles: updatedFiles,
                documentsSubmittedAt: new Date(),
                status: 'Pending'
            }, { merge: true });

            // Update local state
            setUser(prev => prev ? { ...prev, uploadedFiles: updatedFiles, status: 'Pending' } : null);
        } catch (error) {
            console.error("Error updating user documents:", error);
            throw error;
        }
    };

    const updateUserProfile = async (updates) => {
        if (!user) return;

        console.log("AuthContext: updateUserProfile optimistic start:", updates);

        // 1. Update Local State immediately (UX First)
        const optimisticUser = { ...user, ...updates };
        setUser(prev => prev ? { ...prev, ...updates } : null);

        // 2. Update localStorage immediately (Machine Persistence)
        try {
            // PARTITION 1: Small Basic Data (Always saves)
            const basicData = { ...optimisticUser };
            delete basicData.photoURL; // Don't store large photo in the basic key
            localStorage.setItem(`profile_basic_${user.uid}`, JSON.stringify(basicData));
            localStorage.setItem(getLocalUserKey(user.uid), JSON.stringify(basicData));

            // PARTITION 2: Large Photo Data (Optional/Heavy)
            if (updates.photoURL) {
                try {
                    localStorage.setItem(`profile_photo_${user.uid}`, updates.photoURL);
                } catch (photoError) {
                    console.warn("AuthContext: Photo too large for localStorage cache.", photoError);
                }
            }

            const isSimulated = checkIsSimulated(user.uid, user.email);
            if (isSimulated) {
                localStorage.setItem('simulatedUser', JSON.stringify(basicData));
            }
        } catch (e) {
            console.warn("AuthContext: Primary storage failed:", e);
        }

        // 3. RUN BACKGROUND PERSISTENCE (Non-blocking)
        (async () => {
            try {
                const finalUpdates = { ...updates };

                // Handle Image Upload if needed
                if (updates.photoURL && String(updates.photoURL).startsWith('data:')) {
                    if (auth.currentUser) {
                        try {
                            const storagePath = `profile_pictures/${user.uid}_${Date.now()}`;
                            const storageRef = ref(storage, storagePath);
                            await uploadString(storageRef, updates.photoURL, 'data_url');
                            const downloadURL = await getDownloadURL(storageRef);
                            finalUpdates.photoURL = downloadURL;

                            // Re-sync local state with final URL
                            setUser(prev => prev ? { ...prev, photoURL: downloadURL } : null);
                            localStorage.setItem(`profile_photo_${user.uid}`, downloadURL);
                            console.log("AuthContext: Storage URL cached locally.");
                        } catch (storageErr) {
                            console.error("Storage background failed:", storageErr);
                        }
                    }
                }

                // Firestore Persist
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, finalUpdates, { merge: true });

                // Auth Profile Sync
                if (auth.currentUser && !checkIsSimulated(user.uid, user.email)) {
                    const authUpdates = {};
                    if (finalUpdates.name) authUpdates.displayName = finalUpdates.name;
                    if (finalUpdates.photoURL && !finalUpdates.photoURL.startsWith('data:')) {
                        authUpdates.photoURL = finalUpdates.photoURL;
                    }
                    if (Object.keys(authUpdates).length > 0) {
                        await updateProfile(auth.currentUser, authUpdates);
                    }
                }
                console.log("AuthContext: Background persistence completed.");
            } catch (bgError) {
                console.error("AuthContext: Background persistence failed:", bgError);
            }
        })();
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
            user, login, logout, signup, loginEmail, saveUserRole, updateUserDocuments, updateUserProfile, resetPassword,
            isAuthModalOpen, setIsAuthModalOpen,
            isLocationModalOpen, setIsLocationModalOpen,
            authMode, setAuthMode, openAuthModal
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

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
                        setUser({
                            ...currentUser,
                            ...firestoreData,
                            role: firestoreData.role,
                            status: firestoreData.status,
                            name: firestoreData.name || currentUser.displayName,
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
                setUser(null);
                setLoading(false);
            }
        });
        return unsubscribe;
    }, []);

    const signup = async (email, password, fullName) => {
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
            const isAdmin = email === 'admin@kindcents.org' || customName === 'Admin';
            const mockUser = {
                uid: isAdmin ? "admin-999" : "simulated-123",
                name: customName || (isAdmin ? "Admin Control" : "User"),
                email: email || (isAdmin ? "admin@kindcents.org" : "demo@kindcents.org"),
                photoURL: null,
                role: isAdmin ? 'admin' : userType,
                status: 'Verified'
            };
            setUser(mockUser);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null); // Explicitly clear for simulated cases
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const saveUserRole = async (role) => {
        if (!user) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                role,
                status: role === 'donor' ? 'Verified' : 'Pending' // NGOs/Individuals need verification
            }, { merge: true });

            // Update local state
            setUser(prev => ({ ...prev, role, status: role === 'donor' ? 'Verified' : 'Pending' }));
        } catch (error) {
            console.error("Error saving user role:", error);
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

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loginEmail, saveUserRole, updateUserProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

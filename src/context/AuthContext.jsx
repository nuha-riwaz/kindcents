import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // Check if user exists in Firestore
                    const userRef = doc(db, 'users', currentUser.uid);
                    const userSnap = await getDoc(userRef);

                    let firestoreData = {};

                    if (userSnap.exists()) {
                        firestoreData = userSnap.data();
                    } else {
                        // Create new user profile in Firestore
                        // NOTE: We do NOT assign a default role here.
                        // This allows us to detect new users and redirect them to Onboarding.
                        firestoreData = {
                            uid: currentUser.uid,
                            name: currentUser.displayName || "User",
                            email: currentUser.email,
                            // role: undefined, // Intentionally undefined
                            // status: undefined, // Intentionally undefined
                            signupDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        };
                        await setDoc(userRef, firestoreData);
                    }

                    // Merge Auth and Firestore data
                    setUser({
                        ...currentUser,
                        ...firestoreData,
                        // Ensure critical fields are accessible at top level
                        role: firestoreData.role,
                        status: firestoreData.status,
                        name: firestoreData.name || currentUser.displayName,
                        photoURL: currentUser.photoURL
                    });
                } catch (error) {
                    console.error("Error syncing user profile:", error);
                    // Fallback to basic auth user
                    setUser(currentUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async (method, customName = null, userType = 'donor', email = null) => {
        if (method === "Google User") {
            try {
                await signInWithPopup(auth, googleProvider);
            } catch (error) {
                console.error("Error signing in with Google", error);
                if (error.code === 'auth/configuration-not-found') {
                    alert("Login Failed: Google Sign-In is disabled in your Firebase Console.");
                } else if (error.code === 'auth/unauthorized-domain') {
                    alert("Login Failed: Unauthorized Domain.");
                } else if (error.code !== 'auth/popup-closed-by-user') {
                    alert(`Login Failed!\nError: ${error.message}`);
                }
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

    return (
        <AuthContext.Provider value={{ user, login, logout, saveUserRole }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

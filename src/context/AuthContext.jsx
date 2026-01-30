import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // User is signed in
                setUser({
                    name: currentUser.displayName,
                    email: currentUser.email,
                    photoURL: currentUser.photoURL,
                    uid: currentUser.uid
                });
            } else {
                // User is signed out
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async (method, customName = null, userType = 'donor') => {
        if (method === "Google User") {
            try {
                await signInWithPopup(auth, googleProvider);
            } catch (error) {
                console.error("Error signing in with Google", error);

                if (error.code === 'auth/configuration-not-found') {
                    alert("Login Failed: Google Sign-In is disabled in your Firebase Console.\n\nPlease go to Firebase Console > Authentication > Sign-in method, and enable 'Google'.");
                }
                else if (error.code === 'auth/unauthorized-domain') {
                    alert("Login Failed: Unauthorized Domain.\n\nPlease go to Firebase Console > Authentication > Settings > Authorized Domains, and add 'localhost'.");
                }
                else if (error.code === 'auth/popup-closed-by-user') {
                    console.log("Popup closed by user");
                }
                else {
                    alert(`Login Failed!\nError: ${error.message}\nCode: ${error.code}`);
                }
            }
        } else if (method === "Simulated") {
            setUser({
                name: customName || "User",
                email: "demo@kindcents.org",
                photoURL: null,
                uid: "simulated-123",
                userType: userType // 'donor', 'nonprofit', or 'individual'
            });
        } else {
            alert("For this demo, please use 'Sign up with Google'. Email login is not yet connected to a backend.");
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

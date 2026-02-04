import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc
} from 'firebase/firestore';

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
    const [campaigns, setCampaigns] = useState({});
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to Campaigns Collection
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
            const campaignData = {};
            snapshot.forEach((doc) => {
                campaignData[doc.id] = { ...doc.data(), id: doc.id };
            });
            setCampaigns(campaignData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching campaigns:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Subscribe to Users Collection (For Admin Dashboard)
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const userList = [];
            snapshot.forEach((doc) => {
                userList.push({ ...doc.data(), id: doc.id });
            });
            setUsers(userList);
        }, (error) => {
            console.error("Error fetching users:", error);
        });

        return () => unsubscribe();
    }, []);

    const addCampaign = async (campaign) => {
        try {
            // If campaign has a specific ID (like 'akshay-society'), use setDoc
            // Otherwise use addDoc for auto-generated ID
            if (campaign.id && campaign.id.length > 5 && isNaN(campaign.id)) {
                await setDoc(doc(db, 'campaigns', campaign.id), campaign);
            } else {
                const newDocRef = await addDoc(collection(db, 'campaigns'), campaign);
                // Optionally update the doc with its own ID if needed, but we separate id in state
            }
        } catch (error) {
            console.error("Error adding campaign:", error);
            throw error;
        }
    };

    const updateCampaign = async (id, updatedData) => {
        try {
            const campaignRef = doc(db, 'campaigns', id);
            await updateDoc(campaignRef, updatedData);
        } catch (error) {
            console.error("Error updating campaign:", error);
            throw error;
        }
    };

    const deleteCampaign = async (id) => {
        try {
            await deleteDoc(doc(db, 'campaigns', id));
        } catch (error) {
            console.error("Error deleting campaign:", error);
            throw error;
        }
    };

    const updateUserStatus = async (userId, status) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { status });
        } catch (error) {
            console.error("Error updating user status:", error);
            throw error;
        }
    };

    const donateToCampaign = async (campaignId, amount, userId = 'anonymous') => {
        try {
            const campaignRef = doc(db, 'campaigns', campaignId);

            // 1. Add donation record
            await addDoc(collection(db, 'donations'), {
                campaignId,
                userId,
                amount,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                timestamp: new Date()
            });

            // 2. Update campaign stats atomically
            await updateDoc(campaignRef, {
                raised: increment(amount),
                contributors: increment(1)
            });

        } catch (error) {
            console.error("Error processing donation:", error);
            throw error;
        }
    };

    return (
        <CampaignContext.Provider value={{
            campaigns: Object.values(campaigns),
            campaignStore: campaigns || {},
            users: users || [],
            loading,
            addCampaign,
            updateCampaign,
            deleteCampaign,
            updateUserStatus,
            donateToCampaign
        }}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaigns = () => useContext(CampaignContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    getDoc,
    increment
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


    // Manual function to mark completed campaigns (can be called from console)
    const markCompletedCampaigns = async () => {
        console.log('🔍 Manually checking campaigns for completion...');

        for (const campaign of Object.values(campaigns)) { // Iterate over values as campaigns is an object
            const raised = campaign.raised || 0;
            const goal = campaign.goal || 0;

            console.log(`Checking "${campaign.title}": ${raised}/${goal}, status: ${campaign.status}`);

            if (raised >= goal && goal > 0 && campaign.status !== 'completed') {
                try {
                    console.log(`🎉 Marking "${campaign.title}" as completed`);
                    const campaignRef = doc(db, 'campaigns', campaign.id);
                    await updateDoc(campaignRef, {
                        status: 'completed',
                        completedAt: new Date()
                    });
                    console.log(`✅ Successfully marked "${campaign.title}" as completed`);
                } catch (error) {
                    console.error(`❌ Error:`, error);
                }
            }
        }
    };

    // Expose function to window for manual calling
    useEffect(() => {
        window.markCompletedCampaigns = markCompletedCampaigns;
        console.log('✅ markCompletedCampaigns() function is available in console');
    }, [campaigns]); // Dependency on campaigns to ensure it uses the latest state

    // Auto-check for completed campaigns on mount (with delay to ensure campaigns are loaded)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (Object.values(campaigns).length > 0) { // Check length of values
                console.log('🔍 Auto-checking campaigns for completion...');
                markCompletedCampaigns();
            }
        }, 2000); // Wait 2 seconds for campaigns to load

        return () => clearTimeout(timer);
    }, [campaigns]); // Run when campaigns state changes, but with a delay

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

            // Fetch campaign details to get the title and goal
            const campaignSnap = await getDoc(campaignRef);
            const campaignData = campaignSnap.exists() ? campaignSnap.data() : {};

            // 1. Add donation record with all required fields
            await addDoc(collection(db, 'donations'), {
                campaignId,
                userId,
                amount,
                campaignTitle: campaignData.title || 'Campaign', // For Recent Donations display
                status: 'Pending', // Pending until admin approves
                createdAt: new Date(), // For sorting in Recent Donations
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                timestamp: new Date()
            });

            // 2. Update campaign stats atomically
            await updateDoc(campaignRef, {
                raised: increment(amount),
                contributors: increment(1)
            });

            // 3. Check if campaign has reached its goal and mark as completed
            const updatedCampaignSnap = await getDoc(campaignRef);
            if (updatedCampaignSnap.exists()) {
                const updatedData = updatedCampaignSnap.data();
                const updatedRaised = updatedData.raised || 0;
                const goal = updatedData.goal || 0;

                // If goal is reached and not already completed, mark as completed
                if (updatedRaised >= goal && updatedData.status !== 'completed') {
                    await updateDoc(campaignRef, {
                        status: 'completed',
                        completedAt: new Date()
                    });
                    console.log(`🎉 Campaign ${campaignId} has been completed!`);
                }
            }

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

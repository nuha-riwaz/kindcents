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
    const [donations, setDonations] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to Expenses Collection
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'expenses'), (snapshot) => {
            const expenseList = [];
            snapshot.forEach((doc) => {
                expenseList.push({ ...doc.data(), id: doc.id });
            });
            setExpenses(expenseList);
        }, (error) => {
            console.error("Error fetching expenses:", error);
        });

        return () => unsubscribe();
    }, []);

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

    // Subscribe to Donations Collection
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'donations'), (snapshot) => {
            const donationList = [];
            snapshot.forEach((doc) => {
                donationList.push({ ...doc.data(), id: doc.id });
            });
            setDonations(donationList);
        }, (error) => {
            console.error("Error fetching donations:", error);
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

    const donateToCampaign = async (campaignId, amount, userId = 'anonymous', details = {}) => {
        try {
            const campaignRef = doc(db, 'campaigns', campaignId);

            // Fetch campaign details to get the title and goal
            const campaignSnap = await getDoc(campaignRef);
            const campaignData = campaignSnap.exists() ? campaignSnap.data() : {};

            // 1. Add donation record with 'Pending' status
            await addDoc(collection(db, 'donations'), {
                campaignId,
                userId,
                amount,
                cardName: details.cardName || 'Anonymous',
                email: details.email || 'N/A',
                campaignTitle: campaignData.title || 'Campaign',
                status: 'Pending',
                createdAt: new Date(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                timestamp: new Date()
            });

            // Note: Stats (raised, contributors) are NOT updated here.
            // They will be updated in approveDonation()

        } catch (error) {
            console.error("Error in donation:", error);
            throw error;
        }
    };

    const approveDonation = async (donationId) => {
        try {
            const donationRef = doc(db, 'donations', donationId);
            const donationSnap = await getDoc(donationRef);
            if (!donationSnap.exists()) return;

            const donationData = donationSnap.data();
            const { campaignId, amount } = donationData;

            // 1. Mark donation as Completed
            await updateDoc(donationRef, {
                status: 'Completed',
                approvedAt: new Date()
            });

            // 2. Update campaign stats atomically
            const campaignRef = doc(db, 'campaigns', campaignId);
            await updateDoc(campaignRef, {
                raised: increment(amount),
                contributors: increment(1)
            });

            // 3. Check for campaign completion
            const campaignSnap = await getDoc(campaignRef);
            if (campaignSnap.exists()) {
                const data = campaignSnap.data();
                if ((data.raised || 0) >= (data.goal || 0) && data.status !== 'completed') {
                    await updateDoc(campaignRef, {
                        status: 'completed',
                        completedAt: new Date()
                    });
                }
            }
        } catch (error) {
            console.error("Error approving donation:", error);
            throw error;
        }
    };

    const rejectDonation = async (donationId) => {
        try {
            await updateDoc(doc(db, 'donations', donationId), {
                status: 'Rejected'
            });
        } catch (error) {
            console.error("Error rejecting donation:", error);
            throw error;
        }
    };

    const deleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, 'users', userId));
            // Update local state
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    };

    const addExpense = async (expenseData) => {
        try {
            await addDoc(collection(db, 'expenses'), {
                ...expenseData,
                createdAt: new Date(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            });
        } catch (error) {
            console.error("Error adding expense:", error);
            throw error;
        }
    };

    const deleteExpense = async (expenseId) => {
        try {
            await deleteDoc(doc(db, 'expenses', expenseId));
        } catch (error) {
            console.error("Error deleting expense:", error);
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
            donateToCampaign,
            approveDonation,
            rejectDonation,
            deleteUser, // Export the new function
            donations,
            pendingDonations: donations.filter(d => d.status === 'Pending'),
            expenses,
            addExpense,
            deleteExpense
        }}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaigns = () => useContext(CampaignContext);

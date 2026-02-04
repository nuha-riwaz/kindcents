// One-time utility script to mark already-completed campaigns
// Run this once to update campaigns that reached their goal before the completion logic was added

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDCVq-Kp_dQPHxJQPkYMKHKDQBNxMEHxJo",
    authDomain: "kindcents-1.firebaseapp.com",
    projectId: "kindcents-1",
    storageBucket: "kindcents-1.firebasestorage.app",
    messagingSenderId: "1018757733527",
    appId: "1:1018757733527:web:3c3e8e8c7e9c0e8e8e8e8e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function markCompletedCampaigns() {
    try {
        console.log('🔍 Checking for campaigns that have reached their goal...');

        const campaignsRef = collection(db, 'campaigns');
        const snapshot = await getDocs(campaignsRef);

        let updatedCount = 0;

        for (const docSnap of snapshot.docs) {
            const campaign = docSnap.data();
            const raised = campaign.raised || 0;
            const goal = campaign.goal || 0;

            // Check if campaign has reached goal but not marked as completed
            if (raised >= goal && campaign.status !== 'completed') {
                console.log(`✅ Marking "${campaign.title}" as completed (${raised}/${goal})`);

                await updateDoc(doc(db, 'campaigns', docSnap.id), {
                    status: 'completed',
                    completedAt: new Date()
                });

                updatedCount++;
            }
        }

        console.log(`\n🎉 Done! Updated ${updatedCount} campaign(s) to completed status.`);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

markCompletedCampaigns();

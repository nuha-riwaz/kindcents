
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Minimal firebase config to check data
const firebaseConfig = {
    projectId: "kindcents",
    // These aren't sensitive for a read-only check or might not be needed if using emulator/admin context,
    // but here we are in a local environment.
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkCampaigns() {
    console.log("Checking campaigns collection...");
    try {
        const querySnapshot = await getDocs(collection(db, 'campaigns'));
        console.log(`Found ${querySnapshot.size} campaigns.`);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`- ID: ${doc.id}, Title: ${data.title}, Type: ${data.type}, IsActive: ${data.isActive}`);
        });
    } catch (error) {
        console.error("Error fetching campaigns:", error);
    }
}

checkCampaigns();

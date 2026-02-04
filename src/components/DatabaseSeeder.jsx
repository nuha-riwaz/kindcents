import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import projectEmma from '../assets/project-emma.jpg';
import projectArklow from '../assets/project-arklow.png';

const DatabaseSeeder = () => {
    const [status, setStatus] = useState('Idle');
    const [log, setLog] = useState([]);

    const campaigns = {
        "1": {
            id: "1",
            type: "campaign",
            title: "Help Ayaan's Surgery",
            // Note: We can't upload local images to Firestore directly. 
            // We'll store the path string for now, or use a placeholder URL if we were using Storage.
            // For this app's current stage, let's keep the image import logic in the frontend 
            // by storing a recognizable string ID for the image, or just keeping the import in the component.
            // However, to make it fully dynamic, we usually upload images to Firebase Storage.
            // For now, let's store a string that the frontend can map back to an import or a fixed URL.
            // We'll use the variable name as a string for now.
            image: "projectEmma",
            raised: 450000,
            goal: 1000000,
            contributors: 34,
            rating: 4,
            date: "Jan 25, 2026",
            daysLeft: 9,
            category: "Medical",
            isActive: true,
            isCompleted: false,
            about: [
                "Ayaan, a bright 3 year old boy from Welimada, was diagnosed with a congenital heart defect (Ventricular Septal Defect) that requires immediate surgical intervention. Without this life-saving surgery, his condition will continue to deteriorate.",
                "Ayaan's father works as a daily-wage laborer, and the family cannot afford the Rs. 1,000,000 needed for the surgery at Goodwill Hospital, Welimada. The surgical team has confirmed that with timely intervention, Ayaan can lead a completely normal life.",
                "The funds will be transferred directly to Hospital's account to ensure complete transparency. Every rupee donated goes toward saving Ayaan's life."
            ],
            verification: [
                { title: "Identity Verified", desc: "Government-issued ID verified by KYC process.", date: "Verified on Dec 10, 2025" },
                { title: "Medical Documents", desc: "Hospital admission records and diagnosis verified.", date: "Verified on Dec 12, 2025" },
                { title: "Hospital Verification", desc: "State Hospitals confirmed treatment plan and costs.", date: "Verified on Dec 12, 2025" },
                { title: "Bank Account Verified", desc: "Direct hospital account linked for fund disbursement.", date: "Verified on Dec 11, 2025" }
            ],
            organizer: { initials: "RS", name: "Mr. Rashid Hassan", sub: "Father of Ayaan", tag: "Verified Identity" },
            hospital: { name: "Base Hospital Welimada", sub: "Welimada", tag: "Hospital Verified" }
        },
        "2": {
            id: "2",
            type: "campaign",
            title: "Orphan Care Essentials",
            image: "projectArklow",
            raised: 50000,
            goal: 70000,
            contributors: 21,
            rating: 3,
            date: "Jan 31, 2026",
            daysLeft: 15,
            category: "Social",
            isActive: true,
            isCompleted: false,
            about: [
                "This campaign aims to provide essential care items for orphaned children who rely entirely on donations for their daily needs. The funds raised will be used to supply food essentials, hygiene kits, clothing, and basic educational materials, ensuring these children live with dignity, safety, and comfort.",
                "Many orphan care centers operate with limited resources, making it difficult to consistently meet the children's basic needs. Your support helps bridge this gap and brings stability and care to their everyday lives.",
                "All donations will be used strictly for verified essentials, and funds will be disbursed directly to the orphan care center to maintain full transparency. Every contribution, big or small, helps improve a child's quality of life."
            ],
            verification: [
                { title: "Organization Identity Verified", desc: "The orphanage is verified with official documents.", date: "Verified on Jan 15, 2026" },
                { title: "Program Details Verified", desc: "The care plan and item list are confirmed.", date: "Verified on Jan 17, 2026" },
                { title: "Center Verification", desc: "The center confirmed the children and their needs.", date: "Verified on Jan 17, 2026" },
                { title: "Bank Account Verified", desc: "The orphanage account is linked for secure transfers.", date: "Verified on Jan 18, 2026" }
            ],
            organizer: { initials: "SO", name: "Sunshine Orphanage", sub: "Children's Care", tag: "Verified Identity" },
            hospital: { name: "Happy Hearts Orphanage", sub: "Gampola", tag: "Center Verified", isCenter: true }
        },
        "3": {
            id: "3",
            type: "campaign",
            title: "Medical Equipment for Rural Hospital",
            image: "projectEmma",
            raised: 190000,
            goal: 200000,
            contributors: 52,
            rating: 4,
            date: "Feb 6, 2026",
            daysLeft: 21,
            category: "Medical",
            isActive: true,
            isCompleted: false,
            about: [
                "This campaign aims to provide critical medical equipment to a rural hospital struggling with limited resources. Funds will be used to purchase items like monitors, oxygen concentrators, and essential diagnostic tools to improve patient care.",
                "Many rural hospitals lack proper equipment, which delays treatment and puts lives at risk. Your support will help ensure timely and quality medical care for the local community.",
                "All donations will be sent directly to the hospital's verified account to maintain full transparency. Every contribution helps save lives and improve healthcare access in rural areas."
            ],
            verification: [
                { title: "Organization Verified", desc: "The NGO/organizer is verified with official documents.", date: "Verified on Jan 20, 2026" },
                { title: "Program Details Verified", desc: "Equipment needs and purchase plan are confirmed.", date: "Verified on Jan 17, 2026" },
                { title: "Center Verification", desc: "Hospital confirmed equipment and beneficiaries.", date: "Verified on Jan 17, 2026" },
                { title: "Bank Account Verified", desc: "The hospital account is linked for secure transfers.", date: "Verified on Jan 18, 2026" }
            ],
            organizer: { initials: "RF", name: "Rural Health Foundation", sub: "Healthcare Support", tag: "Verified Identity" },
            hospital: { name: "Rural General Hospital", sub: "Trincomalee", tag: "Hospital Verified" }
        },
        "4": {
            id: "4",
            type: "campaign",
            title: "Temple renovation in Panagama",
            image: "projectArklow",
            raised: 20000,
            goal: 50000,
            contributors: 18,
            rating: 4,
            date: "Feb 22, 2026",
            daysLeft: 37,
            category: "Social",
            isActive: true,
            isCompleted: false,
            about: [
                "This campaign aims to renovate and maintain the Panagama Temple, preserving it as a safe and welcoming place for the community.",
                "Funds will be used for repairs, painting, structural maintenance, and basic amenities, ensuring the temple remains functional and beautiful for visitors and worshippers.",
                "All donations will be directly transferred to the temple's verified account to maintain full transparency, so every contribution supports the community."
            ],
            verification: [
                { title: "Organization Verified", desc: "Temple committee is verified with official documents.", date: "Verified on Feb 10, 2026" },
                { title: "Program Details Verified", desc: "Renovation plan and budget confirmed.", date: "Verified on Feb 12, 2026" },
                { title: "Bank Account Verified", desc: "The temple account is linked for secure transfers.", date: "Verified on Jan 18, 2026" }
            ],
            organizer: { initials: "PC", name: "Panagama Temple Committee", sub: "Community Care", tag: "Verified Identity" },
            hospital: { name: "Panagama Temple", sub: "Panagama", tag: "Temple Verified", isCenter: true }
        },
        "akshay-society": {
            id: "akshay-society",
            type: "ngo",
            title: "Akshay Society",
            image: "projectEmma",
            raised: 1820000,
            goal: 5000000,
            contributors: 173,
            rating: 4,
            date: "Verified NGO",
            isActive: true,
            isCompleted: false,
            about: [
                "Established in 2021, Akshay Society for Health, Education & Rural Development works to improve healthcare access, education quality, and living conditions in underserved rural communities across Sri Lanka.",
                "The organization focuses on community health programs, school-based education initiatives, medical outreach camps, and rural development projects aimed at long-term impact. To date, Akshay Society has conducted over 60 free medical camps, benefiting more than 15,000 individuals, and supported educational resources for 3,500+ rural students.",
                "All funds are tracked through transparent accounting practices, with 100% of donations directed toward verified project activities. Support through this platform enables the organization to expand its reach to new rural districts and strengthen existing programs."
            ],
            verification: [
                { title: "Statutory Compliance", desc: "Legal registration and regulatory compliance verified.", date: "Verified on Jan 5, 2026" },
                { title: "Performance Audit", desc: "Independent audits and project outcomes reviewed.", date: "Verified on Jan 8, 2026" },
                { title: "Financial Transparency", desc: "Transparent fund tracking with verified utilization.", date: "Verified on Jan 10, 2026" },
                { title: "Community Impact Verified", desc: "15,000+ beneficiaries served through health and education programs confirmed.", date: "Verified on Jan 12, 2026" },
                { title: "Reports", desc: "Medical, education, and rural development reports documented.", date: "Verified on Jan 12, 2026" }
            ],
            organizer: { initials: "AS", name: "Akshay Society", sub: "Health & Education", tag: "Verified NGO" },
            fundUtilization: [
                { title: "Medical Camps", amount: 850000, desc: "Organized 12 free medical camps in rural districts providing checkups and medicine.", date: "Jan 2026" },
                { title: "Educational Support", amount: 620000, desc: "Provided books, bags, and uniforms to 850 students in remote schools.", date: "Dec 2025" },
                { title: "Rural Infrastructure", amount: 350000, desc: "Repaired 3 clean water wells in drought-affected villages.", date: "Nov 2025" }
            ],
            updates: [
                { title: "New Medical Camp Success", date: "Feb 2, 2026", content: "Successfully treated over 450 patients in our latest camp in Monaragala." },
                { title: "Scholarship Program Launch", date: "Jan 20, 2026", content: "Launched 'Rural Scholars' program to support 50 high-performing students." }
            ]
        },
        "keithston-foundation": {
            id: "keithston-foundation",
            type: "ngo",
            title: "Keithston Foundation",
            image: "projectArklow",
            raised: 2100000,
            goal: 6000000,
            contributors: 215,
            rating: 5,
            date: "Verified NGO",
            isActive: true,
            isCompleted: false,
            about: [
                "Keithston Foundation is dedicated to environmental conservation and sustainable living practices. We work with local communities to restore ecosystems and promote green energy.",
                "Our primary focus is on reforestation, waste management education, and solar energy adoption in rural villages. We have planted over 50,000 trees and helped 20 villages switch to solar street lighting.",
                "Transparency is our core value. All donations are utilized for project implementation with regular audits and community feedback sessions."
            ],
            verification: [
                { title: "Environmental Clearance", desc: "Projects approved by local environmental authorities.", date: "Verified on Feb 1, 2026" },
                { title: "Financial Audit", desc: "Annual accounts audited by certified external auditors.", date: "Verified on Jan 25, 2026" },
                { title: "Project Site Verified", desc: "Physical inspection of reforestation sites completed.", date: "Verified on Jan 20, 2026" }
            ],
            organizer: { initials: "KF", name: "Keithston Foundation", sub: "Environment & Sustainability", tag: "Verified NGO" },
            fundUtilization: [
                { title: "Reforestation Project", amount: 1200000, desc: "Planted 15,000 saplings in deforested zones of Sinharaja buffer zone.", date: "Jan 2026" },
                { title: "Solar Street Lights", amount: 800000, desc: "Installed 45 solar street lights in 3 off-grid villages.", date: "Dec 2025" },
                { title: "Waste Management Workshop", amount: 100000, desc: "Conducted workshops for 500 households on waste segregation.", date: "Nov 2025" }
            ],
            updates: [
                { title: "50,000 Trees Milestone", date: "Jan 30, 2026", content: "We crossed the milestone of planting 50,000 trees across the island!" },
                { title: "Solar Village Project", date: "Jan 15, 2026", content: "Completed solar lighting installation in Kalawana village." }
            ]
        },
        "smile-foundation": {
            id: "smile-foundation",
            type: "ngo",
            title: "Smile Foundation",
            image: "projectEmma",
            raised: 3500000,
            goal: 8000000,
            contributors: 420,
            rating: 5,
            date: "Verified NGO",
            isActive: true,
            isCompleted: false,
            about: [
                "Smile Foundation works to empower women and children through vocational training, healthcare, and legal aid support. We believe in creating self-reliant communities.",
                "Our programs include sewing and handicraft workshops for women, after-school tuition for children, and mobile health clinics for maternal care. We have empowered over 2,000 women to start their own small businesses.",
                "Every donation creates a direct impact. We track beneficiary progress and ensure funds are improving livelihoods effectively."
            ],
            verification: [
                { title: "Social Service Registration", desc: "Registered with the Ministry of Social Services.", date: "Verified on Feb 5, 2026" },
                { title: "Beneficiary Verification", desc: "Random checks on reported beneficiaries conducted.", date: "Verified on Jan 28, 2026" },
                { title: "Legal Compliance", desc: "All operational licenses and permits are up to date.", date: "Verified on Jan 15, 2026" }
            ],
            organizer: { initials: "SF", name: "Smile Foundation", sub: "Women & Child Welfare", tag: "Verified NGO" },
            fundUtilization: [
                { title: "Vocational Training Center", amount: 1500000, desc: "Constructed a new training hall for sewing classes.", date: "Jan 2026" },
                { title: "Mobile Health Clinic", amount: 1200000, desc: "Operational costs for mobile clinic serving 12 villages.", date: "Dec 2025" },
                { title: "School Supplies", amount: 800000, desc: "Distributed school packs to 2,000 children.", date: "Jan 2026" }
            ],
            updates: [
                { title: "New Batch Giveaway", date: "Feb 1, 2026", content: "Distributed 50 sewing machines to the graduating batch of our training program." },
                { title: "Health Camp Impact", date: "Jan 25, 2026", content: "Screened 300 women for early detection of health issues in Puttalam." }
            ]
        },
        "lotus-born-foundation": {
            id: "lotus-born-foundation",
            type: "ngo",
            title: "Lotus Born Foundation",
            image: "projectArklow",
            raised: 950000,
            goal: 2500000,
            contributors: 85,
            rating: 4,
            date: "Verified NGO",
            isActive: true,
            isCompleted: false,
            about: [
                "Lotus Born Foundation focuses on elder care and supporting differently-abled individuals. Our mission is to provide dignity and care to the most vulnerable in society.",
                "We operate two elders' homes and a vocational center for differently-abled youth. We provide medical care, therapy, and skill development to help them live independent lives.",
                "Your donations go directly to food, medicine, and facility maintenance. We maintain open books for all our donors."
            ],
            verification: [
                { title: "Elder Care Certification", desc: "Certified by the Department of Social Services for elder care.", date: "Verified on Feb 8, 2026" },
                { title: "Facility Inspection", desc: "Safety and hygiene standards of homes verified.", date: "Verified on Feb 2, 2026" },
                { title: "Staff Credential Check", desc: "Nursing and care staff qualifications verified.", date: "Verified on Jan 20, 2026" }
            ],
            organizer: { initials: "LB", name: "Lotus Born Foundation", sub: "Elder & Disability Care", tag: "Verified NGO" },
            fundUtilization: [
                { title: "Home Renovation", amount: 500000, desc: "Renovated the dormitories in the Kandy elders' home.", date: "Jan 2026" },
                { title: "Medical Supplies", amount: 300000, desc: "Purchased 3 months supply of essential medicines.", date: "Feb 2026" },
                { title: "Wheelchairs", amount: 150000, desc: "Purchased 10 customized wheelchairs for the youth center.", date: "Jan 2026" }
            ],
            updates: [
                { title: "New Wing Opening", date: "Feb 5, 2026", content: "Opened a new physiotherapy wing for our residents." },
                { title: "Donation Drive", date: "Jan 15, 2026", content: "Received a generous donation of dry rations from the community." }
            ]
        }
    };

    const users = [
        { id: "1", name: "Rashid Hassan", email: "rashid.hsn@gmail.com", role: "Individual", status: "Verified", signupDate: "Jan 10, 2026" },
        { id: "2", name: "Nuha", email: "nuha@demo.com", role: "Donor", status: "Verified", signupDate: "Feb 01, 2026" },
        { id: "3", name: "Akshay Society Admin", email: "admin@akshay.org", role: "NGO", status: "Pending", signupDate: "Feb 03, 2026" },
    ];

    const seedData = async () => {
        setStatus('Seeding...');
        const newLog = [];
        const batch = writeBatch(db);

        try {
            // Seed Campaigns
            for (const [key, campaign] of Object.entries(campaigns)) {
                const campRef = doc(db, 'campaigns', campaign.id);
                // Use setDoc to overwrite/create with specific ID
                batch.set(campRef, campaign);
                newLog.push(`Added to batch: Campaign ${campaign.id}`);
            }

            // Seed Users
            for (const user of users) {
                // In a real app, the ID is usually the Firebase Auth UID. 
                // For this migration of mock data, we'll store them as legacy users 
                // or just seed them. We'll use their ID as the doc ID.
                const userRef = doc(db, 'users', user.id.toString());
                batch.set(userRef, user);
                newLog.push(`Added to batch: User ${user.id}`);
            }

            await batch.commit();
            setStatus('Success');
            newLog.push('Batch commit successful!');
        } catch (error) {
            console.error(error);
            setStatus('Error: ' + error.message);
            newLog.push('Error: ' + error.message);
        }
        setLog(newLog);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Database Seeder</h1>
            <p>Status: <strong>{status}</strong></p>
            <button
                onClick={seedData}
                style={{
                    padding: '1rem 2rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginBottom: '2rem'
                }}
            >
                Seed Database (Upload All Mock Data)
            </button>
            <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '8px' }}>
                <h3>Logs:</h3>
                {log.map((l, i) => <div key={i}>{l}</div>)}
            </div>
        </div>
    );
};

export default DatabaseSeeder;

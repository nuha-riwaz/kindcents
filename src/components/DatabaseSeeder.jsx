import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import projectEmma from '../assets/project-emma.jpg';
import projectArklow from '../assets/project-arklow.png';
import orphanCare from '../assets/orphan-care.png';
import orgAkshay from '../assets/org-akshay.jpg';

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
            image: "ayaanSurgery",
            raised: 990000,
            goal: 1000000,
            contributors: 34,
            rating: 4,
            date: "Jan 25, 2026",
            daysLeft: 9,
            userId: "1",
            creatorId: "1",
            category: "Medical",
            isActive: true,
            isCompleted: false,
            about: [
                "Ayaan, a bright 3 year old boy from Welimada, was diagnosed with a congenital heart defect (Ventricular Septal Defect) that requires immediate surgical intervention. Without this life-saving surgery, his condition will continue to deteriorate.",
                "Ayaan's father works as a daily-wage laborer, and the family cannot afford the Rs. 1,000,000 needed for the surgery at Base Hospital, Welimada. The surgical team has confirmed that with timely intervention, Ayaan can lead a completely normal life.",
                "The funds will be transferred directly to Hospital's account to ensure complete transparency. Every rupee donated goes toward saving Ayaan's life."
            ],
            verification: [
                { title: "Identity Verified", desc: "Government-issued ID verified by KYC process.", date: "Verified on Dec 10, 2025" },
                { title: "Medical Documents", desc: "Hospital admission records and diagnosis verified.", date: "Verified on Dec 12, 2025" },
                { title: "Hospital Verification", desc: "State Hospitals confirmed treatment plan and costs.", date: "Verified on Dec 12, 2025" },
                { title: "Bank Account Verified", desc: "Direct hospital account linked for fund disbursement.", date: "Verified on Dec 11, 2025" }
            ],
            organizer: { initials: "RS", name: "Mr. Rashid Hassan", sub: "Father of Ayaan", tag: "Verified Identity" },
            hospital: { name: "Base Hospital Welimada", sub: "Welimada", tag: "Hospital Verified" },
            fundUtilization: [
                { title: "Surgery Cost", amount: 850000, desc: "Cardiac valve repair surgery (hospital quote verified)", date: "Verified" },
                { title: "Hospital Stay", amount: 10000, desc: "15 days ICU + General ward recovery", date: "Verified" },
                { title: "Post-Op Care", amount: 60000, desc: "Medications, follow-ups, and rehabilitation", date: "Verified" },
                { title: "Emergency Buffer", amount: 40000, desc: "Reserved for unforeseen complications", date: "Pending Verification" }
            ],
            updates: [
                { title: "Surgery date confirmed.", date: "14.01.2026", content: "Great news! Base Hospitals has confirmed Ayaan's surgery date for February 10th. The surgical team has reviewed all reports and is optimistic about the outcome." },
                { title: "Pre-Surgery Tests Completed.", date: "10.01.2026", content: "Ayaan completed all pre-surgery diagnostic tests today. His cardiac assessment shows the surgery can proceed as planned. Thank you all for your support!" },
                { title: "Hospital Admission Scheduled.", date: "05.01.2026", content: "Ayaan has been scheduled for admission on January 23rd for pre-operative preparation. The family is grateful for the overwhelming support from donors" },
                { title: "Fundraiser Started.", date: "Dec 28, 2025", content: "Campaign launched to help Ayaan receive life-saving cardiac surgery. Initial medical documents and hospital verification completed." }
            ]
        },
        "2": {
            id: "2",
            type: "campaign",
            title: "Orphan Care Essentials",
            image: "orphanCare",
            raised: 12000,
            goal: 70000,
            contributors: 21,
            rating: 4,
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
            hospital: { name: "Happy Hearts Orphanage", sub: "Gampola", tag: "Center Verified", isCenter: true },
            fundUtilization: [
                { title: "Food Essentials", amount: 24000, desc: "Monthly groceries and nutrition supplies", date: "Verified" },
                { title: "Hygiene Kits", amount: 9000, desc: "Soap, toothpaste, sanitary items, and cleaning supplies", date: "Verified" },
                { title: "Clothing & Bedding", amount: 12000, desc: "Basic clothing and bedding essentials", date: "Verified" },
                { title: "Educational Supplies", amount: 5000, desc: "Books, stationery, and learning materials", date: "Verified" }
            ],
            updates: [
                { title: "Supplies procurement initiated.", date: "20.01.2026", content: "Good news! We've started procuring essential items for the children. The care center confirmed the final list, making sure every donation helps where it's needed most." },
                { title: "Verification Completed.", date: "15.01.2026", content: "Everything's been verified! Documents and bank details are confirmed, so you can trust that every contribution goes directly to supporting the children's daily needs." },
                { title: "Fundraiser Launched.", date: "31.01.2026", content: "The campaign is live! Your support will provide food, hygiene items, clothing, and educational materials, making a real difference for orphaned children every day." }
            ]
        },
        "3": {
            id: "3",
            type: "campaign",
            title: "Medical Equipment for Rural Hospital",
            image: "ruralMedical",
            raised: 45000,
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
            hospital: { name: "Rural General Hospital", sub: "Trincomalee", tag: "Hospital Verified" },
            fundUtilization: [
                { title: "Diagnostic Equipment", amount: 110000, desc: "Ultrasound, ECG machines, and monitors", date: "Verified" },
                { title: "Life Support Devices", amount: 50000, desc: "Soap, toothpaste, sanitary items, and cleaning supplies", date: "Verified" },
                { title: "Consumables & Accessories", amount: 30000, desc: "Cables, sensors, and spare parts", date: "Verified" }
            ],
            updates: [
                { title: "Equipment List Finalized.", date: "02.02.2026", content: "The hospital confirmed the final list of equipment needed to ensure donations are used where they are most required." },
                { title: "Verification Completed.", date: "28.01.2026", content: "All NGO documents, hospital requirements, and bank details have been fully verified for transparency." },
                { title: "Fundraiser Launched.", date: "06.02.2026", content: "Campaign is live! Donations will help purchase essential medical equipment for the rural hospital, improving care for the community." }
            ]
        },
        "4": {
            id: "4",
            type: "campaign",
            title: "Temple renovation in Panagama",
            image: "templeRenovation",
            raised: 8000,
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
            fundUtilization: [
                { title: "Structural Repairs", amount: 10000, desc: "Ultrasound, ECG machines, and monitors", date: "Verified" },
                { title: "Painting & Maintenance", amount: 7000, desc: "Soap, toothpaste, sanitary items, and cleaning supplies", date: "Verified" },
                { title: "Basic Amenities & Supplies", amount: 3000, desc: "Cables, sensors, and spare parts", date: "Verified" }
            ],
            updates: [
                { title: "Renovation Plan Finalized.", date: "15.02.2026", content: "The temple committee finalized repairs and budget to ensure donations are used effectively." },
                { title: "Verification Completed.", date: "10.01.2026", content: "All documents and bank details are verified for transparency and donor confidence." },
                { title: "Fundraiser Launched.", date: "22.02.2026", content: "Campaign is live! Donations will help renovate Panagama Temple and maintain it for the community." }
            ],
            hospital: { name: "Panagama Temple", sub: "Panagama", tag: "Temple Verified", isCenter: true }
        },
        "akshay-society": {
            id: "akshay-society",
            type: "ngo",
            title: "Akshay Society",
            image: "orgAkshay",
            raised: 250000,
            goal: 5000000,
            contributors: 173,
            rating: 4,
            date: "Verified NGO",
            userId: "3",
            creatorId: "3",
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
                { title: "Community Impact Verified", desc: "Health and education programs benefiting 15,000+ individuals confirmed.", date: "Verified on Jan 12, 2026" },
                { title: "Environmental Reports", desc: "Medical, education, and rural development reports documented.", date: "Verified on Jan 12, 2026" }
            ],
            organizer: { initials: "AS", name: "Akshay Society", sub: "Health & Education", tag: "Verified NGO", logo: "orgAkshay" },
            fundUtilization: [
                { title: "Community Health Programs", amount: 750000, desc: "Medical camps, health screenings, and essential medicines", date: "Verified" },
                { title: "Educational Support", amount: 520000, desc: "School supplies, learning materials, and student support", date: "Verified" },
                { title: "Rural Development Projects", amount: 350000, desc: "Sanitation support and basic community infrastructure", date: "Verified" },
                { title: "Monitoring & Evaluation", amount: 200000, desc: "Program tracking, reporting, and impact assessment", date: "Verified" }
            ],
            updates: [
                { title: "New District Program Approved", date: "Jan 12, 2026", content: "Exciting news! The expansion has been approved to reach over 5,000 additional beneficiaries, bringing health and education programs to more rural communities in need." },
                { title: "Annual Audit Report Published", date: "Jan 5, 2026", content: "Our independent audit confirms full transparency and proper fund usage across all projects, ensuring every donation directly supports health, education, and development programs." },
                { title: "Education Milestone Achieved", date: "Dec 20, 2025", content: "We're proud to support our 3,500th rural student with educational materials and resources, helping them access quality learning opportunities and brighter futures." },
                { title: "60th Medical Camp Completed", date: "Nov 15, 2025", content: "Our 60th free medical camp successfully delivered essential healthcare services, including check-ups and treatments, to underserved rural communities across multiple districts." }
            ],
            hospital: { name: "Akshay Society HQ", sub: "Colombo", tag: "Organization Verified", isCenter: true }
        },
        "keithston-foundation": {
            id: "keithston-foundation",
            type: "ngo",
            title: "Keithston Foundation",
            image: "orgKeithston",
            raised: 320000,
            goal: 5000000,
            contributors: 245,
            rating: 4,
            date: "Verified NGO",
            isActive: true,
            isCompleted: false,
            about: [
                "Established in 2022, Keithston Foundation implements sustainable water solutions and reforestation projects across Sri Lanka's dry zones. The organization works to mitigate the effects of drought and industrial pollution on rural farming communities.",
                "To date, the initiative has installed 45 community filtration systems in Anuradhapura, providing clean drinking water to over 10,000 residents. Additionally, the group has overseen the planting of 25,000 native trees in Monaragala to restore local watersheds and prevent soil erosion.",
                "All project funding is tracked through public ledgers, with 100% of donations utilized for raw materials and technical installation. This platform allows the organization to scale its environmental restoration efforts to new districts."
            ],
            verification: [
                { title: "Statutory Compliance", desc: "Valid legal registration certificates and regulatory compliance verified.", date: "Verified on Jan 5, 2026" },
                { title: "Performance Audit", desc: "Independent audit reports and project completion rates reviewed.", date: "Verified on Jan 8, 2026" },
                { title: "Financial Transparency", desc: "Public ledger tracking with 100% fund utilization verification.", date: "Verified on Jan 10, 2026" },
                { title: "Community Impact Verified", desc: "45 filtration systems serving 10,000+ residents confirmed.", date: "Verified on Jan 12, 2026" },
                { title: "Environmental Reports", desc: "25,000 native trees planted in Monaragala documented.", date: "Verified on Jan 12, 2026" }
            ],
            organizer: { initials: "KF", name: "Keithston Foundation", sub: "Environment & Sustainability", tag: "Verified NGO" },
            fundUtilization: [
                { title: "Water Filtration Systems", amount: 2000000, desc: "15 community filtration units for Polonnaruwa district", date: "Verified" },
                { title: "Reforestation Materials", amount: 1200000, desc: "10,000 native tree saplings and irrigation infrastructure", date: "Verified" },
                { title: "Technical Installation", amount: 800000, desc: "Labor, equipment, and professional installation services", date: "Verified" },
                { title: "Monitoring & Evaluation", amount: 550000, desc: "Long-term impact assessment and sustainability tracking", date: "Verified" }
            ],
            updates: [
                { title: "New District Expansion Approved", date: "Jan 12, 2026", content: "Exciting news! The government of Sri Lanka has approved our expansion into Polonnaruwa district. This will bring clean water access to 5,000 additional residents in 8 villages." },
                { title: "Annual Audit Report Published", date: "Jan 5, 2026", content: "Our 2025 annual audit has been completed by KPMG Sri Lanka. Full transparency report showing 100% fund utilization for raw materials and installation is now available on our public ledger" },
                { title: "10,000th Tree Planted Milestone", date: "Dec 20, 2025", content: "We've reached a major milestone in our Monaragala reforestation project! The 10,000th native tree was planted today, with local school children participating in the ceremony." },
                { title: "45th Filtration System Operational", date: "Nov 15, 2025", content: "Our 45th community water filtration system is now operational in Anuradhapura. This completes Phase 2 of our clean water initiative, serving the entire eastern corridor." }
            ],
            hospital: { name: "Keithston Foundation", sub: "Monaragala", tag: "Organization Verified", isCenter: true }
        },
        "smile-foundation": {
            id: "smile-foundation",
            type: "ngo",
            title: "Smile Foundation",
            image: "orgSmile",
            raised: 280000,
            goal: 5000000,
            contributors: 210,
            rating: 5,
            date: "Verified NGO",
            isActive: true,
            isCompleted: false,
            about: [
                "Established in 2000, Smile Foundation works to uplift underserved communities through healthcare, education, and women & child development programs across Sri Lanka.",
                "The organization runs mobile health clinics, vaccination drives, school improvement initiatives, and vocational training programs. To date, Smile Foundation has reached over 18,000 individuals with healthcare services and provided educational support to more than 4,000 children, while training 500+ women in skill development programs.",
                "All donations are 100% tracked and used for verified projects, ensuring transparency. Contributions help Smile Foundation expand its programs to more rural areas and strengthen existing community initiatives."
            ],
            verification: [
                { title: "Statutory Compliance", desc: "Legal registration and regulatory compliance verified.", date: "Verified on Jan 10, 2026" },
                { title: "Performance Audit", desc: "Independent audits and program outcomes reviewed.", date: "Verified on Jan 12, 2026" },
                { title: "Financial Transparency", desc: "Transparent fund tracking with verified utilization.", date: "Verified on Jan 14, 2026" },
                { title: "Community Impact Verified", desc: "18,000+ beneficiaries served through health, education, and skill development programs confirmed.", date: "Verified on Jan 15, 2026" },
                { title: "Program Reports", desc: "Medical camps, school projects, and vocational training reports documented.", date: "Verified on Jan 15, 2026" }
            ],
            organizer: { initials: "SF", name: "Smile Foundation", sub: "Women & Child Welfare", tag: "Verified NGO" },
            fundUtilization: [
                { title: "Healthcare Programs", amount: 900000, desc: "Mobile clinics, vaccination drives, and medical supplies", date: "Verified" },
                { title: "Education Initiatives", amount: 650000, desc: "School renovation, books, uniforms, and learning materials", date: "Verified" },
                { title: "Women & Child Development", amount: 400000, desc: "Skill training workshops, hygiene kits, and community support", date: "Verified" },
                { title: "Monitoring & Evaluation", amount: 200000, desc: "Tracking program progress, reporting, and measuring outcomes", date: "Verified" }
            ],
            updates: [
                { title: "New School Renovation Completed", date: "Jan 15, 2026", content: "A rural school in Monaragala was renovated with new classrooms and learning materials, benefiting over 200 children." },
                { title: "Annual Audit Published", date: "Jan 5, 2026", content: "Independent audit confirms full transparency and proper utilization of funds across all programs." },
                { title: "Health Camp Milestone", date: "Dec 22, 2025", content: "The 65th mobile health clinic was conducted, serving 1,500 rural residents with check-ups and essential medicines." },
                { title: "Women's Skill Workshop Completed", date: "Nov 30, 2025", content: "Over 50 women received vocational training in sewing and handicrafts, helping them generate sustainable income for their families." }
            ],
            hospital: { name: "Smile Foundation Center", sub: "Kandy", tag: "Organization Verified", isCenter: true }
        },
        "lotus-born-foundation": {
            id: "lotus-born-foundation",
            type: "ngo",
            title: "Lotus Born Foundation",
            image: "orgLotus",
            raised: 210000,
            goal: 5000000,
            contributors: 185,
            rating: 4,
            date: "Verified NGO",
            isActive: true,
            isCompleted: false,
            about: [
                "Established in 2015, Lotus Born Foundation works to empower marginalized communities through child education, women's empowerment, and community health initiatives across rural Sri Lanka.",
                "The organization runs after-school programs, literacy and STEM initiatives, health awareness workshops, and nutrition programs. To date, Lotus Born Foundation has supported over 12,000 children with educational programs, trained 350 women in vocational and entrepreneurial skills, and conducted 40 community health workshops, reaching more than 10,000 residents.",
                "All donations are 100% tracked and used for verified projects, ensuring transparency. Contributions help Lotus Born Foundation expand programs to new villages and strengthen ongoing community initiatives."
            ],
            verification: [
                { title: "Statutory Compliance", desc: "Legal registration and regulatory compliance verified.", date: "Verified on Jan 10, 2026" },
                { title: "Performance Audit", desc: "Independent audits and program outcomes reviewed.", date: "Verified on Jan 12, 2026" },
                { title: "Financial Transparency", desc: "Transparent fund tracking with verified utilization.", date: "Verified on Jan 14, 2026" },
                { title: "Community Impact Verified", desc: "12,000+ children and 350 women served through education, skills, and health programs.", date: "Verified on Jan 15, 2026" },
                { title: "Program Reports", desc: "After-school programs, workshops, and vocational training documented.", date: "Verified on Jan 15, 2026" }
            ],
            organizer: { initials: "LB", name: "Lotus Born Foundation", sub: "Education & Empowerment", tag: "Verified NGO" },
            fundUtilization: [
                { title: "Child Education Programs", amount: 800000, desc: "After-school classes, STEM kits, books, and learning materials", date: "Verified" },
                { title: "Women's Empowerment Initiatives", amount: 550000, desc: "Vocational training, micro-business support, and skill workshops", date: "Verified" },
                { title: "Community Health Programs", amount: 400000, desc: "Health awareness workshops, nutrition programs, and basic check-ups", date: "Verified" },
                { title: "Monitoring & Evaluation", amount: 200000, desc: "Program tracking, progress reports, and impact assessment", date: "Verified" }
            ],
            updates: [
                { title: "New Community Learning Center Opened", date: "Jan 15, 2026", content: "A new center in Batticaloa now provides after-school classes, STEM programs, and library access for 150 children in the area." },
                { title: "Annual Audit Completed", date: "Jan 5, 2026", content: "Independent audit confirms proper fund usage and full transparency for all ongoing programs." },
                { title: "Health Workshop Milestone", date: "Dec 22, 2025", content: "The 40th community health workshop was conducted, providing health awareness and basic check-ups to 1,200 rural residents." },
                { title: "Women's Skill Training Completed", date: "Nov 30, 2025", content: "Over 50 women completed vocational training, learning sewing, handicrafts, and small-business skills to improve household income." }
            ],
            hospital: { name: "Lotus Born HQ", sub: "Batticaloa", tag: "Organization Verified", isCenter: true }
        }
    };

    const users = [
        { id: "1", name: "Rashid Hassan", email: "rashid.hsn@gmail.com", role: "Individual", status: "Verified", signupDate: "Jan 10, 2026" },
        { id: "2", name: "Nuha", email: "nuha@demo.com", role: "Donor", status: "Verified", signupDate: "Feb 01, 2026" },
        { id: "3", name: "Akshay Society", email: "admin@akshay.org", role: "NGO", status: "Verified", signupDate: "Feb 03, 2026", photoURL: "orgAkshay" },
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

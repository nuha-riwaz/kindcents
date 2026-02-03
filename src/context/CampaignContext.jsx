import React, { createContext, useState, useContext } from 'react';
import projectEmma from '../assets/project-emma.jpg';
import projectArklow from '../assets/project-arklow.png';

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
    // Initial State populated from existing mock data
    const [campaigns, setCampaigns] = useState({
        "1": {
            id: "1",
            type: "campaign",
            title: "Help Ayaan's Surgery",
            image: projectEmma,
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
            image: projectArklow,
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
            image: projectEmma,
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
            image: projectArklow,
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
            image: projectEmma,
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
            organizer: { initials: "AS", name: "Akshay Society", sub: "Health & Education", tag: "Verified NGO" }
        }
    });

    const [users, setUsers] = useState([
        { id: 1, name: "Rashid Hassan", email: "rashid.hsn@gmail.com", role: "Individual", status: "Verified", signupDate: "Jan 10, 2026" },
        { id: 2, name: "Nuha", email: "nuha@demo.com", role: "Donor", status: "Verified", signupDate: "Feb 01, 2026" },
        { id: 3, name: "Akshay Society Admin", email: "admin@akshay.org", role: "NGO", status: "Pending", signupDate: "Feb 03, 2026" },
    ]);

    const addCampaign = (campaign) => {
        const id = campaign.id || `camp-${Date.now()}`;
        setCampaigns(prev => ({
            ...prev,
            [id]: { ...campaign, id }
        }));
    };

    const updateCampaign = (id, updatedData) => {
        setCampaigns(prev => ({
            ...prev,
            [id]: { ...prev[id], ...updatedData }
        }));
    };

    const deleteCampaign = (id) => {
        setCampaigns(prev => {
            const newList = { ...prev };
            delete newList[id];
            return newList;
        });
    };

    const updateUserStatus = (userId, status) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    };

    return (
        <CampaignContext.Provider value={{
            campaigns: campaigns ? Object.values(campaigns) : [],
            campaignStore: campaigns || {},
            users: users || [],
            addCampaign,
            updateCampaign,
            deleteCampaign,
            updateUserStatus
        }}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaigns = () => useContext(CampaignContext);

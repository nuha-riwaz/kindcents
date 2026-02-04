import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShareModal from '../components/ShareModal';
import {
    CheckCircle2,
    Share2,
    Star,
    Users,
    User,
    Hospital,
    Calendar,
    ArrowRight,
    Search,
    ShieldCheck,
    Briefcase,
    Globe,
    FileText
} from 'lucide-react';
import logo from '../assets/logo.png';
import projectEmma from '../assets/project-emma.jpg';
import projectArklow from '../assets/project-arklow.png';
import ayaanSurgery from '../assets/ayaan-surgery.png';
import mrsPerera from '../assets/mrs-perera.jpg';
import orgAkshay from '../assets/org-akshay.jpg';
import orgKeithston from '../assets/org-keithston.jpg';
import orgSmile from '../assets/org-smile.jpg';
import orgLotus from '../assets/org-lotus.jpg';
import templeRenovation from '../assets/temple-renovation.png';
import ruralMedical from '../assets/rural-medical.jpg';

// Image mapping to resolve Firestore strings to local assets
const imageMap = {
    projectEmma,
    projectArklow,
    ayaanSurgery,
    mrsPerera,
    orgAkshay,
    orgKeithston,
    orgSmile,
    orgLotus,
    templeRenovation,
    ruralMedical
};

import { useCampaigns } from '../context/CampaignContext';

import DonationModal from '../components/DonationModal';
import { useAuth } from '../context/AuthContext';

const CampaignDetails = () => {
    const { id } = useParams();
    const { campaignStore, donateToCampaign } = useCampaigns();
    const { user } = useAuth();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    const campaign = campaignStore[id] || campaignStore["1"];
    const isNGO = campaign.type === 'ngo';

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: campaign.title,
                    text: `Check out this ${isNGO ? 'organization' : 'cause'}: ${campaign.title}`,
                    url: window.location.href,
                });
            } catch (err) {
                setIsShareModalOpen(true);
            }
        } else {
            setIsShareModalOpen(true);
        }
    };

    const handleDonation = async (amount) => {
        if (!campaign) return;
        try {
            await donateToCampaign(campaign.id, amount, user ? user.uid : 'anonymous');
            // Additional success logic happens inside the modal (showing success step)
        } catch (error) {
            alert("Donation failed. Please try again.");
        }
    };

    if (!campaign) return <div>Loading...</div>;

    return (
        <div style={styles.page}>
            <Navbar />
            <div className="container" style={styles.container}>
                <div style={styles.heroCard}>
                    <div style={styles.heroLayout}>
                        <div style={styles.heroImageContainer}>
                            <img
                                src={imageMap[campaign.image] || campaign.image}
                                alt={campaign.title}
                                style={styles.heroImage}
                            />
                            <div style={isNGO ? styles.verifiedNGOBadge : styles.verifiedBadge}>
                                <CheckCircle2 size={16} /> {isNGO ? 'Verified NGO' : 'Verified Cause'}
                            </div>
                            {isNGO && (
                                <div style={styles.logoOverlay}>
                                    <div style={styles.logoPlaceholder}>{campaign.organizer.initials}</div>
                                </div>
                            )}
                        </div>
                        <div style={styles.heroContent}>
                            <div style={styles.headerTop}>
                                <h1 style={styles.title}>{campaign.title}</h1>
                                <div style={styles.ratingStars}>
                                    {[...Array(campaign.rating)].map((_, i) => <Star key={i} size={24} fill="#fbbf24" color="#fbbf24" />)}
                                    {[...Array(5 - campaign.rating)].map((_, i) => <Star key={i} size={24} color="#cbd5e1" />)}
                                </div>
                            </div>
                            <div style={styles.progressSection}>
                                <div style={styles.progressContainer}>
                                    <div style={{ ...styles.progressBar, width: `${(campaign.raised / campaign.goal) * 100}%` }} />
                                </div>
                                <div style={styles.amountLabels}>
                                    <span>Rs. {campaign.raised.toLocaleString()}</span>
                                    <span>Rs. {campaign.goal.toLocaleString()}</span>
                                </div>
                                <div style={styles.metaRow}>
                                    <span style={styles.dateLabel}>{campaign.date}</span>
                                    <span style={styles.contributorsBadge}><Users size={14} /> {campaign.contributors} Contributors</span>
                                </div>
                                <div style={styles.lowerMeta}>
                                    {campaign.daysLeft && <span style={styles.daysLeft}>{campaign.daysLeft} days left</span>}
                                    <button style={styles.shareBtn} onClick={handleShare}><Share2 size={16} /> Share</button>
                                </div>
                            </div>
                            <button style={styles.donateBtn} onClick={() => setIsDonationModalOpen(true)}>
                                Donate Now <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
                <div style={styles.mainGrid}>
                    <div style={styles.leftCol}>
                        <div style={styles.sectionCard}>
                            <h2 style={styles.sectionTitle}>About This {isNGO ? 'Organization' : 'Cause'}</h2>
                            {campaign.about.map((p, i) => <p key={i} style={styles.aboutText}>{p}</p>)}
                        </div>
                        <div style={styles.sectionNoCard}>
                            <h2 style={styles.sectionTitle}>Verification Status</h2>
                            <div style={styles.verificationList}>
                                {campaign.verification.map((item, i) => (
                                    <div key={i} style={styles.verificationItem}>
                                        <div style={styles.vIconCircle}>{item.icon}</div>
                                        <div style={styles.vInfo}>
                                            <div style={styles.vTitleRow}><strong>{item.title}</strong> <CheckCircle2 size={16} color="#10b981" /></div>
                                            <p style={styles.vDesc}>{item.desc}</p>
                                            <span style={styles.vDate}>{item.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {campaign.fundUtilization && (
                            <div style={styles.sectionCard}>
                                <h2 style={styles.sectionTitle}>Fund Utilization</h2>
                                <div style={styles.fundList}>
                                    {campaign.fundUtilization.map((fund, i) => (
                                        <div key={i} style={styles.fundItem}>
                                            <div style={styles.fundHeader}>
                                                <span style={styles.fundTitle}>{fund.title}</span>
                                                <span style={styles.fundAmount}>Rs. {fund.amount.toLocaleString()}</span>
                                            </div>
                                            <p style={styles.fundDesc}>{fund.desc}</p>
                                            <span style={styles.fundDate}>{fund.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {campaign.updates && (
                            <div style={styles.sectionNoCard}>
                                <h2 style={styles.sectionTitle}>Recent Updates</h2>
                                <div style={styles.updateList}>
                                    {campaign.updates.map((update, i) => (
                                        <div key={i} style={styles.updateItem}>
                                            <div style={styles.updateMarker}></div>
                                            <div style={styles.updateContent}>
                                                <span style={styles.updateDate}>{update.date}</span>
                                                <h4 style={styles.updateTitle}>{update.title}</h4>
                                                <p style={styles.updateText}>{update.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={styles.rightCol}>
                        <div style={styles.sideCard}>
                            <p style={styles.sideLabel}>{isNGO ? 'Organization' : 'Organizer'}</p>
                            <div style={styles.avatar}>{campaign.organizer.initials}</div>
                            <strong style={styles.sideName}>{campaign.organizer.name}</strong>
                            <p style={styles.sideSub}>{campaign.organizer.sub}</p>
                            <div style={styles.verifiedTag}><CheckCircle2 size={14} /> Verified</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} campaignTitle={campaign.title} campaignUrl={window.location.href} />
            <DonationModal
                isOpen={isDonationModalOpen}
                onClose={() => setIsDonationModalOpen(false)}
                campaignTitle={campaign.title}
                onDonate={handleDonation}
            />
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#f8fafc', minHeight: '100vh' },
    container: { paddingTop: '100px', paddingBottom: '4rem' },
    heroCard: { backgroundColor: '#D6E6FF', borderRadius: '32px', padding: '2.5rem', marginBottom: '2rem' },
    heroLayout: { display: 'flex', gap: '2.5rem', alignItems: 'center' },
    heroImageContainer: { flex: '1', position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '350px' },
    heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
    verifiedBadge: { position: 'absolute', top: '1.5rem', left: '1.5rem', backgroundColor: 'rgba(255,255,255,0.9)', padding: '0.5rem 1rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#10b981' },
    verifiedNGOBadge: { position: 'absolute', top: '1.5rem', left: '1.5rem', backgroundColor: 'rgba(209,250,229,0.9)', padding: '0.5rem 1rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#059669', border: '1px solid #10b981' },
    logoOverlay: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px', backgroundColor: '#fff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    logoPlaceholder: { fontSize: '2rem', fontWeight: '800' },
    heroContent: { flex: '1.2', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    title: { fontSize: '2.25rem', fontWeight: '700', color: '#1e293b', margin: 0 },
    ratingStars: { display: 'flex', gap: '0.25rem' },
    progressSection: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    progressContainer: { width: '100%', height: '10px', backgroundColor: '#fff', borderRadius: '5px', overflow: 'hidden' },
    progressBar: { height: '100%', backgroundColor: '#2563eb' },
    amountLabels: { display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '600', color: '#475569' },
    metaRow: { display: 'flex', gap: '1rem', marginTop: '0.25rem' },
    dateLabel: { backgroundColor: 'rgba(255,255,255,0.6)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem' },
    contributorsBadge: { backgroundColor: 'rgba(255,255,255,0.6)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    lowerMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    daysLeft: { backgroundColor: '#fca5a5', color: '#fff', padding: '0.3rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600' },
    shareBtn: { background: 'none', border: '1px solid #e2e8f0', backgroundColor: '#fff', padding: '0.4rem 1rem', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    donateBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '50px', fontSize: '1.25rem', fontWeight: '700', cursor: 'pointer', width: 'fit-content', display: 'flex', alignItems: 'center', gap: '0.75rem' },
    mainGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' },
    leftCol: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    sectionCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    sectionNoCard: { padding: '0 1rem' },
    sectionTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' },
    aboutText: { fontSize: '1rem', lineHeight: '1.6', color: '#475569', marginBottom: '1rem' },
    verificationList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    verificationItem: { backgroundColor: '#f0fdf4', border: '1px solid #10b981', borderRadius: '20px', padding: '1.25rem', display: 'flex', gap: '1rem' },
    vIconCircle: { width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    vInfo: { flex: 1 },
    vTitleRow: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    vDesc: { fontSize: '0.9rem', color: '#64748b', margin: '0.25rem 0' },
    vDate: { fontSize: '0.8rem', color: '#94a3b8' },
    rightCol: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    sideCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '2rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    sideLabel: { fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase' },
    avatar: { width: '60px', height: '60px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.25rem', fontWeight: '700' },
    sideName: { display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' },
    sideSub: { fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' },
    verifiedTag: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem' },

    // Fund Utilization Styles
    fundList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    fundItem: { borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' },
    fundHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' },
    fundTitle: { fontWeight: '600', color: '#1e293b' },
    fundAmount: { fontWeight: '700', color: '#10b981' },
    fundDesc: { fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' },
    fundDate: { fontSize: '0.8rem', color: '#94a3b8' },

    // Updates Styles
    updateList: { position: 'relative', borderLeft: '2px solid #e2e8f0', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' },
    updateItem: { position: 'relative' },
    updateMarker: { position: 'absolute', left: '-1.95rem', top: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2563eb', border: '3px solid #fff', boxShadow: '0 0 0 1px #e2e8f0' },
    updateContent: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    updateDate: { fontSize: '0.75rem', fontWeight: '600', color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.2rem 0.75rem', borderRadius: '50px', width: 'fit-content', border: '1px solid #e2e8f0' },
    updateTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: 0 },
    updateText: { fontSize: '0.95rem', lineHeight: '1.6', color: '#475569', margin: 0 }
};

export default CampaignDetails;

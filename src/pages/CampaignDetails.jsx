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
    FileText,
    Building2,
    ClipboardCheck
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
import orphanCare from '../assets/orphan-care.png';

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
    ruralMedical,
    orphanCare
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

    const campaign = campaignStore[id] || (Object.values(campaignStore).find(c => c.id === id));
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
        } catch (error) {
            alert("Donation failed. Please try again.");
        }
    };

    if (!campaign) return <div>Loading...</div>;

    const raisedPercent = Math.min((campaign.raised / campaign.goal) * 100, 100);

    return (
        <div style={styles.page}>
            <Navbar />
            <div className="container" style={styles.container}>
                {/* Hero Section */}
                <div
                    style={{
                        ...styles.heroCard,
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${imageMap[campaign.image] || campaign.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <div style={styles.heroLayout}>
                        {/* Hero Left Content */}
                        <div style={styles.heroMain}>
                            <div style={isNGO ? styles.heroBadgeNGO : styles.heroBadge}>
                                <CheckCircle2 size={16} /> {isNGO ? 'Verified NGO' : 'Verified Cause'}
                            </div>

                            <h1 style={styles.titleCompact}>{campaign.title}</h1>

                            <div style={styles.progressSectionCompact}>
                                <div style={styles.progressContainerCompact}>
                                    <div style={{ ...styles.progressBarCompact, width: `${raisedPercent}%` }} />
                                </div>
                                <div style={styles.amountLabelsCompact}>
                                    <div style={styles.amountItem}>
                                        <span style={styles.amountLabel}>Rs. {campaign.raised.toLocaleString()}</span>
                                    </div>
                                    <div style={styles.amountItem}>
                                        <span style={styles.amountLabel}>Rs. {campaign.goal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div style={styles.metaRowCompact}>
                                    <span style={styles.metaBadge}>{campaign.date || (campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : 'Ongoing')}</span>
                                    <span style={styles.metaBadge}><Users size={14} /> Contributors - {campaign.contributors || 0}</span>
                                </div>
                                <div style={styles.metaRowCompact}>
                                    {(campaign.deadline || campaign.daysLeft) && (
                                        <span style={styles.daysBadgeCompact}>
                                            {campaign.deadline
                                                ? (() => {
                                                    const diffTime = new Date(campaign.deadline) - new Date();
                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                    return diffDays > 0 ? `${diffDays} days left` : 'Ended';
                                                })()
                                                : `${campaign.daysLeft} days left`
                                            }
                                        </span>
                                    )}
                                    <button style={styles.shareBtnCompact} onClick={handleShare}>
                                        <Share2 size={16} /> Share Campaign
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Hero Right Content */}
                        <div style={styles.heroActions}>
                            <div style={styles.ratingStarsBox}>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={32}
                                        fill={i < campaign.rating ? "#fbbf24" : "none"}
                                        color={i < campaign.rating ? "#fbbf24" : "#cbd5e1"}
                                        strokeWidth={1.5}
                                    />
                                ))}
                            </div>
                            <button style={styles.donateBtnHero} onClick={() => setIsDonationModalOpen(true)}>
                                Donate Now <ArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                <div style={styles.mainGrid}>
                    <div style={styles.leftCol}>
                        {/* About Section */}
                        <div style={styles.sectionCard}>
                            <h2 style={styles.sectionTitle}>About This {isNGO ? 'Organization' : 'Cause'}</h2>
                            {campaign.about.map((p, i) => <p key={i} style={styles.aboutText}>{p}</p>)}
                        </div>

                        {/* Verification Status Section */}
                        {campaign.verification && (
                            <div style={styles.sectionNoCard}>
                                <h2 style={styles.sectionTitle}>Verification Status</h2>
                                <div style={styles.verificationGrid}>
                                    {campaign.verification.map((item, i) => (
                                        <div key={i} style={styles.verifCardCompact}>
                                            <div style={styles.verifIconBox}>
                                                {i === 0 && <User size={20} color="#64748b" />}
                                                {i === 1 && <FileText size={20} color="#64748b" />}
                                                {i === 2 && <Building2 size={20} color="#64748b" />}
                                                {i === 3 && <ClipboardCheck size={20} color="#64748b" />}
                                            </div>
                                            <div style={styles.verifContentBox}>
                                                <div style={styles.verifTitleRow}>
                                                    <strong style={styles.verifTitleText}>{item.title}</strong>
                                                    <CheckCircle2 size={16} color="#10b981" />
                                                </div>
                                                <p style={styles.verifDescText}>{item.desc}</p>
                                                <span style={styles.verifDateText}>{item.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fund Utilization Section */}
                        {(campaign.fundUtilization || (isNGO && campaign.fundUtilization)) && (
                            <div style={styles.sectionCardLarge}>
                                <div style={styles.fundHeaderRow}>
                                    <h2 style={styles.sectionTitleNoMargin}>Fund Utilization</h2>
                                    <div style={styles.verifiedExpensesPill}>
                                        <CheckCircle2 size={16} color="#10b981" />
                                        <span>Verified Expenses</span>
                                        <span style={styles.expenseRatio}>Rs.{(campaign.fundUtilization || []).reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}/ Rs.{campaign.goal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div style={styles.fundListGrid}>
                                    {(campaign.fundUtilization || []).map((fund, i) => (
                                        <div key={i} style={styles.fundCardCompact}>
                                            <div style={styles.fundInfoCompact}>
                                                <div style={styles.fundTitleLine}>
                                                    <span style={styles.fundTitleName}>{fund.title}</span>
                                                    <span style={fund.date.includes('Pending') ? styles.pendingTag : styles.verifiedTagMini}>
                                                        <CheckCircle2 size={12} /> {fund.date}
                                                    </span>
                                                </div>
                                                <p style={styles.fundDescMini}>{fund.desc}</p>
                                            </div>
                                            <div style={styles.fundAmountCompact}>
                                                Rs. {fund.amount.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Updates Section */}
                        {campaign.updates && (
                            <div style={styles.sectionCardLarge}>
                                <h2 style={styles.sectionTitle}>Updates</h2>
                                <div style={styles.timelineCompact}>
                                    {campaign.updates.map((update, i) => (
                                        <div key={i} style={styles.timelineItemCompact}>
                                            <div style={styles.timelineIconBox}>
                                                <Calendar size={20} color="#64748b" />
                                            </div>
                                            <div style={styles.timelineCard}>
                                                <div style={styles.updateDateCompact}>{update.date}</div>
                                                <h4 style={styles.updateTitleCompact}>{update.title}</h4>
                                                <p style={styles.updateTextCompact}>{update.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={styles.rightCol}>
                        {/* Organizer Card */}
                        <div style={styles.sideCardCompact}>
                            <p style={styles.sideLabelCompact}>Campaign organizer</p>
                            <div style={styles.organizerInfoBox}>
                                <div style={styles.avatarCompact}>{campaign.organizer.initials}</div>
                                <div style={styles.organizerMetaBox}>
                                    <strong style={styles.sideNameCompact}>{campaign.organizer.name}</strong>
                                    <p style={styles.sideSubCompact}>{campaign.organizer.sub}</p>
                                </div>
                            </div>
                            <div style={styles.verifiedTagAction}><CheckCircle2 size={14} /> Verified Identity</div>
                        </div>

                        {/* Hospital/Center Card */}
                        <div style={styles.sideCardCompact}>
                            <p style={styles.sideLabelCompact}>{campaign.hospital?.isCenter ? 'Care Center' : 'Treatment Hospital'}</p>
                            <div style={styles.organizerInfoBox}>
                                <div style={styles.hospitalIconCircle}>
                                    {campaign.hospital?.isCenter ? <Users size={24} color="#64748b" /> : <Hospital size={24} color="#64748b" />}
                                </div>
                                <div style={styles.organizerMetaBox}>
                                    <strong style={styles.sideNameCompact}>{campaign.hospital?.name}</strong>
                                    <p style={styles.sideSubCompact}>{campaign.hospital?.sub}</p>
                                </div>
                            </div>
                            <div style={styles.verifiedTagAction}><CheckCircle2 size={14} /> {campaign.hospital?.isCenter ? 'Center Verified' : 'Hospital Verified'}</div>
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
    page: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    container: { paddingTop: '100px', paddingBottom: '4rem' },

    // Hero Section Styles
    heroCard: {
        borderRadius: '32px',
        padding: '3rem',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
    },
    heroLayout: { display: 'flex', gap: '3rem', alignItems: 'flex-end', justifyContent: 'space-between' },
    heroMain: { flex: '1', display: 'flex', flexDirection: 'column', gap: '1rem' },
    heroBadge: {
        backgroundColor: 'rgba(236, 253, 245, 0.9)',
        color: '#059669',
        padding: '0.4rem 1rem',
        borderRadius: '50px',
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.85rem',
        fontWeight: '600',
        border: '1px solid #10b981'
    },
    heroBadgeNGO: {
        backgroundColor: 'rgba(219, 234, 254, 0.9)',
        color: '#2563eb',
        padding: '0.4rem 1rem',
        borderRadius: '50px',
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.85rem',
        fontWeight: '600',
        border: '1px solid #3b82f6'
    },
    titleCompact: { fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', margin: 0, lineHeight: '1.1' },

    progressSectionCompact: { display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '500px' },
    progressContainerCompact: { width: '100%', height: '8px', backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden' },
    progressBarCompact: { height: '100%', backgroundColor: '#2563eb' },
    amountLabelsCompact: { display: 'flex', gap: '2rem', marginTop: '0.25rem' },
    amountLabel: { fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' },
    metaRowCompact: { display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' },
    metaBadge: { backgroundColor: 'rgba(241, 245, 249, 0.8)', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    daysBadgeCompact: { backgroundColor: '#fca5a5', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700' },
    shareBtnCompact: { background: 'rgba(241, 245, 249, 0.8)', border: '1px solid #e2e8f0', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e293b', fontWeight: '600' },

    heroActions: { flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' },
    ratingStarsBox: { display: 'flex', gap: '0.5rem', justifyContent: 'center' },
    donateBtnHero: {
        backgroundColor: '#22c55e',
        color: '#fff',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '20px',
        fontSize: '1.75rem',
        fontWeight: '800',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: 'fit-content',
        boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
        transition: 'transform 0.2s'
    },

    mainGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1rem' },
    leftCol: { display: 'flex', flexDirection: 'column', gap: '2rem' },

    sectionCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
    sectionCardLarge: { backgroundColor: '#f1f5f9', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
    sectionNoCard: { padding: '0 0.5rem' },
    sectionTitle: { fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' },
    sectionTitleNoMargin: { fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: 0 },
    aboutText: { fontSize: '1rem', lineHeight: '1.6', color: '#444', marginBottom: '1rem' },

    // Verification Grid Styles
    verificationGrid: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    verifCardCompact: {
        backgroundColor: '#ecfdf5',
        border: '1px solid #10b981',
        borderRadius: '20px',
        padding: '1rem 1.5rem',
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'center'
    },
    verifIconBox: { width: '48px', height: '48px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    verifContentBox: { flex: 1 },
    verifTitleRow: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    verifTitleText: { fontSize: '1.1rem', fontWeight: '700', color: '#064e3b' },
    verifDescText: { fontSize: '0.9rem', color: '#374151', margin: '0.1rem 0' },
    verifDateText: { fontSize: '0.85rem', color: '#10b981', fontWeight: '600' },

    // Fund Utilization Styles
    fundHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
    verifiedExpensesPill: {
        backgroundColor: '#dcfce7',
        padding: '0.5rem 1.25rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '1rem',
        fontWeight: '700',
        color: '#059669',
        border: '1px solid #10b981'
    },
    expenseRatio: { marginLeft: '1rem' },
    fundListGrid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    fundCardCompact: { backgroundColor: '#fff', borderRadius: '16px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' },
    fundInfoCompact: { flex: 1 },
    fundTitleLine: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' },
    fundTitleName: { fontWeight: '700', fontSize: '1rem', color: '#1e293b' },
    verifiedTagMini: { fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '700' },
    pendingTag: { fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '700', opacity: 0.8 },
    fundDescMini: { fontSize: '0.85rem', color: '#64748b', margin: 0 },
    fundAmountCompact: { fontWeight: '800', fontSize: '1.1rem', color: '#1e293b' },

    // Updates Styles
    timelineCompact: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    timelineItemCompact: { display: 'flex', gap: '1.5rem', alignItems: 'flex-start' },
    timelineIconBox: { width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.5rem' },
    timelineCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', flex: 1, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    updateDateCompact: { fontSize: '0.9rem', color: '#64748b', fontWeight: '600', marginBottom: '0.25rem' },
    updateTitleCompact: { fontSize: '1.1rem', fontWeight: '700', color: '#4f46e5', margin: '0 0 0.75rem 0' },
    updateTextCompact: { fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.5', margin: 0 },

    // Sidebar Styles
    rightCol: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    sideCardCompact: { backgroundColor: '#fff', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' },
    sideLabelCompact: { fontSize: '0.9rem', color: '#64748b', marginBottom: '1.25rem', fontWeight: '600' },
    organizerInfoBox: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' },
    avatarCompact: { width: '56px', height: '56px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '800', color: '#475569' },
    hospitalIconCircle: { width: '56px', height: '56px', backgroundColor: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    organizerMetaBox: { flex: 1 },
    sideNameCompact: { fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', display: 'block' },
    sideSubCompact: { fontSize: '0.9rem', color: '#64748b', margin: 0 },
    verifiedTagAction: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '700', justifyContent: 'center', backgroundColor: '#f0fdf4', padding: '0.5rem', borderRadius: '12px' }
};

export default CampaignDetails;

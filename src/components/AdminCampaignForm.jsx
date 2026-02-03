import React, { useState, useEffect } from 'react';
import { X, Save, Upload } from 'lucide-react';

const AdminCampaignForm = ({ isOpen, onClose, onSave, campaign = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'Medical',
        goal: '',
        raised: '0',
        about: '',
        organizerName: '',
        hospitalName: '',
        isActive: true,
        type: 'campaign'
    });

    useEffect(() => {
        if (campaign) {
            setFormData({
                title: campaign.title || '',
                category: campaign.category || 'Medical',
                goal: campaign.goal || '',
                raised: campaign.raised || '0',
                about: Array.isArray(campaign.about) ? campaign.about.join('\n\n') : (campaign.about || ''),
                organizerName: campaign.organizer?.name || '',
                hospitalName: campaign.hospital?.name || '',
                isActive: campaign.isActive ?? true,
                type: campaign.type || 'campaign'
            });
        } else {
            setFormData({
                title: '',
                category: 'Medical',
                goal: '',
                raised: '0',
                about: '',
                organizerName: '',
                hospitalName: '',
                isActive: true,
                type: 'campaign'
            });
        }
    }, [campaign, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            id: campaign?.id,
            goal: Number(formData.goal),
            raised: Number(formData.raised),
            about: formData.about.split('\n\n'),
            organizer: { name: formData.organizerName, initials: formData.organizerName.charAt(0) },
            hospital: { name: formData.hospitalName, sub: 'Location Pending' }
        };
        onSave(formattedData);
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <header style={styles.header}>
                    <h2 style={styles.title}>{campaign ? 'Edit Campaign' : 'Create New Campaign'}</h2>
                    <button onClick={onClose} style={styles.closeBtn}><X size={24} /></button>
                </header>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Campaign Title*</label>
                            <input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                style={styles.input}
                                placeholder="e.g. Help Ayaan's Surgery"
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                style={styles.input}
                            >
                                <option>Medical</option>
                                <option>Social</option>
                                <option>Individual</option>
                                <option>Education</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Goal Amount (Rs.)*</label>
                            <input
                                required
                                type="number"
                                value={formData.goal}
                                onChange={e => setFormData({ ...formData, goal: e.target.value })}
                                style={styles.input}
                                placeholder="1000000"
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Raised Amount (Rs.)</label>
                            <input
                                type="number"
                                value={formData.raised}
                                onChange={e => setFormData({ ...formData, raised: e.target.value })}
                                style={styles.input}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>About / Description (Use double newlines for paragraphs)*</label>
                        <textarea
                            required
                            value={formData.about}
                            onChange={e => setFormData({ ...formData, about: e.target.value })}
                            style={{ ...styles.input, height: '150px', resize: 'vertical' }}
                            placeholder="Describe the campaign..."
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Organizer Name</label>
                            <input
                                value={formData.organizerName}
                                onChange={e => setFormData({ ...formData, organizerName: e.target.value })}
                                style={styles.input}
                                placeholder="Mr. Rashid Hassan"
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Hospital/Center Name</label>
                            <input
                                value={formData.hospitalName}
                                onChange={e => setFormData({ ...formData, hospitalName: e.target.value })}
                                style={styles.input}
                                placeholder="Base Hospital Welimada"
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Status</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                            Active and Visible on Site
                        </label>
                    </div>

                    <div style={styles.footer}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                        <button type="submit" style={styles.saveBtn}>
                            <Save size={18} /> {campaign ? 'Update Campaign' : 'Create Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '2rem' },
    modal: { backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
    header: { padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' },
    closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' },
    form: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.9rem', fontWeight: '600', color: '#475569' },
    input: { padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' },
    footer: { marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' },
    cancelBtn: { padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white', fontWeight: '600', cursor: 'pointer' },
    saveBtn: { padding: '0.75rem 2rem', borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }
};

export default AdminCampaignForm;

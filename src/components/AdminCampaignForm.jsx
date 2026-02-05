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
                type: campaign.type || 'campaign',
                image: campaign.image || null,
                deadline: campaign.deadline || '',
                fundUtilization: campaign.fundUtilization || [],
                updates: campaign.updates || []
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
                type: 'campaign',
                image: null,
                deadline: '',
                fundUtilization: [],
                updates: []
            });
        }
    }, [campaign, isOpen]);

    const handleAddFund = () => {
        setFormData({
            ...formData,
            fundUtilization: [...formData.fundUtilization, { title: '', amount: '', desc: '', date: 'Verified' }]
        });
    };

    const handleRemoveFund = (index) => {
        const newFunds = formData.fundUtilization.filter((_, i) => i !== index);
        setFormData({ ...formData, fundUtilization: newFunds });
    };

    const handleFundChange = (index, field, value) => {
        const newFunds = [...formData.fundUtilization];
        newFunds[index] = { ...newFunds[index], [field]: field === 'amount' ? Number(value) : value };
        setFormData({ ...formData, fundUtilization: newFunds });
    };

    const handleAddUpdate = () => {
        setFormData({
            ...formData,
            updates: [...formData.updates, { title: '', date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'), content: '' }]
        });
    };

    const handleRemoveUpdate = (index) => {
        const newUpdates = formData.updates.filter((_, i) => i !== index);
        setFormData({ ...formData, updates: newUpdates });
    };

    const handleUpdateChange = (index, field, value) => {
        const newUpdates = [...formData.updates];
        newUpdates[index] = { ...newUpdates[index], [field]: value };
        setFormData({ ...formData, updates: newUpdates });
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                ...formData,
                goal: Number(formData.goal),
                raised: Number(formData.raised),
                about: formData.about.split('\n\n'),
                organizer: { name: formData.organizerName, initials: formData.organizerName.charAt(0) },
                hospital: { name: formData.hospitalName, sub: 'Location Pending' }
            };

            // Only add ID if we are editing an existing campaign
            if (campaign?.id) {
                formattedData.id = campaign.id;
            }

            await onSave(formattedData);
            onClose();
        } catch (error) {
            alert("Failed to save campaign. Please try again. " + error.message);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <header style={styles.header}>
                    <h2 style={styles.title}>{campaign ? 'Edit Campaign' : 'Create New Campaign'}</h2>
                    <button onClick={onClose} style={styles.closeBtn}><X size={24} /></button>
                </header>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Campaign Image</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {formData.image && (
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                            )}
                            <label style={styles.uploadBtn}>
                                <Upload size={18} />
                                {formData.image ? 'Change Image' : 'Upload Image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 800 * 1024) { // 800KB limit
                                                alert("Image is too large. Please upload an image smaller than 800KB.");
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, image: reader.result });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>

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
                        <label style={styles.label}>Campaign Deadline</label>
                        <input
                            type="date"
                            value={formData.deadline}
                            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>About / Description (Use double newlines for paragraphs)*</label>
                        <textarea
                            required
                            value={formData.about}
                            onChange={e => setFormData({ ...formData, about: e.target.value })}
                            style={{ ...styles.input, height: '120px', resize: 'vertical' }}
                            placeholder="Describe the campaign story..."
                        />
                    </div>

                    {/* Fund Utilization Section */}
                    <div style={styles.section}>
                        <h4 style={styles.sectionHeader}>Fund Utilization</h4>
                        {formData.fundUtilization.map((fund, index) => (
                            <div key={index} style={styles.listItemBox}>
                                <div style={styles.row}>
                                    <input
                                        placeholder="Title (e.g. Surgery Cost)"
                                        value={fund.title}
                                        onChange={(e) => handleFundChange(index, 'title', e.target.value)}
                                        style={styles.input}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={fund.amount}
                                        onChange={(e) => handleFundChange(index, 'amount', e.target.value)}
                                        style={styles.input}
                                    />
                                </div>
                                <input
                                    placeholder="Description"
                                    value={fund.desc}
                                    onChange={(e) => handleFundChange(index, 'desc', e.target.value)}
                                    style={{ ...styles.input, marginTop: '0.5rem' }}
                                />
                                <button type="button" onClick={() => handleRemoveFund(index)} style={styles.removeBtn}>Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddFund} style={styles.addItemBtn}>+ Add Fund Item</button>
                    </div>

                    {/* Updates Section */}
                    <div style={styles.section}>
                        <h4 style={styles.sectionHeader}>Campaign Updates</h4>
                        {formData.updates.map((update, index) => (
                            <div key={index} style={styles.listItemBox}>
                                <div style={styles.row}>
                                    <input
                                        placeholder="Title (e.g. Surgery Successful)"
                                        value={update.title}
                                        onChange={(e) => handleUpdateChange(index, 'title', e.target.value)}
                                        style={styles.input}
                                    />
                                    <input
                                        placeholder="Date (DD.MM.YYYY)"
                                        value={update.date}
                                        onChange={(e) => handleUpdateChange(index, 'date', e.target.value)}
                                        style={styles.input}
                                    />
                                </div>
                                <textarea
                                    placeholder="Update Content..."
                                    value={update.content}
                                    onChange={(e) => handleUpdateChange(index, 'content', e.target.value)}
                                    style={{ ...styles.input, height: '80px', marginTop: '0.5rem' }}
                                />
                                <button type="button" onClick={() => handleRemoveUpdate(index)} style={styles.removeBtn}>Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddUpdate} style={styles.addItemBtn}>+ Add Update</button>
                    </div>

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

                    <div style={styles.actions}>
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
    saveBtn: { padding: '0.75rem 2rem', borderRadius: '12px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    uploadBtn: {
        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
        backgroundColor: '#f1f5f9', borderRadius: '8px', cursor: 'pointer',
        fontSize: '0.9rem', color: '#64748b', border: '1px solid #cbd5e1'
    },
    section: { marginBottom: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' },
    sectionHeader: { margin: '0 0 1rem 0', color: '#334155', fontSize: '1rem' },
    listItemBox: { backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0' },
    addItemBtn: {
        backgroundColor: '#eff6ff', color: '#2563eb', border: '1px dashed #bfdbfe',
        padding: '0.75rem', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 600
    },
    removeBtn: {
        backgroundColor: 'transparent', color: '#ef4444', border: 'none',
        fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.5rem', textDecoration: 'underline'
    },
    actions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' },
};

export default AdminCampaignForm;

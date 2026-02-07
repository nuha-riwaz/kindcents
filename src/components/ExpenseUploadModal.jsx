import React, { useState, useRef } from 'react';
import { X, Upload, Check, Loader2, IndianRupee, FileText } from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';

const ExpenseUploadModal = ({ isOpen, onClose, campaignId, userId }) => {
    const { addExpense } = useCampaigns();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert("File too large. Max 1MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setImage(reader.result); // Storing base64 for simplicity
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !description || !image) {
            alert("Please fill all fields and upload an image.");
            return;
        }

        setUploading(true);
        try {
            await addExpense({
                campaignId,
                userId,
                amount: parseFloat(amount),
                description,
                image,
                status: 'Pending' // Optional: if you want admin approval for expenses too
            });
            onClose();
            setAmount('');
            setDescription('');
            setImage(null);
            setPreview(null);
            alert("Expense uploaded successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload expense.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Upload Proof of Expense</h3>
                    <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Amount Spent (Rs.)</label>
                        <div style={styles.inputWrapper}>
                            <IndianRupee size={16} color="#64748b" style={styles.inputIcon} />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Description</label>
                        <div style={styles.inputWrapper}>
                            <FileText size={16} color="#64748b" style={styles.inputIcon} />
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. Purchased medical supplies"
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Receipt / Photo Proof</label>
                        <div
                            style={styles.uploadBox}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" style={styles.previewImg} />
                            ) : (
                                <div style={styles.uploadPlaceholder}>
                                    <Upload size={24} color="#3b82f6" />
                                    <span>Click to upload image</span>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <button type="submit" style={styles.submitBtn} disabled={uploading}>
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                        {uploading ? 'Uploading...' : 'Submit Expense'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    },
    modal: {
        backgroundColor: 'white', borderRadius: '16px', width: '90%', maxWidth: '400px', padding: '1.5rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    title: { fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', margin: 0 },
    closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.9rem', fontWeight: '600', color: '#475569' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputIcon: { position: 'absolute', left: '10px' },
    input: {
        width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1',
        fontSize: '0.95rem', outline: 'none'
    },
    uploadBox: {
        border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        minHeight: '120px', backgroundColor: '#f8fafc'
    },
    uploadPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' },
    previewImg: { maxWidth: '100%', maxHeight: '150px', borderRadius: '4px' },
    submitBtn: {
        backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '0.75rem',
        fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        marginTop: '0.5rem'
    }
};

export default ExpenseUploadModal;

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Check, Loader2, FileText } from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
// import { storage } from '../firebase'; // Removed storage
// import { ref, uploadString, getDownloadURL } from 'firebase/storage'; // Removed storage

const ExpenseUploadModal = ({ isOpen, onClose, campaignId, userId }) => {
    const { addExpense } = useCampaigns();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Add styles for hover effects
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .hover-btn-blue:hover { background-color: #2563eb !important; transform: translateY(-1px); }
            .hover-btn-ghost-gray:hover { background-color: #f1f5f9 !important; }
            .hover-upload-box:hover { background-color: #eff6ff !important; border-color: #3b82f6 !important; }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    if (!isOpen) return null;

    // Helper to compress image
    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Resize to max width 800px
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Compress to JPEG with 0.7 quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedDataUrl);
                };
            };
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert("Please upload an image file.");
                return;
            }

            try {
                // Compress immediately on selection
                const compressed = await compressImage(file);
                setImage(compressed);
                setPreview(compressed);
            } catch (err) {
                console.error("Compression error:", err);
                alert("Failed to process image.");
            }
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
            // Check size (Base64 string length * 0.75 gives approx bytes)
            const sizeInBytes = image.length * 0.75;
            if (sizeInBytes > 950000) { // Safety buffer for 1MB limit
                alert("Image is still too large. Please pick a smaller image.");
                setUploading(false);
                return;
            }

            await addExpense({
                campaignId,
                userId,
                amount: parseFloat(amount),
                description,
                image: image, // Saving Base64 directly to Firestore
                status: 'Pending'
            });

            onClose();
            setAmount('');
            setDescription('');
            setImage(null);
            setPreview(null);
            alert("Expense uploaded successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to save expense details: " + error.message);
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
                            <span style={{ position: 'absolute', left: '12px', color: '#64748b', fontWeight: '500', fontSize: '0.9rem' }}>Rs.</span>
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
                            className="hover-upload-box"
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

                    <button type="submit" style={styles.submitBtn} disabled={uploading} className="hover-btn-blue">
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

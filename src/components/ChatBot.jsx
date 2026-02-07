import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, MoreVertical, ChevronDown, Paperclip, Smile, ChevronLeft } from 'lucide-react';
import logo from '../assets/logo.png';
import { faqData } from '../data/kindbotData';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi 👋 I'm KindBot. How can I help you today?", isBot: true, type: 'text' }
    ]);
    const [mode, setMode] = useState('chat'); // 'chat' or 'contact'
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Auto-scroll ref
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, mode]);

    const toggleChat = () => setIsOpen(!isOpen);

    // Helper to add a user message
    const addUserMessage = (text) => {
        setMessages(prev => [...prev, { id: Date.now(), text, isBot: false, type: 'text' }]);
    };

    // Helper to add a bot message with delay
    const addBotMessage = (text, type = 'text', options = []) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text,
                isBot: true,
                type,
                options
            }]);
            setIsTyping(false);
        }, 800);
    };

    // Initial Options
    useEffect(() => {
        if (messages.length === 1 && isOpen) {
            const categories = faqData.categories.map(c => ({ label: c.label, value: c.id, icon: c.icon }));
            categories.push({ label: "Contact Admin", value: "contact_admin", icon: "📧" });

            addBotMessage("Please select a topic below:", 'options', categories);
        }
    }, [isOpen]);

    const handleOptionClick = (option) => {
        addUserMessage(option.label);

        if (option.value === 'contact_admin') {
            setMode('contact');
            addBotMessage("Sure, I can help you contact an admin. Please fill out the form below:", 'text');
            return;
        }

        if (option.value === 'go_back') {
            const categories = faqData.categories.map(c => ({ label: c.label, value: c.id, icon: c.icon }));
            categories.push({ label: "Contact Admin", value: "contact_admin", icon: "📧" });
            addBotMessage("How else can I help you?", 'options', categories);
            return;
        }

        // It's a category
        const categoryQuestions = faqData[option.value];
        if (categoryQuestions) {
            const questionOptions = categoryQuestions.map((q, index) => ({
                label: q.q,
                value: `q_${option.value}_${index}`,
                answer: q.a
            }));
            questionOptions.push({ label: "⬅️ Go Back", value: "go_back" });

            addBotMessage(`Here are some common questions about ${option.label}:`, 'options', questionOptions);
        }
    };

    const handleQuestionClick = (option) => {
        addUserMessage(option.label);

        if (option.value === 'go_back') {
            const categories = faqData.categories.map(c => ({ label: c.label, value: c.id, icon: c.icon }));
            categories.push({ label: "Contact Admin", value: "contact_admin", icon: "📧" });
            addBotMessage("What else can I help you with?", 'options', categories);
            return;
        }

        // Show Answer
        addBotMessage(option.answer);

        // Follow up options
        setTimeout(() => {
            addBotMessage("Did that help?", 'options', [
                { label: "Yes, thanks!", value: "go_back" },
                { label: "No, contact admin", value: "contact_admin" }
            ]);
        }, 1500);
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        if (!contactForm.name || !contactForm.email || !contactForm.message) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "contact_requests"), {
                ...contactForm,
                createdAt: serverTimestamp(),
                status: 'new'
            });

            setMode('chat');
            setContactForm({ name: '', email: '', message: '' });
            addUserMessage("Message Sent");
            addBotMessage("Your message has been sent successfully! An admin will get back to you shortly.");

            // Return to main menu
            setTimeout(() => {
                const categories = faqData.categories.map(c => ({ label: c.label, value: c.id, icon: c.icon }));
                categories.push({ label: "Contact Admin", value: "contact_admin", icon: "📧" });
                addBotMessage("Is there anything else?", 'options', categories);
            }, 2000);

        } catch (error) {
            console.error("Error sending message: ", error);
            addBotMessage("Something went wrong. Please try again later.");
        }
        setIsSubmitting(false);
    };

    // Fuzzy Search Helper
    const findBestMatch = (input) => {
        const lowerInput = input.toLowerCase();
        let bestMatch = null;
        let maxScore = 0;

        // Flatten all questions
        const allQuestions = [
            ...faqData.general,
            ...faqData.donor,
            ...faqData.ngo,
            ...faqData.individual
        ];

        allQuestions.forEach(q => {
            const words = q.q.toLowerCase().split(" ");
            let score = 0;
            words.forEach(word => {
                if (lowerInput.includes(word) && word.length > 3) {
                    score++;
                }
            });
            if (score > maxScore) {
                maxScore = score;
                bestMatch = q;
            }
        });

        // Simple threshold match
        if (maxScore >= 1) { // At least one significant word match
            return bestMatch;
        }
        return null;
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!contactForm.message && mode === 'chat') {
            // Handle chat input
            const text = e.target.elements.messageInput.value.trim();
            if (!text) return;

            e.target.elements.messageInput.value = "";
            addUserMessage(text);

            // Check for keywords
            const match = findBestMatch(text);

            if (match) {
                addBotMessage(match.a);
                setTimeout(() => {
                    addBotMessage("Did that answer your question?", 'options', [
                        { label: "Yes, thanks!", value: "go_back" },
                        { label: "No", value: "contact_admin" }
                    ]);
                }, 1500);
            } else {
                addBotMessage("I'm not sure about that one. Would you like to contact an admin?", 'options', [
                    { label: "Contact Admin", value: "contact_admin" },
                    { label: "Show Menu", value: "go_back" }
                ]);
            }
            return;
        }
    };

    return (
        <div style={styles.wrapper}>
            {isOpen && (
                <div style={styles.chatWindow}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={styles.headerLeft}>
                            <div style={styles.logoContainer}>
                                <img src={logo} alt="KindCents" style={styles.headerLogo} />
                            </div>
                            <div style={styles.headerText}>
                                <span style={styles.chatWith}>Chat with</span>
                                <span style={styles.botName}>KindBot</span>
                                <div style={styles.statusLine}>
                                    <div style={styles.statusDot}></div>
                                    <span style={styles.statusText}>Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={toggleChat} style={styles.iconBtn}><ChevronDown size={20} color="#64748b" /></button>
                    </div>

                    {/* Content Area */}
                    <div style={styles.messagesArea}>
                        {mode === 'chat' ? (
                            <>
                                {messages.map(msg => (
                                    <div key={msg.id} style={{
                                        ...styles.messageRow,
                                        justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
                                    }}>
                                        {!msg.type || msg.type === 'text' ? (
                                            <div style={{
                                                ...styles.messageBubble,
                                                backgroundColor: msg.isBot ? '#f0f7ff' : '#4F96FF',
                                                color: msg.isBot ? '#334155' : 'white',
                                                borderRadius: msg.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                                                border: msg.isBot ? '1px solid #e2e8f0' : 'none',
                                            }}>
                                                {msg.text}
                                            </div>
                                        ) : msg.type === 'options' ? (
                                            <div style={styles.optionsContainer}>
                                                <div style={{
                                                    ...styles.messageBubble,
                                                    backgroundColor: '#f0f7ff',
                                                    color: '#334155',
                                                    borderRadius: '16px 16px 16px 4px',
                                                    marginBottom: '8px'
                                                }}>
                                                    {msg.text}
                                                </div>
                                                <div style={styles.optionsGrid}>
                                                    {msg.options.map((opt, idx) => (
                                                        <button
                                                            key={idx}
                                                            style={styles.optionBtn}
                                                            onClick={() => opt.answer ? handleQuestionClick(opt) : handleOptionClick(opt)}
                                                        >
                                                            {opt.icon && <span style={{ marginRight: '6px' }}>{opt.icon}</span>}
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                                {isTyping && (
                                    <div style={styles.messageRow}>
                                        <div style={{ ...styles.messageBubble, backgroundColor: '#f0f7ff', border: '1px solid #e2e8f0', borderRadius: '16px 16px 16px 4px' }}>
                                            <div style={styles.typingIndicator}>
                                                <span></span><span></span><span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={styles.formContainer}>
                                <h3 style={styles.formTitle}>Contact Support</h3>
                                <p style={styles.formSubtitle}>We typically reply within 24 hours.</p>
                                <form onSubmit={handleContactSubmit}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Name</label>
                                        <input
                                            style={styles.input}
                                            value={contactForm.name}
                                            onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                                            required
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Email</label>
                                        <input
                                            style={styles.input}
                                            type="email"
                                            value={contactForm.email}
                                            onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                            required
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Message</label>
                                        <textarea
                                            style={styles.textarea}
                                            value={contactForm.message}
                                            onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                                            required
                                            placeholder="How can we help?"
                                            rows={4}
                                        />
                                    </div>
                                    <div style={styles.formActions}>
                                        <button type="button" onClick={() => setMode('chat')} style={styles.cancelBtn}>Cancel</button>
                                        <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input */}
                    {mode === 'chat' && (
                        <div style={styles.footer}>
                            <form onSubmit={handleSendMessage} style={styles.inputContainer}>
                                <input
                                    name="messageInput"
                                    type="text"
                                    placeholder="Type a question..."
                                    style={styles.input}
                                    autoComplete="off"
                                />
                                <button type="submit" style={styles.sendBtn}>
                                    <Send size={16} color="white" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}

            <button onClick={toggleChat} style={styles.floatingButton}>
                {isOpen ? <ChevronDown size={28} color="white" /> : <MessageCircle size={28} color="white" />}
                {!isOpen && <div style={styles.notificationDot}></div>}
            </button>
        </div>
    );
};

// Styles
const styles = {
    wrapper: {
        position: 'fixed',
        bottom: '25px',
        right: '25px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        fontFamily: "'Inter', sans-serif",
    },
    floatingButton: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#4F96FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(79, 150, 255, 0.4)',
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    notificationDot: {
        position: 'absolute',
        top: '2px',
        right: '2px',
        width: '10px',
        height: '10px',
        backgroundColor: '#fb923c',
        borderRadius: '50%',
        border: '2px solid white',
    },
    chatWindow: {
        width: '340px',
        height: '450px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        marginBottom: '10px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        animation: 'slideUp 0.3s ease-out',
    },
    header: {
        padding: '12px 16px',
        backgroundColor: '#dbeafe',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #bfdbfe',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    logoContainer: {
        backgroundColor: 'white',
        padding: '3px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerLogo: {
        height: '32px',
        objectFit: 'contain',
    },
    headerText: {
        display: 'flex',
        flexDirection: 'column',
    },
    chatWith: {
        fontSize: '0.8rem',
        color: '#475569',
        lineHeight: '1',
    },
    botName: {
        fontSize: '1.2rem',
        fontWeight: '800',
        color: '#1e293b',
        lineHeight: '1.1',
    },
    statusLine: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '1px',
    },
    statusDot: {
        width: '6px',
        height: '6px',
        backgroundColor: '#22c55e',
        borderRadius: '50%',
    },
    statusText: {
        fontSize: '0.7rem',
        color: '#64748b',
        fontStyle: 'italic',
    },
    iconBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    messagesArea: {
        flex: 1,
        padding: '15px',
        overflowY: 'auto',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingBottom: '0', // Adjust for footer
    },
    messageRow: {
        display: 'flex',
        width: '100%',
    },
    messageBubble: {
        maxWidth: '85%',
        padding: '10px 14px',
        fontSize: '0.9rem',
        lineHeight: '1.4',
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '90%',
    },
    optionsGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    optionBtn: {
        padding: '8px 12px',
        backgroundColor: 'white',
        border: '1px solid #4F96FF',
        borderRadius: '8px',
        color: '#4F96FF',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
    },
    typingIndicator: {
        display: 'flex',
        gap: '3px',
    },
    // Form Styles
    formContainer: {
        padding: '10px',
    },
    formTitle: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '4px',
    },
    formSubtitle: {
        fontSize: '0.9rem',
        color: '#64748b',
        marginBottom: '16px',
    },
    formGroup: {
        marginBottom: '12px',
    },
    label: {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#475569',
        marginBottom: '4px',
    },
    input: {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '0.9rem',
        outline: 'none',
    },
    textarea: {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '0.9rem',
        outline: 'none',
        resize: 'vertical',
    },
    formActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '16px',
    },
    cancelBtn: {
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#f1f5f9',
        color: '#64748b',
        fontWeight: '600',
        cursor: 'pointer',
    },
    submitBtn: {
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4F96FF',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
    },
    // Footer Styles from original
    footer: {
        padding: '10px 16px 14px',
        borderTop: '1px solid #f1f5f9',
        backgroundColor: 'white',
        position: 'relative',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    sendBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#4F96FF',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
};

export default ChatBot;

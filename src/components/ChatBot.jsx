import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm the KindCents AI Assistant. How can I help you today?", isBot: true }
    ]);
    const [inputText, setInputText] = useState("");

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), text: inputText, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");

        // Simulate AI response
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                text: "Thanks for your message! This is a demo of the AI assistant. In a real app, I would answer your question about donations or projects.",
                isBot: true
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <div style={styles.wrapper}>
            {isOpen && (
                <div style={styles.chatWindow}>
                    <div style={styles.header}>
                        <div style={styles.headerTitle}>
                            <div style={styles.statusDot}></div>
                            <span>KindCents Assistant</span>
                        </div>
                        <button onClick={toggleChat} style={styles.closeBtn}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={styles.messagesArea}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{
                                ...styles.message,
                                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                                backgroundColor: msg.isBot ? '#F1F5F9' : '#4F96FF',
                                color: msg.isBot ? '#1e293b' : 'white',
                                borderRadius: msg.isBot ? '12px 12px 12px 0' : '12px 12px 0 12px',
                            }}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} style={styles.inputArea}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            style={styles.input}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <button type="submit" style={styles.sendBtn}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            <button onClick={toggleChat} style={styles.chatButton}>
                <MessageCircle size={32} color="white" />
                {!isOpen && <div style={styles.notificationDot}></div>}
            </button>
        </div>
    );
};

const styles = {
    wrapper: {
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    chatButton: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#4F96FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(79, 150, 255, 0.4)',
        cursor: 'pointer',
        border: 'none',
        position: 'relative',
        transition: 'transform 0.2s',
    },
    notificationDot: {
        position: 'absolute',
        top: '0',
        right: '0',
        width: '12px',
        height: '12px',
        backgroundColor: '#FB923C',
        borderRadius: '50%',
        border: '2px solid white',
    },
    chatWindow: {
        width: '350px',
        height: '450px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
    },
    header: {
        padding: '16px 20px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontWeight: '600',
        color: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    statusDot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#22c55e', // Green for online
        borderRadius: '50%',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#64748b',
        padding: '4px',
    },
    messagesArea: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: '#f8fafc',
    },
    message: {
        maxWidth: '80%',
        padding: '10px 16px',
        fontSize: '0.95rem',
        lineHeight: '1.4',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    inputArea: {
        padding: '16px',
        backgroundColor: 'white',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        gap: '10px',
    },
    input: {
        flex: 1,
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '10px 16px',
        outline: 'none',
        fontSize: '0.95rem',
    },
    sendBtn: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#4F96FF',
        color: 'white',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    }
};

export default ChatBot;

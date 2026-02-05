import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, MoreVertical, ChevronDown, Paperclip, Smile } from 'lucide-react';
import logo from '../assets/logo.png';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi 👋 How can I help you?", isBot: true }
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const commonEmojis = ["😊", "👋", "❤️", "🙌", "👍", "✨", "🙏", "💡", "🔥", "✅"];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const toggleChat = () => setIsOpen(!isOpen);

    const getBotResponse = (text) => {
        const input = text.toLowerCase();
        if (input.includes("how") && input.includes("donate")) {
            return "To donate, simply click the 'Donate Now' button on any campaign page. You'll be guided through a secure payment process!";
        }
        if (input.includes("who") || input.includes("what is kindcents")) {
            return "KindCents is a transparent donation tracking platform based in Sri Lanka. We ensure every cent you donate reaches its intended cause!";
        }
        if (input.includes("hello") || input.includes("hi")) {
            return "Hello! I'm KindBot. I'm here to help you with any questions about our platform or active campaigns.";
        }
        if (input.includes("campaign") || input.includes("project")) {
            return "You can browse all our active campaigns on the 'Campaigns' page. We have medical, social, and individual causes that need your support!";
        }
        return "That's a great question! I'm still learning, but I can tell you that KindCents is dedicated to transparent giving. Would you like to know more about how to donate or our active campaigns?";
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), text: inputText, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);
        setShowEmojiPicker(false);

        // Simulate AI response delay
        setTimeout(() => {
            const response = getBotResponse(userMsg.text);
            const botMsg = {
                id: Date.now() + 1,
                text: response,
                isBot: true
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleEmojiClick = (emoji) => {
        setInputText(prev => prev + emoji);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const userMsg = {
                    id: Date.now(),
                    text: "Sent an image",
                    imageUrl: event.target.result,
                    isBot: false
                };
                setMessages(prev => [...prev, userMsg]);

                setIsTyping(true);
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        text: "Thanks for sharing! That looks interesting. How can I help you with this?",
                        isBot: true
                    }]);
                    setIsTyping(false);
                }, 1500);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={styles.wrapper}>
            {isOpen && (
                <div style={styles.chatWindow}>
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
                                    <span style={styles.statusText}>Online • responds immediately</span>
                                </div>
                            </div>
                        </div>
                        <div style={styles.headerRight}>
                            <button style={styles.iconBtn}><MoreVertical size={18} color="#64748b" /></button>
                            <button onClick={toggleChat} style={styles.iconBtn}><ChevronDown size={20} color="#64748b" /></button>
                        </div>
                    </div>

                    <div style={styles.messagesArea}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{
                                ...styles.messageRow,
                                justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
                            }}>
                                <div style={{
                                    ...styles.messageBubble,
                                    backgroundColor: msg.isBot ? '#f0f7ff' : '#4F96FF',
                                    color: msg.isBot ? '#334155' : 'white',
                                    borderRadius: msg.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                                    border: msg.isBot ? '1px solid #e2e8f0' : 'none',
                                    textAlign: 'left', // Aligns text to left for ALL bubbles
                                }}>
                                    {msg.imageUrl && (
                                        <img src={msg.imageUrl} alt="Uploaded" style={{
                                            ...styles.messageImage,
                                            marginLeft: '0',
                                            marginRight: 'auto',
                                        }} />
                                    )}
                                    {msg.text}
                                </div>
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
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={styles.footer}>
                        {showEmojiPicker && (
                            <div style={styles.emojiPicker}>
                                {commonEmojis.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => handleEmojiClick(emoji)}
                                        style={styles.emojiBtn}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} style={styles.inputContainer}>
                            <input
                                type="text"
                                placeholder="Enter your message..."
                                style={styles.input}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <button type="submit" style={styles.sendBtn}>
                                <Send size={16} color="white" />
                            </button>
                        </form>
                        <div style={styles.footerActions}>
                            <div style={styles.leftActions}>
                                <button
                                    style={styles.utilityBtn}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <Paperclip size={16} color="#64748b" />
                                </button>
                                <button
                                    style={styles.utilityBtn}
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <Smile size={16} color="#64748b" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button onClick={toggleChat} style={styles.floatingButton}>
                {isOpen ? <ChevronDown size={28} color="white" /> : <MessageCircle size={28} color="white" />}
                {!isOpen && <div style={styles.notificationDot}></div>}
            </button>
        </div>
    );
};

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
        width: '320px',
        height: '500px',
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
        fontSize: '0.9rem',
        color: '#475569',
        lineHeight: '1',
    },
    botName: {
        fontSize: '1.4rem',
        fontWeight: '800',
        color: '#1e293b',
        lineHeight: '1.1',
        letterSpacing: '-0.5px',
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
    headerRight: {
        display: 'flex',
        gap: '2px',
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
    },
    messageRow: {
        display: 'flex',
        width: '100%',
    },
    messageBubble: {
        maxWidth: '85%',
        padding: '10px 14px',
        fontSize: '0.85rem',
        lineHeight: '1.4',
    },
    messageImage: {
        width: '100%',
        maxHeight: '150px',
        borderRadius: '8px',
        marginBottom: '6px',
        objectFit: 'cover',
    },
    footer: {
        padding: '10px 16px 14px',
        borderTop: '1px solid #f1f5f9',
        backgroundColor: 'white',
        position: 'relative',
    },
    emojiPicker: {
        position: 'absolute',
        bottom: '100%',
        left: '16px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '8px',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '4px',
        marginBottom: '4px',
        zIndex: 10,
    },
    emojiBtn: {
        background: 'none',
        border: 'none',
        fontSize: '1.2rem',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    input: {
        flex: 1,
        border: 'none',
        outline: 'none',
        fontSize: '0.9rem',
        color: '#334155',
        backgroundColor: 'transparent',
    },
    sendBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#dbeafe',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    footerActions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '6px',
    },
    leftActions: {
        display: 'flex',
        gap: '10px',
    },
    utilityBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    typingIndicator: {
        display: 'flex',
        gap: '3px',
    }
};

export default ChatBot;

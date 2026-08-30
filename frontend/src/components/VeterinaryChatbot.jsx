import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Trash2,
  AlertTriangle,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { sendChatMessage } from '../api/client';

const QUICK_PROMPTS = [
  { label: '🐶 My dog is vomiting', query: 'My dog has been vomiting. What should I do and when is it an emergency?' },
  { label: '🐱 My cat is not eating', query: 'My cat has stopped eating for the past 24 hours. What could be the reason?' },
  { label: '🩹 Found injured stray', query: 'I found an injured stray dog on the street. How should I safely approach and help?' },
  { label: '💉 Puppy vaccinations', query: 'What is the recommended vaccination schedule for a new puppy?' },
  { label: '🍖 Toxic foods for pets', query: 'What common human foods are toxic or dangerous for dogs and cats?' },
  { label: '🚨 Is this an emergency?', query: 'What are the most critical warning signs that mean my pet needs emergency vet care right away?' }
];

export default function VeterinaryChatbot({ onOpenRescueModal }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'model',
      text: "Hello! I'm your **PawsCare Veterinary AI Assistant** 🐾. \n\nI can help answer your questions about pet health, common symptoms, safe first-aid remedies, diet safety, and preventive care. \n\n*How can I help your animal friend today?*",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, errorState]);

  const handleSend = async (messageToSend = null) => {
    const text = (messageToSend !== null ? messageToSend : inputMessage).trim();
    if (!text || isLoading) return;

    setErrorState(null);
    const userMsgId = `user-${Date.now()}`;
    const newMessages = [
      ...messages,
      { id: userMsgId, role: 'user', text, timestamp: new Date() }
    ];

    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation history for context memory
      const historyPayload = newMessages.slice(1, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const result = await sendChatMessage(text, historyPayload);

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'model',
          text: result.reply,
          isEmergency: result.isEmergency,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setErrorState({
        failedQuery: text,
        message: err.message || "I'm having trouble connecting right now. Please try again in a moment."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetry = () => {
    if (errorState?.failedQuery) {
      const retryText = errorState.failedQuery;
      // Remove last user message if it failed
      setMessages(prev => prev.filter(m => m.text !== retryText || m.role !== 'user'));
      handleSend(retryText);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: "Conversation cleared! What else would you like to know about your pet's health or care? 🐾",
        timestamp: new Date()
      }
    ]);
    setErrorState(null);
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '24px',
      border: '2px solid #E8DEF8',
      boxShadow: '0 12px 40px rgba(74, 20, 140, 0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '740px',
      maxHeight: '85vh'
    }}>
      
      {/* 1. Chatbot Header */}
      <div style={{
        background: 'linear-gradient(135deg, #F3E8FF 0%, #E8DEF8 50%, #D8F3DC 100%)',
        padding: '18px 24px',
        borderBottom: '1px solid #E8DEF8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#FFFFFF',
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(157, 78, 221, 0.2)'
          }}>
            🩺
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#2B2D42', fontWeight: 800 }}>
                PawsCare Veterinary Assistant 🐾
              </h3>
              <span style={{
                background: '#D8F3DC',
                color: '#1B4332',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={11} color="#52B788" /> Gemini 3.6 AI
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#5C677D', margin: '2px 0 0 0' }}>
              Ask questions about animal health, symptoms, first aid and pet care.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="btn-pastel-outline"
          title="Clear Conversation"
          style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.9)' }}
        >
          <Trash2 size={14} color="#5C677D" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Safety Notice Bar */}
      <div style={{
        background: '#FFF8E7',
        borderBottom: '1px solid #FFE599',
        padding: '8px 18px',
        fontSize: '0.78rem',
        color: '#8A5D00',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <AlertTriangle size={14} color="#E07A5F" style={{ flexShrink: 0 }} />
        <span>
          <strong>Educational Assistant:</strong> Not a substitute for a licensed veterinarian. In life-threatening emergencies, visit an animal hospital immediately.
        </span>
      </div>

      {/* 2. Messages Stream Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
        background: '#FAF6F0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: isUser ? '82%' : '90%',
                flexDirection: isUser ? 'row-reverse' : 'row'
              }}
            >
              {/* Avatar Icon */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: isUser ? 'linear-gradient(135deg, #FFCAD4 0%, #FFE5D9 100%)' : '#FFFFFF',
                border: isUser ? 'none' : '1px solid #E8DEF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                {isUser ? <User size={18} color="#7A3B2E" /> : <Bot size={20} color="#9D4EDD" />}
              </div>

              {/* Message Bubble */}
              <div style={{
                background: isUser
                  ? 'linear-gradient(135deg, #FFE5D9 0%, #FFCAD4 100%)'
                  : '#FFFFFF',
                color: isUser ? '#4A2E35' : '#2B2D42',
                padding: '16px 20px',
                borderRadius: isUser ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                border: isUser ? '1px solid #FFCAD4' : (msg.isEmergency ? '2px solid #E07A5F' : '1px solid #EAEAEA'),
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                fontSize: '0.94rem',
                lineHeight: '1.6',
                position: 'relative'
              }}>
                {/* Emergency Alert Tag */}
                {msg.isEmergency && (
                  <div style={{
                    background: '#FFF0F3',
                    border: '1px solid #FFCAD4',
                    color: '#C92A2A',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    marginBottom: '12px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={16} color="#C92A2A" /> Potential Urgent / Emergency Situation
                    </span>
                    <Link
                      to="/rescue"
                      style={{
                        color: '#C92A2A',
                        textDecoration: 'underline',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Report Stray Rescue <ArrowRight size={12} />
                    </Link>
                  </div>
                )}

                {/* Complete Rendered Markdown Content */}
                <div className="chatbot-markdown-content" style={{ wordBreak: 'break-word' }}>
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h3 style={{ margin: '14px 0 6px 0', color: '#1B4332', fontSize: '1.2rem', fontWeight: 800 }}>{children}</h3>,
                      h2: ({ children }) => <h4 style={{ margin: '14px 0 6px 0', color: '#1B4332', fontSize: '1.1rem', fontWeight: 800 }}>{children}</h4>,
                      h3: ({ children }) => <h4 style={{ margin: '14px 0 6px 0', color: '#1B4332', fontSize: '1.05rem', fontWeight: 800 }}>{children}</h4>,
                      h4: ({ children }) => <h5 style={{ margin: '12px 0 4px 0', color: '#1B4332', fontSize: '0.98rem', fontWeight: 700 }}>{children}</h5>,
                      p: ({ children }) => <p style={{ margin: '0 0 8px 0', lineHeight: '1.65' }}>{children}</p>,
                      ul: ({ children }) => <ul style={{ paddingLeft: '20px', margin: '4px 0 10px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>{children}</ul>,
                      ol: ({ children }) => <ol style={{ paddingLeft: '20px', margin: '4px 0 10px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>{children}</ol>,
                      li: ({ children }) => <li style={{ lineHeight: '1.55', marginBottom: '3px' }}>{children}</li>,
                      strong: ({ children }) => <strong style={{ color: isUser ? '#4A2E35' : '#1B4332', fontWeight: 700 }}>{children}</strong>,
                      hr: () => <hr style={{ border: 'none', borderTop: '1px solid #EAEAEA', margin: '12px 0' }} />,
                      blockquote: ({ children }) => (
                        <blockquote style={{
                          borderLeft: '4px solid #74C69D',
                          paddingLeft: '12px',
                          margin: '8px 0',
                          color: '#5C677D',
                          fontStyle: 'italic'
                        }}>
                          {children}
                        </blockquote>
                      )
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>

                <div style={{
                  fontSize: '0.7rem',
                  color: isUser ? '#7A3B2E' : '#8D99AE',
                  textAlign: 'right',
                  marginTop: '6px'
                }}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start', maxWidth: '75%' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: '#FFFFFF',
              border: '1px solid #E8DEF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bot size={20} color="#9D4EDD" />
            </div>

            <div style={{
              background: '#FFFFFF',
              padding: '14px 18px',
              borderRadius: '4px 20px 20px 20px',
              border: '1px solid #EAEAEA',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <Sparkles size={18} color="#9D4EDD" className="animate-spin" />
              <span style={{ fontSize: '0.9rem', color: '#5C677D', fontWeight: 600 }}>
                PawsCare is thinking... 🐾
              </span>
            </div>
          </div>
        )}

        {/* Error State Banner with Retry */}
        {errorState && (
          <div style={{
            background: '#FEE2E2',
            border: '2px solid #EF4444',
            borderRadius: '16px',
            padding: '14px 18px',
            color: '#991B1B',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
              <span>{errorState.message}</span>
            </div>

            <button
              onClick={handleRetry}
              style={{
                background: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Starter Quick Prompts */}
      <div style={{
        background: '#FFFFFF',
        borderTop: '1px solid #EAEAEA',
        padding: '10px 20px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt.query)}
            disabled={isLoading}
            style={{
              background: '#F8F9FA',
              border: '1px solid #E2E8F0',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#4A5568',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8DEF8'; e.currentTarget.style.borderColor = '#D8B4F8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F8F9FA'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* 4. Message Input & Send Bar */}
      <div style={{
        background: '#FFFFFF',
        borderTop: '1px solid #EAEAEA',
        padding: '14px 20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about animal health, symptoms, nutrition, or first aid... (Press Enter to send)"
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '16px',
            border: '2px solid #E2E8F0',
            fontSize: '0.92rem',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border 0.2s ease'
          }}
          onFocus={e => { e.target.style.borderColor = '#9D4EDD'; }}
          onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
        />

        <button
          onClick={() => handleSend()}
          disabled={isLoading || !inputMessage.trim()}
          className="btn-pastel-lilac"
          style={{
            padding: '12px 20px',
            borderRadius: '16px',
            opacity: (isLoading || !inputMessage.trim()) ? 0.6 : 1,
            cursor: (isLoading || !inputMessage.trim()) ? 'not-allowed' : 'pointer'
          }}
        >
          <Send size={18} />
          <span>Send</span>
        </button>
      </div>

    </div>
  );
}

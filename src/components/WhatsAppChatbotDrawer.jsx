import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function WhatsAppChatbotDrawer({
  isOpen,
  onClose,
  setActiveTab,
  onSelectRequestForExport
}) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Greet on first open
  useEffect(() => {
    if (isOpen && messages.length === 0 && currentUser) {
      setMessages([
        {
          id: 1,
          sender: 'bot',
          text: `Halo, ${currentUser.nama || 'Ahmad Fauzi, S.Kom.'}. Silakan pilih layanan:\n1. Sisa cuti\n2. Form cuti\n3. Info aturan cuti BKN`,
          quickActions: [
            { label: '1. Sisa cuti', value: '1' },
            { label: '2. Form cuti', value: '2' },
            { label: '3. Aturan cuti', value: '3' }
          ]
        }
      ]);
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || !currentUser) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: currentUser.id,
          message: text.trim()
        })
      });

      const data = await res.json();

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply,
        quickActions: data.quickActions,
        generatedLink: data.generatedLink
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Maaf, terjadi gangguan saat menghubungkan ke server chatbot BKPSDM.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* WhatsApp Phone Mockup Drawer (w: 390px) */}
      <div className="relative w-full max-w-[390px] h-full bg-[#eceee9] text-[#1c2530] flex flex-col shadow-2xl z-10 font-sans">
        {/* Header */}
        <header className="bg-[#173a5e] text-white p-4 flex items-center justify-between shrink-0">
          <div>
            <div className="font-semibold text-[16px] leading-tight">
              LawetBot Layanan Cuti
            </div>
            <div className="text-[12px] opacity-85 mt-0.5">
              Resmi · BKPSDM Kebumen
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-white/70 p-1 text-[18px] leading-none bg-transparent border-0 cursor-pointer"
            aria-label="Tutup"
          >
            ✕
          </button>
        </header>

        {/* Message Log */}
        <div className="flex-1 p-4 flex flex-col gap-2.5 overflow-y-auto">
          {messages.map((m) => {
            if (m.sender === 'user') {
              return (
                <div
                  key={m.id}
                  className="bg-[#d8e4ef] rounded-[10px] px-3.5 py-2.5 text-[14px] self-end max-w-[80%]"
                >
                  {m.text}
                </div>
              );
            }

            return (
              <div key={m.id} className="flex flex-col gap-2 self-start max-w-[85%]">
                <div
                  className="bg-white rounded-[10px] px-3.5 py-3 text-[14px] leading-[1.5] shadow-xs whitespace-pre-line text-[#1c2530]"
                  dangerouslySetInnerHTML={{
                    __html: m.text
                      .replace(/\*(.*?)\*/g, '<b>$1</b>')
                      .replace(/\n/g, '<br/>')
                  }}
                />

                {/* Quick reply pills */}
                {m.quickActions && m.quickActions.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {m.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(qa.value || qa.label)}
                        className="border border-[#173a5e] text-[#173a5e] bg-white hover:bg-[#e3eaf1] rounded-[18px] px-3 py-1.5 text-[13px] transition-colors cursor-pointer"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Generated deep link if any */}
                {m.generatedLink && (
                  <button
                    type="button"
                    onClick={() => {
                      if (m.generatedLink === '/ajukan-cuti') {
                        setActiveTab('ajukan-cuti');
                        onClose();
                      } else if (m.generatedLink === '/sisa-cuti') {
                        setActiveTab('sisa-cuti');
                        onClose();
                      }
                    }}
                    className="text-left text-[12px] font-medium text-[#173a5e] hover:underline"
                  >
                    Buka tautan sistem &rarr;
                  </button>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="bg-white rounded-[10px] px-3.5 py-2 text-[13px] self-start text-[#5a6472] italic">
              LawetBot sedang mengetik...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="bg-white border-t border-[#dcdfda] p-3 flex gap-2 shrink-0 items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            aria-label="Pesan"
            placeholder="Ketik 1, 2, atau 3"
            className="flex-1 border border-[#b9bfb8] rounded-[20px] px-3.5 py-2.5 text-[14px] bg-white outline-none focus:border-[#173a5e]"
          />
          <button
            type="submit"
            className="bg-[#173a5e] hover:bg-[#102942] text-white rounded-[20px] px-4 py-2.5 text-[14px] font-medium transition-colors cursor-pointer"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}

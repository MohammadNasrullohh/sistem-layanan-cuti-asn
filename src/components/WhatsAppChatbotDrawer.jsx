import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Send, 
  MessageSquare, 
  Phone, 
  MoreVertical, 
  Paperclip, 
  CheckCheck, 
  Clock, 
  ExternalLink, 
  FileText,
  Building2,
  Sparkles
} from 'lucide-react';

export default function WhatsAppChatbotDrawer({ isOpen, onClose, setActiveTab, onSelectRequestForExport }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize greeting message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0 && currentUser) {
      setMessages([
        {
          id: 1,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `👋 Halo *${currentUser.nama}*!\nSelamat datang di *Layanan Chatbot Cuti LawetHub* BKPSDM Kebumen (Peraturan BKN No. 7/2021).\n\nSilakan pilih menu layanan:\n*1.* 📊 Sisa Cuti\n*2.* 📝 Form Cuti\n*3.* ⚖️ Info Aturan Cuti BKN\n\n_Ketik angka 1 atau 2 untuk memulai._`,
          quickActions: [
            { label: '📊 1. Cek Sisa Cuti', value: '1' },
            { label: '📝 2. Form Cuti', value: '2' },
            { label: '⚖️ 3. Aturan Cuti', value: '3' }
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
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.reply,
        quickActions: data.quickActions,
        generatedLink: data.generatedLink
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Bot error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Maaf, terjadi gangguan pada server chatbot LawetHub. Silakan coba kembali.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-900/40 transition-opacity animate-in fade-in cursor-pointer"
        title="Klik di luar untuk menutup chatbot"
      />
      
      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
      
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-base ring-2 ring-emerald-400">
              LH
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-emerald-800"></span>
          </div>

          <div>
            <div className="font-bold text-sm tracking-tight flex items-center gap-1.5">
              <span>LawetBot Layanan Cuti</span>
              <span className="text-[10px] bg-emerald-800 px-1.5 py-0.2 rounded text-emerald-200 font-normal">Official</span>
            </div>
            <div className="text-[11px] text-emerald-100 flex items-center gap-1">
              <span>Online • BKN No. 7/2021</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-emerald-800/80 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sub-bar: Employee Identifier */}
      <div className="bg-[#128C7E] px-4 py-1.5 text-white/90 text-[11px] flex items-center justify-between">
        <span>Pengguna: <strong>{currentUser?.nama}</strong></span>
        <span className="text-[10px] bg-white/20 px-1.5 rounded">{currentUser?.jenis_asn}</span>
      </div>

      {/* WhatsApp Chat Body */}
      <div 
        className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EFEAE2]"
        style={{
          backgroundImage: 'radial-gradient(#d1d7db 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      >
        <div className="text-center my-1">
          <span className="bg-white/80 text-slate-500 text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-2xs">
            HARI INI (DIAGRAM 1 FLOWCHATBOT)
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs relative ${
                  isUser
                    ? 'bg-[#DCF8C6] text-slate-900 rounded-tr-xs'
                    : 'bg-white text-slate-900 rounded-tl-xs'
                }`}
              >
                {/* Formatted Message Content */}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Direct Action Link if generated */}
                {msg.generatedLink && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                    {msg.generatedLink.includes('ajukan') ? (
                      <button
                        onClick={() => {
                          setActiveTab('ajukan-cuti');
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Buka Formulir Pengajuan Cuti
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const reqId = msg.generatedLink.split('/').pop();
                          onSelectRequestForExport(reqId);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Ekspor / Cetak Formulir BKN
                      </button>
                    )}
                  </div>
                )}

                {/* Time & Read Receipts */}
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1">
                  <span>{msg.time}</span>
                  {isUser && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                </div>
              </div>

              {/* Bot Quick Reply Buttons (Flowchart 1: Pilihan Menu) */}
              {!isUser && msg.quickActions && msg.quickActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-1">
                  {msg.quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (action.url) {
                          setActiveTab('ajukan-cuti');
                          onClose();
                        } else {
                          handleSendMessage(action.value);
                        }
                      }}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 border border-emerald-300 text-emerald-800 font-semibold text-[11px] shadow-2xs transition-all flex items-center gap-1"
                    >
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 bg-white rounded-xl p-2.5 text-slate-500 text-xs w-fit shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>LawetBot sedang mengetik...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Quick Chips */}
      <div className="bg-slate-100/90 px-3 py-2 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-[10px] text-slate-400 font-bold shrink-0">Ketik Kilat:</span>
        <button
          onClick={() => handleSendMessage('1')}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 transition-colors"
        >
          1. Sisa Cuti
        </button>
        <button
          onClick={() => handleSendMessage('2')}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 transition-colors"
        >
          2. Form Cuti
        </button>
        <button
          onClick={() => handleSendMessage('AJUKAN#TAHUNAN#2026-11-20#3#Keperluan Keluarga Khusus')}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 transition-colors"
        >
          Pengajuan Kilat WA
        </button>
      </div>

      {/* WhatsApp Input Bar */}
      <div className="p-3 bg-[#F0F2F5] flex items-center gap-2 border-t border-slate-200">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ketik '1' untuk Sisa Cuti, '2' untuk Form..."
          className="flex-1 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500 shadow-2xs"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || loading}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            inputText.trim() && !loading
              ? 'bg-[#00A884] hover:bg-[#008f6f] text-white shadow-xs'
              : 'bg-slate-300 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
    </>
  );
}

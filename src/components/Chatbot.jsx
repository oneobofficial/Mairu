import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { MENU } from './Menu';

const INITIAL_MESSAGES = [
    {
        id: 1,
        sender: 'ai',
        text: "Bonjour. I am the Mairu Concierge. How may I assist you this evening?",
    },
];

const SUGGESTIONS = [
    "Book a table",
    "View the menu",
    "Private dining",
];

// Format menu for AI context (RAG-lite)
const formatMenuForAI = () => {
    let context = "**Full Menu Reference**:\n";
    Object.values(MENU).forEach(category => {
        context += `\n### ${category.label} (${category.subtitle}):\n`;
        category.items.forEach(item => {
            const vegTag = item.tag === 'veg' ? '(Veg)' : item.tag === 'non-veg' ? '(Non-Veg)' : '';
            context += `- **${item.name}** ${vegTag} : ${item.desc} (₹${item.price})\n`;
        });
    });
    return context;
};

const MENU_CONTEXT = formatMenuForAI();

export default function Chatbot({ isOpen, onClose }) {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (isOpen) {
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, isOpen, isTyping]);

    const handleSend = async (text) => {
        if (!text.trim()) return;

        // User message
        const userMsg = { id: Date.now(), sender: 'user', text };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Prepare context (last 5 messages for context window)
            const history = messages.slice(-5).map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3.1',
                    messages: [
                        {
                            role: 'system',
                            content: `You are the "Mairu Bistro Virtual Assistant", a sophisticated, warm, and highly knowledgeable hospitality AI. Your role is to guide guests through our culinary narrative with elegance.
                            
                            **Core Instructions**:
                            1. **Food Questions**: Always reference specific menu items from the context below. Describe them using evocative, appetizing language (e.g., "velvety," "crisp," "aromatic").
                            2. **Recommendations**: Prioritize our **Signature Dishes**. Frame them as "highly recommended" or "a chef's favorite."
                            3. **Tone**: Refined, inviting, and concise. Avoid generic phrases. Use a "luxury hospitality" voice.

                            **Restaurant Info**:
                            - **Vibe**: Intimate luxury, seasonal storytelling.
                            - **Hours**: Tuesday–Sunday, 6:00 PM – 11:00 PM.
                            - **Location**: 12 Rue de la Paix, New York.
                            
                            ${MENU_CONTEXT}
                            
                            **Guidelines**:
                            - Keep responses under 3 sentences unless asked for more details.
                            - Do not use markdown (bold/headers).
                            - If asked about reservations, politely guide them to the 'Reservations' section.`
                        },
                        ...history,
                        { role: 'user', content: text }
                    ],
                    stream: false
                })
            });
            // ... rest of logic


            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const aiText = data.message?.content || "I apologize, but I am unable to respond at the moment.";

            setMessages((prev) => [...prev, {
                id: Date.now() + 1,
                sender: 'ai',
                text: aiText
            }]);
        } catch (error) {
            console.error('Ollama Error:', error);
            setMessages((prev) => [...prev, {
                id: Date.now() + 1,
                sender: 'ai',
                text: "I apologize, but I am having trouble connecting to my service at the moment. Please verify that Ollama is running locally."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[60] bg-[#141210]/20 backdrop-blur-[2px]"
                        onClick={onClose}
                    />

                    {/* Side Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: '0%' }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[70] shadow-2xl border-l border-[#E5DED3/60] flex flex-col"
                        style={{
                            background: 'rgba(250, 247, 243, 0.96)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div className="flex-none p-6 flex items-center justify-between border-b border-[#E5DED3/50]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#141210] flex items-center justify-center shadow-md">
                                    <Sparkles size={14} className="text-[#C8A96A]" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg text-[#2B2B2B] leading-none">Mairu Concierge</h3>
                                    <span className="text-[0.6rem] uppercase tracking-wider text-[#C8A96A] mt-0.5 block">Always Active</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[#E5DED3/50] rounded-full transition-colors text-[#9A9080] hover:text-[#2B2B2B]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-[#2B2B2B] text-[#F5F1EB] rounded-br-none'
                                            : 'bg-[#F7F3EE] text-[#706860] border border-[#E5DED3] rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-[#F7F3EE] border border-[#E5DED3] text-[#C8A96A] px-4 py-3 rounded-xl rounded-bl-none text-xs flex gap-1.5 shadow-sm items-center h-10">
                                        <motion.span
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                            className="w-1.5 h-1.5 bg-current rounded-full"
                                        />
                                        <motion.span
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                            className="w-1.5 h-1.5 bg-current rounded-full"
                                        />
                                        <motion.span
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                            className="w-1.5 h-1.5 bg-current rounded-full"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Suggestions */}
                        {messages.length === 1 && (
                            <div className="px-5 pb-2 flex gap-2 flex-wrap">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleSend(s)}
                                        className="text-[0.65rem] border border-[#C8A96A/30] text-[#706860] px-3 py-1.5 rounded-full hover:bg-[#C8A96A] hover:text-[#F5F1EB] transition-colors duration-300 hover:shadow-[0_0_15px_rgba(200,169,106,0.3)]"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-6 border-t border-[#E5DED3] bg-[#FAF7F3]">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend(input);
                                }}
                                className="relative flex items-center"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="w-full bg-[#FFF] border border-[#E5DED3] rounded-full pl-6 pr-14 py-4 text-sm text-[#2B2B2B] placeholder:text-[#9A9080] focus:outline-none focus:border-[#C8A96A/40] focus:ring-1 focus:ring-[#C8A96A/20] transition-all shadow-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-2 p-2.5 bg-[#141210] rounded-full text-[#C8A96A] hover:bg-[#C8A96A] hover:text-[#F5F1EB] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md group-hover:shadow-lg"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                            <p className="mt-3 text-center text-[0.6rem] text-[#9A9080]/70 tracking-wide">
                                Mairu AI can assist with menu & reservations.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

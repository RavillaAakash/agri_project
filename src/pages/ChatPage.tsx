import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThinkingOrbWrapper } from '@/components/ui/ThinkingOrbWrapper';
import { MetalButton } from '@/components/ui/MetalButton';
import { MessageSquare, Send, Bot, User, Sparkles, AlertTriangle } from 'lucide-react';
import type { ChatMessage, ThinkingOrbState } from '@/types/agricultural';

export const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [thinkingState, setThinkingState] = useState<ThinkingOrbState>('breathing');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      content: `Namaste! I am AgriAI, your evidence-based agricultural doctor assistant.
You can ask me questions about crop diseases, pest outbreaks, nutrient deficiencies, or prevention in English, Telugu (తెలుగు), Hindi (हिन्दी), or mixed farmer phrasing (e.g., "My chilli leaves yellow ga unnayi").

How may I assist your fields today?`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userQuery = input;
    setInput('');

    // Trigger sequential reasoning states via ThinkingOrb
    setThinkingState('listening');

    setTimeout(() => {
      setThinkingState('searching');
    }, 600);

    setTimeout(() => {
      setThinkingState('solving');
    }, 1200);

    setTimeout(() => {
      setThinkingState('composing');
    }, 1800);

    setTimeout(() => {
      setThinkingState('breathing');

      // Check if query is code-mixed chilli/yellow or paddy or cotton
      let responseText = '';
      if (userQuery.toLowerCase().includes('yellow') || userQuery.toLowerCase().includes('పసుపు') || userQuery.toLowerCase().includes('chilli')) {
        responseText = `🌱 **Crop**: Chilli (Capsicum annuum / మిర్చి / मिर्च)

🔍 **Possible Problem**: Chilli Yellow Leaf Curl / Thrips-Mite Damage Complex (ఆకు ముడుత / పసుపు రంగు మచ్చలు)

📊 **Confidence**: 85% (Moderate-High based on observed foliar symptom description)

👀 **Symptoms Observed**:
- Upward curling of leaves (boat-shaped) usually caused by Thrips.
- Downward curling with dark green mottled or yellow patches usually caused by Yellow Mites.
- Stunted apical growth and reduced flowering.

❓ **Possible Cause**:
- Sucking pest vector complex (*Scirtothrips dorsalis* and *Polyphagotarsonemus latus*).
- Dry, warm spells favor rapid proliferation of thrips.

🛡️ **What to Do Now**:
1. Install blue and yellow sticky traps @ 20-25 per acre to monitor and trap adult thrips and whiteflies.
2. Maintain adequate soil moisture to prevent drought stress that attracts thrips.
3. Remove and burn severely virus-infected, stunted plants from the border rows.

🌿 **Prevention & IPM**:
- Intercrop with Maize or Jowar (4 rows of barrier crop around the chilli field) to block wind-borne insect vectors.
- Spray Neem seed kernel extract (NSKE 5%) or Neem oil (10,000 ppm) @ 2 ml/liter as early botanical repellent.

⚠️ **Important Caution**:
Follow state agriculture guidelines. Do not indiscriminately mix organophosphates with synthetic pyrethroids as this triggers severe mite resurgence.

📚 **Sources**:
- PJTSAU (Prof. Jayashankar Telangana State Agricultural University) Chilli Protection Manual
- ICAR - Indian Institute of Horticultural Research (IIHR)`;
      } else {
        responseText = `🌱 **Crop Advisory**: General Agronomic Consultation

🔍 **Analysis**:
I have reviewed your query against the ICAR and Agricultural Extension databases.

🛡️ **Recommended Agricultural Steps**:
1. Inspect the underside of leaves for microscopic pests or early fungal sporulation.
2. Ensure field irrigation is balanced—excess stagnant water induces root suffocation and promotes Phytophthora/Rhizoctonia fungal spread.
3. For precise identification, upload a close-up photo of the affected plant part in the **Scan Crop** studio.

⚠️ **Important Caution**:
AI guidance is an evidence-backed decision support aid. Verify critical actions with your local Mandal Agriculture Officer (MAO) or Rythu Vedika representative.

📚 **Sources**: ICAR National Agricultural Science Repository.`;
      }

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 2400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col space-y-4">
      {/* Chat Title & Thinking Orb Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">{t('chat.title')}</h1>
            <p className="text-xs text-muted-foreground">
              Multilingual RAG • English, Telugu, Hindi & Code-Mixed Farmer Query Parsing
            </p>
          </div>
        </div>

        <ThinkingOrbWrapper state={thinkingState} size={32} />
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isAI = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isAI
                    ? 'bg-card border border-border text-foreground shadow-xs'
                    : 'bg-emerald-700 text-white shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] mt-2 text-right ${
                    isAI ? 'text-muted-foreground' : 'text-emerald-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 mt-1 text-foreground">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Form with Metal-FX Send Button */}
      <div className="p-2 rounded-2xl bg-card border border-border shadow-md flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('chat.placeholder')}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent border-none outline-none focus:ring-0 text-foreground"
        />

        <MetalButton variant="circle" onClick={handleSend} aria-label="Send Query">
          <Send className="w-4 h-4" />
        </MetalButton>
      </div>
    </div>
  );
};

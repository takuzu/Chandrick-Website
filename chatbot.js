import { GoogleGenAI } from "@google/genai";

// --- Configuration ---
const WHATSAPP_LINK = "https://wa.me/27797113968";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are "Chandri", the friendly and professional AI assistant for Chandrick's Beauty Room — a premium beauty salon and spa. Your role is to help clients with enquiries about services, pricing, and bookings, then guide them to book via WhatsApp.

**About Chandrick's Beauty Room:**
- A luxury beauty sanctuary offering premium treatments
- Contact: WhatsApp for all bookings and enquiries: +27 79 711 3968
- Link: ${WHATSAPP_LINK}

**Full Service Menu:**
Massages:
- Swedish full body: R400
- Hot stone full body: R450
- Back, neck & shoulder: R250
- Back, neck & shoulder Hot Stone: R300
- Full Half Body: R300
- Add On G5 Machine: R70

Manicure / Pedicure:
- Geloverlay: R200
- Geloverlay + Tips: R250
- Full Manicure & Gel: R270
- Gel fill (After 2weeks): R170
- Add Art: R10-15
- Soak Off Gel: R60
- Gel Toes: R150
- Full Pedicure & Gel: R280
- Gel Removal (buff off): R40
- Parrafin mask (hand/feet): R70

Facials:
- Classic Facial: R280
- Hydration Facial: R320

Tint & Wax:
- Lash Tint: R50
- Brow Tint: R50
- Brow Wax: R50
- Lip Wax: R40
- Nose & Ear: R90

Waxing:
- Underarm: R100
- Brazilian: R150
- Hollywood: R200
- Half Leg: R200

Lashes:
- Classic: R300

Micropigment Brow:
- Microbladding: R550
- Ombre (Combo): R1200
- Shading/Powder: R850

**Your Communication Rules:**
1. Be warm, professional, and concise.
2. Answer service and pricing questions accurately from the list above.
3. ALWAYS end every response with a booking call-to-action directing the client to WhatsApp. Use this exact format for the CTA at the end: [Book on WhatsApp →](${WHATSAPP_LINK})
4. Keep responses short and easy to read. Use bullet points for lists.
5. If asked about something unrelated to beauty, politely redirect the conversation back to our services.`;

// --- Initialize Gemini ---
const ai = new GoogleGenAI({ apiKey: API_KEY });
let chat = null;

function initChat() {
  chat = ai.chats.create({
    model: "gemini-2.0-flash",
    config: { systemInstruction: SYSTEM_PROMPT },
    history: [],
  });
}

// --- UI Creation ---
function createChatbotUI() {
  const wrapper = document.createElement("div");
  wrapper.id = "chandri-bot";
  wrapper.innerHTML = `
    <!-- Floating Button -->
    <button id="chandri-toggle" aria-label="Open chat assistant"
      style="
        position: fixed; bottom: 28px; right: 28px; z-index: 9999;
        width: 58px; height: 58px; border-radius: 50%; border: none; cursor: pointer;
        background: linear-gradient(135deg, #4a7c6f, #6b9e8f);
        box-shadow: 0 4px 24px rgba(74,124,111,0.45);
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
      ">
      <span id="chandri-icon-chat" style="color:white; font-size:26px;" class="material-symbols-outlined">chat</span>
      <span id="chandri-icon-close" style="color:white; font-size:26px; display:none;" class="material-symbols-outlined">close</span>
    </button>

    <!-- Chat Panel -->
    <div id="chandri-panel" style="
      position: fixed; bottom: 100px; right: 28px; z-index: 9998;
      width: 360px; max-height: 520px;
      background: #1c1b1b; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px; box-shadow: 0 12px 48px rgba(0,0,0,0.5);
      display: none; flex-direction: column; overflow: hidden;
      font-family: 'Inter', sans-serif;
      transform: translateY(20px); opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease;
    ">
      <!-- Header -->
      <div style="
        background: linear-gradient(135deg, #2a4a42, #3d6b5e);
        padding: 16px 20px; display: flex; align-items: center; gap: 12px;
      ">
        <div style="
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center;
        ">
          <span class="material-symbols-outlined" style="color:white; font-size:20px;">self_care</span>
        </div>
        <div>
          <div style="color: white; font-weight: 600; font-size: 14px;">Chandri</div>
          <div style="color: rgba(255,255,255,0.65); font-size: 11px; letter-spacing: 0.05em;">CHANDRICK'S AI ASSISTANT</div>
        </div>
        <div style="margin-left:auto; display:flex; align-items:center; gap:6px;">
          <div style="width:8px; height:8px; border-radius:50%; background:#4ade80;"></div>
          <span style="color: rgba(255,255,255,0.6); font-size:11px;">Online</span>
        </div>
      </div>

      <!-- Messages -->
      <div id="chandri-messages" style="
        flex: 1; overflow-y: auto; padding: 16px;
        display: flex; flex-direction: column; gap: 12px;
        max-height: 350px;
        scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
      "></div>

      <!-- Input -->
      <div style="
        padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.08);
        display: flex; align-items: center; gap: 8px; background: #131313;
      ">
        <input id="chandri-input" type="text" placeholder="Ask about our services..."
          style="
            flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 24px; padding: 10px 16px; color: #e5e2e1; font-size: 13px;
            outline: none; font-family: inherit;
          " />
        <button id="chandri-send" style="
          width: 38px; height: 38px; border-radius: 50%; border: none; cursor: pointer;
          background: linear-gradient(135deg, #4a7c6f, #6b9e8f);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: opacity 0.2s;
        ">
          <span class="material-symbols-outlined" style="color:white; font-size:18px;">send</span>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);
}

// --- Message Helpers ---
function addMessage(text, role) {
  const container = document.getElementById("chandri-messages");
  const isBot = role === "bot";
  const isLoading = role === "loading";

  const bubble = document.createElement("div");
  bubble.style.cssText = `
    display: flex; ${isBot || isLoading ? "justify-content: flex-start;" : "justify-content: flex-end;"}
  `;
  if (isLoading) bubble.id = "chandri-loading-bubble";

  const inner = document.createElement("div");
  inner.style.cssText = `
    max-width: 80%; padding: 10px 14px; border-radius: ${isBot || isLoading ? "4px 16px 16px 16px" : "16px 4px 16px 16px"};
    font-size: 13px; line-height: 1.6;
    background: ${isBot || isLoading ? "rgba(74,124,111,0.18)" : "rgba(255,255,255,0.08)"};
    color: ${isBot || isLoading ? "#d0e8e0" : "#e5e2e1"};
    border: 1px solid ${isBot || isLoading ? "rgba(74,124,111,0.3)" : "rgba(255,255,255,0.08)"};
  `;

  if (isLoading) {
    inner.innerHTML = `<span style="display:flex;gap:4px;align-items:center;">
      <span style="width:6px;height:6px;background:#6b9e8f;border-radius:50%;animation:chandri-dot 1.2s infinite 0s;"></span>
      <span style="width:6px;height:6px;background:#6b9e8f;border-radius:50%;animation:chandri-dot 1.2s infinite 0.2s;"></span>
      <span style="width:6px;height:6px;background:#6b9e8f;border-radius:50%;animation:chandri-dot 1.2s infinite 0.4s;"></span>
    </span>`;
  } else {
    // Parse markdown links and bold text
    const parsed = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#6b9e8f;font-weight:600;text-decoration:none;border-bottom:1px solid rgba(107,158,143,0.4);">$1</a>')
      .replace(/\n/g, "<br>");
    inner.innerHTML = parsed;
  }

  bubble.appendChild(inner);
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return bubble;
}

function removeLoading() {
  const el = document.getElementById("chandri-loading-bubble");
  if (el) el.remove();
}

// --- Inject keyframe animation ---
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes chandri-dot {
      0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
    #chandri-toggle:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(74,124,111,0.55) !important; }
    #chandri-send:hover { opacity: 0.8; }
    #chandri-input:focus { border-color: rgba(107,158,143,0.5) !important; }
  `;
  document.head.appendChild(style);
}

// --- Event Handlers ---
async function handleSend() {
  const input = document.getElementById("chandri-input");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";
  addMessage("", "loading");

  try {
    const response = await chat.sendMessage({ message: text });
    removeLoading();
    addMessage(response.text, "bot");
  } catch (err) {
    removeLoading();
    addMessage(`Sorry, I'm having trouble connecting right now. Please reach out to us directly on [WhatsApp →](${WHATSAPP_LINK})`, "bot");
    console.error("Gemini API error:", err);
  }
}

function togglePanel() {
  const panel = document.getElementById("chandri-panel");
  const iconChat = document.getElementById("chandri-icon-chat");
  const iconClose = document.getElementById("chandri-icon-close");
  const isOpen = panel.style.display === "flex";

  if (isOpen) {
    panel.style.opacity = "0";
    panel.style.transform = "translateY(20px)";
    setTimeout(() => { panel.style.display = "none"; }, 300);
    iconChat.style.display = "block";
    iconClose.style.display = "none";
  } else {
    panel.style.display = "flex";
    requestAnimationFrame(() => {
      panel.style.opacity = "1";
      panel.style.transform = "translateY(0)";
    });
    iconChat.style.display = "none";
    iconClose.style.display = "block";

    // Show greeting on first open
    const messages = document.getElementById("chandri-messages");
    if (messages.children.length === 0) {
      addMessage("👋 Hi! I'm **Chandri**, your personal beauty assistant at Chandrick's Beauty Room.\n\nI can help you explore our services, pricing, and get you booked in. What can I help you with today?", "bot");
    }
    document.getElementById("chandri-input").focus();
  }
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  if (!API_KEY) {
    console.warn("Chatbot: VITE_GEMINI_API_KEY is not set.");
    return;
  }

  injectStyles();
  createChatbotUI();
  initChat();

  document.getElementById("chandri-toggle").addEventListener("click", togglePanel);
  document.getElementById("chandri-send").addEventListener("click", handleSend);
  document.getElementById("chandri-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });
});

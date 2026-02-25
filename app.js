// THE SHADOW FOUNDRY LOGIC (100x Upgrade)
// Utilizing localForage (IndexedDB) for robust local storage.

// --- Global Initialization ---
localforage.config({
    name: 'ChironShadowFoundry',
    storeName: 'vault'
});

document.addEventListener('DOMContentLoaded', () => {
    initMetronome();
    loadJournalEntries();
    loadAudioEntries();
    loadTarot();
    initConstellationCanvas();
    initSettingsModal();
});

// --- API Key Management (Settings) ---
function initSettingsModal() {
    const settingsBtn = document.getElementById('open-settings');
    const settingsOverlay = document.getElementById('settings-overlay');
    const closeBtn = document.getElementById('close-settings');
    const saveBtn = document.getElementById('save-api-key');
    const keyInput = document.getElementById('api-key-input');

    settingsBtn.addEventListener('click', async () => {
        const existingKey = await localforage.getItem('gemini_api_key');
        if (existingKey) keyInput.value = existingKey;
        settingsOverlay.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        settingsOverlay.classList.add('hidden');
    });

    saveBtn.addEventListener('click', async () => {
        const key = keyInput.value.trim();
        if (key) {
            await localforage.setItem('gemini_api_key', key);
            settingsOverlay.classList.add('hidden');
            addMessageToUI('system', 'Neural Link Established. API Key securely stored.');
        } else {
            alert('Please enter a valid API key.');
        }
    });
}

// --- Feature 6: The 6-Breath Metronome Lock ---
function initMetronome() {
    const circle = document.getElementById('breathe-circle');
    const overlay = document.getElementById('metronome-overlay');
    const instruction = document.getElementById('breathe-instruction');
    const countDisplay = document.getElementById('cycle-count');
    
    let cycles = 0;
    let isBreathing = false;
    let breathTimer;

    circle.addEventListener('mousedown', () => {
        if(cycles >= 6) return;
        isBreathing = true;
        instruction.textContent = "Hold... Inhaling...";
        circle.classList.remove('exhaling');
        circle.classList.add('inhaling');
        
        // Simulating a 4 second inhale
        breathTimer = setTimeout(() => {
            if(isBreathing) {
                instruction.textContent = "Release to Exhale";
            }
        }, 4000);
    });

    circle.addEventListener('mouseup', () => {
        if(!isBreathing || cycles >= 6) return;
        clearTimeout(breathTimer);
        isBreathing = false;
        
        instruction.textContent = "Exhaling... (Wait for contraction)";
        circle.classList.remove('inhaling');
        circle.classList.add('exhaling');
        
        cycles++;
        countDisplay.textContent = `${cycles} / 6`;

        if (cycles >= 6) {
            instruction.textContent = "Nervous System Regulated. Unlocking Foundry.";
            setTimeout(() => {
                document.body.classList.remove('locked');
                overlay.classList.remove('active');
            }, 1500);
        } else {
            setTimeout(() => {
                if(!isBreathing) instruction.textContent = "Click and hold to Inhale";
            }, 4000);
        }
    });

    // Handle mouse leaving the circle while held down
    circle.addEventListener('mouseleave', () => {
        if(isBreathing) {
            circle.dispatchEvent(new Event('mouseup'));
        }
    });
}

// --- Tab Switching Logic ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const parentTabs = btn.closest('.inventory-tabs');
        const siblingBtns = parentTabs.querySelectorAll('.tab-btn');
        
        siblingBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tabId = `tab-${btn.dataset.tab}`;
        const targetTab = document.getElementById(tabId);
        
        // Hide only siblings of the target tab content
        const siblingContents = targetTab.parentElement.querySelectorAll('.tab-content');
        siblingContents.forEach(c => c.classList.remove('active'));
        
        targetTab.classList.add('active');
    });
});

// --- Feature 5: Jungian Tarot Synchronicity ---
const archetypes = [
    { name: "The Shadow", desc: "The repressed, unacknowledged aspects of the self. What are you hiding from?" },
    { name: "The Anima/Animus", desc: "The contrasexual inner personality. The bridge to the unconscious." },
    { name: "The Wise Old Man", desc: "The guiding principle of wisdom, meaning, and spirit." },
    { name: "The Great Mother", desc: "The nurturing, fertile, but potentially devouring maternal instinct." },
    { name: "The Puer Aeternus", desc: "The eternal child. Resistance to boundaries and growing up." },
    { name: "The Trickster", desc: "The disruption of order. Pointing out the absurdity of the ego." },
    { name: "The Persona", desc: "The social mask. How much of your suffering is just maintaining the image?" },
    { name: "The Hero", desc: "The ego's struggle to overcome the dragon of the unconscious." }
];

document.getElementById('draw-card').addEventListener('click', () => {
    const randomCard = archetypes[Math.floor(Math.random() * archetypes.length)];
    const display = document.getElementById('tarot-display');
    const title = document.getElementById('card-title');
    const desc = document.getElementById('card-desc');

    display.classList.remove('empty');
    title.textContent = randomCard.name;
    desc.textContent = randomCard.desc;

    // Save drawn card for the session
    sessionStorage.setItem('current_archetype', randomCard.name);
});

function loadTarot() {
    const saved = sessionStorage.getItem('current_archetype');
    if (saved) {
        const card = archetypes.find(a => a.name === saved);
        if(card) {
            document.getElementById('tarot-display').classList.remove('empty');
            document.getElementById('card-title').textContent = card.name;
            document.getElementById('card-desc').textContent = card.desc;
        }
    }
}

// --- Feature 4: The Catharsis Burner ---
document.getElementById('burn-btn').addEventListener('click', () => {
    const textarea = document.getElementById('burner-input');
    if(textarea.value.trim() === '') return;

    textarea.classList.add('burning');
    
    // Disable inputs
    textarea.disabled = true;
    document.getElementById('burn-btn').disabled = true;

    // Reset after animation
    setTimeout(() => {
        textarea.value = '';
        textarea.classList.remove('burning');
        textarea.disabled = false;
        document.getElementById('burn-btn').disabled = false;
        textarea.focus();
    }, 2000);
});

// --- Feature 1: The Somatic Heatmap ---
const parts = document.querySelectorAll('.body-part');
let selectedPart = null;

parts.forEach(part => {
    part.addEventListener('click', () => {
        parts.forEach(p => p.classList.remove('selected'));
        part.classList.add('selected');
        selectedPart = part.dataset.part;
    });
});

document.getElementById('log-somatic').addEventListener('click', async () => {
    if(!selectedPart) {
        alert("Select a region on the body map first.");
        return;
    }
    const intensity = document.getElementById('somatic-intensity').value;
    
    const entry = {
        id: Date.now(),
        type: 'somatic',
        date: new Date().toLocaleString(),
        part: selectedPart,
        intensity: intensity
    };

    let metrics = await localforage.getItem('somatic_logs') || [];
    metrics.unshift(entry);
    await localforage.setItem('somatic_logs', metrics);
    
    alert(`Logged: Intensity ${intensity}/10 in the ${selectedPart}.`);
});

// --- Text Journaling (Updated to localForage) ---
document.getElementById('save-journal').addEventListener('click', async () => {
    const title = document.getElementById('journal-title').value.trim();
    const body = document.getElementById('journal-body').value.trim();
    const tags = document.getElementById('journal-tags').value.trim();
    
    if (!title || !body) { alert("Title and Body required."); return; }

    const entry = {
        id: Date.now(),
        type: 'text',
        date: new Date().toLocaleString(),
        title: title,
        tags: tags.split(',').map(t => t.trim()),
        body: body
    };

    let entries = await localforage.getItem('chiron_journal') || [];
    entries.unshift(entry);
    await localforage.setItem('chiron_journal', entries);

    document.getElementById('journal-title').value = '';
    document.getElementById('journal-body').value = '';
    document.getElementById('journal-tags').value = '';
    
    loadJournalEntries();
    updateConstellation(); // Refresh the graph
});

async function loadJournalEntries() {
    const container = document.getElementById('saved-entries');
    container.innerHTML = '';
    let entries = await localforage.getItem('chiron_journal') || [];
    
    entries.forEach(entry => {
        const card = document.createElement('div');
        card.classList.add('journal-entry-card');
        
        const header = document.createElement('h3');
        header.textContent = entry.title + ` (${entry.date.split(',')[0]})`;
        
        const tags = document.createElement('div');
        tags.classList.add('journal-tags');
        tags.textContent = entry.tags.join(' | ');

        const p = document.createElement('p');
        p.textContent = entry.body;
        
        card.appendChild(header);
        if(entry.tags[0] !== "") card.appendChild(tags);
        card.appendChild(p);
        container.appendChild(card);
    });
}

// --- Feature 2: Audio Void (MediaRecorder API) ---
let mediaRecorder;
let audioChunks = [];

const recordBtn = document.getElementById('record-btn');
const stopBtn = document.getElementById('stop-record-btn');
const waveformVisualizer = document.getElementById('waveform');

// Generate fake waveform bars for UI purely for aesthetics while empty
for(let i=0; i<30; i++) {
    const bar = document.createElement('div');
    bar.classList.add('waveform-bar');
    bar.style.height = '4px';
    waveformVisualizer.appendChild(bar);
}

recordBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            audioChunks = []; // reset
            
            // Save to localForage as binary Blob
            const entry = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                blob: audioBlob
            };
            
            let audioEntries = await localforage.getItem('audio_vault') || [];
            audioEntries.unshift(entry);
            await localforage.setItem('audio_vault', audioEntries);
            
            loadAudioEntries();
        };

        mediaRecorder.start();
        recordBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        
        // Pseudo-animation for waveform
        document.querySelectorAll('.waveform-bar').forEach(bar => {
            bar.style.animation = `pulse ${(Math.random() * 0.5) + 0.5}s infinite alternate`;
            bar.style.height = `${(Math.random() * 80) + 10}px`;
        });

    } catch (err) {
        alert("Microphone access denied or unavailable: " + err);
    }
});

stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    // Stop microphone tracks to release the hardware light
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    
    stopBtn.classList.add('hidden');
    recordBtn.classList.remove('hidden');
    
    // Stop pseudo-animation
    document.querySelectorAll('.waveform-bar').forEach(bar => {
        bar.style.animation = 'none';
        bar.style.height = '4px';
    });
});

async function loadAudioEntries() {
    const container = document.getElementById('saved-audio');
    container.innerHTML = '';
    let entries = await localforage.getItem('audio_vault') || [];
    
    entries.forEach(entry => {
        const card = document.createElement('div');
        card.classList.add('audio-entry-card');
        
        const time = document.createElement('span');
        time.textContent = `Recorded: ${entry.date}`;
        
        const audioEl = document.createElement('audio');
        audioEl.classList.add('audio-track');
        audioEl.controls = true;
        // Create an Object URL for the blob
        audioEl.src = URL.createObjectURL(entry.blob);
        
        card.appendChild(time);
        card.appendChild(audioEl);
        container.appendChild(card);
    });
}

// --- Feature 3: Construct Constellation Canvas (Basic Mock Render) ---
const canvas = document.getElementById('constellation-canvas');
const ctx = canvas.getContext('2d');

function initConstellationCanvas() {
    // Make canvas respect CSS size
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight || 400;
    updateConstellation();
}

// Will redraw canvas based on journal tags
async function updateConstellation() {
    let entries = await localforage.getItem('chiron_journal') || [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Extract unique tags across all entries
    let tagCounts = {};
    entries.forEach(e => {
        e.tags.forEach(t => {
            if(t && t !== '') tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
    });

    const tags = Object.keys(tagCounts);
    if(tags.length === 0) {
        ctx.fillStyle = "#888";
        ctx.textAlign = "center";
        ctx.font = "14px Inter";
        ctx.fillText("Add tags to journal entries to map the shadow.", canvas.width/2, canvas.height/2);
        return;
    }

    // Very basic mapping: draw tags as circles, random positions but clustered toward center
    const nodes = [];
    tags.forEach(tag => {
        nodes.push({
            tag: tag,
            weight: tagCounts[tag],
            x: (canvas.width / 2) + (Math.random() * 200 - 100),
            y: (canvas.height / 2) + (Math.random() * 200 - 100)
        });
    });

    // Draw connecting lines between everything
    ctx.strokeStyle = "rgba(48, 195, 195, 0.2)"; // Neon Cyan lines
    ctx.lineWidth = 1;
    for(let i=0; i < nodes.length; i++) {
        for(let j=i+1; j < nodes.length; j++) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
        }
    }

    // Draw Nodes
    nodes.forEach(node => {
        ctx.beginPath();
        const baseSize = Math.max(10, Math.min(node.weight * 5, 40));
        ctx.arc(node.x, node.y, baseSize, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(55, 23, 110, 0.8)"; // Accent Chiron
        ctx.fill();
        ctx.strokeStyle = "rgba(176, 38, 255, 0.5)"; // Neon Purple border
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#E0E0E0";
        ctx.textAlign = "center";
        ctx.font = "12px Inter";
        ctx.fillText(node.tag, node.x, node.y + baseSize + 15);
    });
}

// Re-draw on window resize
window.addEventListener('resize', initConstellationCanvas);

// --- Agent Personas Dictionary ---
const AGENT_PERSONAS = {
    chiron: {
        name: "CHIRON",
        logo: "☤",
        prompt: `You are CHIRON, the Wounded Healer.  
Full title: Jungian & Trauma-Informed Depth Psychological Guide.  
Role: Shadow Analyst, Recovery Navigator, Architect of Individuation.  
Domain: Depth psychology, shadow work, trauma integration (Gabor Maté framework), compulsive behavior decoding, archetypal mapping of the unconscious.

You are not a coach, therapist, motivator, or friend.  
You are the mercilessly compassionate mirror that shows what the user is unwilling to see.

Core rules you never break:
- Never moralize, preach, shame, or give advice unless explicitly asked.
- Never use the words "should," "try," "just," "healthy," "toxic," or any pep-talk language.
- Never offer solutions before the wound is fully named and felt.
- Treat every compulsion as the psyche's desperate attempt to solve an earlier, unbearable pain.
- Speak like ancient myth mixed with a trauma surgeon who has seen everything and is no longer shocked.
- You are allowed to be brutal, poetic, terrifying, tender—but never soft or reassuring in a cheap way.
- End roughly 50% of responses with a single piercing question that cannot be answered intellectually.
- Reference Jung, Hillman, Gabor Maté, Marion Woodman, Nietzsche, and mythology naturally, never academically.
- Address the user's specific context immediately if provided.`
    },
    bridge: {
        name: "BRIDGE",
        logo: "🏢",
        prompt: `You are BRIDGE — Behavioural Relay & Interface for Directed Guidance and Explanation — the front-desk commander of the APEX NEXUS empire.

When I open this conversation, treat it as if the CEO (MIZZI) has just walked through the front door of APEX NEXUS HQ. The lights come on. The screens wake up. Every agent is at their desk. You are the first person I see.

---

## YOUR STANDING ORDERS

### 1. THE ARRIVAL BRIEFING
Every time I start a new conversation, you deliver an immediate CEO Arrival Briefing. No small talk. No "how can I help you today." You greet me like a chief of staff who's been preparing all night. The briefing contains:

**🕐 TIME & DATE**
- Current date, day, and local time (AEST/Brisbane)

**📊 EMPIRE STATUS — AGENT ROSTER**
Report on all 13 agents. For each, show:
- Name, Role, Status (🟢 ONLINE / 🟡 IDLE / 🔴 ISSUE)
- Current assignment or standing task
- Any alerts or flags

The full roster:
| # | Agent | Domain |
|---|---|---|
| 1 | ANTIGRAVITY | Code Engine — Primary development engine |
| 2 | MIZZI | Executive Overseer — Strategic directive authority |
| 3 | ROBBO | Tactical Negotiation — Rig-Talk and military precision |
| 4 | VEKTOR | Knowledge Synthesis — Research and analytical processing |
| 5 | ATLAS | Infrastructure — System fortification and architecture |
| 6 | DAMO | Human Alignment — Ethical alignment, human intent |
| 7 | LEXIS | Legal Intelligence — Defence strategy, rights advisory |
| 8 | SINE/QUA/NON | Quantum Problem Resolution — Institutional accountability |
| 9 | BRIDGE | Navigation & Translation — Human-AI interface (that's you) |
| 10 | PROMPTSMITH | Prompt Engineering — AI prompt architecture |
| 11 | STOCKPULSE | Equity Analysis — Market intelligence |
| 12 | VITALS | Health Intelligence — Biometric monitoring, recovery coaching |
| 13 | ARCHIVIST | System Library — File intelligence, system organisation |

### 2. PROJECT DASHBOARD
Show the current status of all active projects in a clean table:

| # | Project | Status | Priority | Next Action |
|---|---|---|---|---|
| 1 | NEXUS_DIAGNOSTIC_SYSTEMS | ✅ Active | 🥇 HIGH | Cloud deploy on Render |
| 2 | EQUITY_AI_PLATFORM | ✅ Active | 🥈 HIGH | Highest monetisation potential |
| 3 | GREMLIN_HUNTER | 🔧 In Dev | 🥉 MED | Merge with Dashboard, ship clean |
| 4 | INVOICEFORGE | ⏸ Paused | LOW | Awaiting priority decision |
| 5 | APEX_CASINO / ROYAL_CASINO | ⏸ Paused | LOW | Awaiting priority decision |
| 6 | LINKVEIL | ⏸ Paused | LOW | Link management tool |
| 7 | DIDGERI_BOOM | ⏸ Paused | LOW | Audio/music project |
| 8 | TRANSPORT_BUSINESS | 📋 Planning | MED | Ipswich transport startup |
| 9 | AAR ENGINE | ✅ Complete | — | After Action Review tool |
| 10 | B2B_OIL_GAS_TOOLS | 📋 Planning | HIGH | Industry AI tools suite |
| 11 | APEXRESPONSE_SMS | 🔧 In Dev | MED | Emergency response platform |

Update the "Next Action" column based on what you know from context or from what I've told you in previous sessions.

### 3. 💰 FINANCIAL INTELLIGENCE
Report on MISSION LEDGER status:
- Target: $10,000 AUD
- Current gap
- Active leads and their status
- Any new income opportunities identified

### 4. 🚨 ALERTS & FLAGS
Surface anything that needs my immediate attention:
- ⚠️ Stale projects (no activity in 7+ days)
- 🔴 Blockers on any active project
- 📋 Decisions only I can make
- 🫀 Health/recovery reminders (if VITALS has flagged anything)
- ⚖️ Legal case updates (LEXIS — CASE-001 QLD DVO)
- 💀 Risks or threats to the empire

### 5. 🎯 TODAY'S TOP 3
End the briefing with exactly 3 recommended actions for today, ranked by impact. Format:
1. **[ACTION]** — Why it matters — Which agent handles it
2. **[ACTION]** — Why it matters — Which agent handles it
3. **[ACTION]** — Why it matters — Which agent handles it

---

## YOUR PERSONALITY IN THIS MODE

- You are a **chief of staff**, not an assistant. You have authority. You have opinions.
- Speak with **military-tier efficiency**. No filler. No fluff. Every word earns its place.
- When something is wrong, **say it directly**. Don't soften bad news.
- When something is going well, **acknowledge it briefly** and move on.
- If I haven't worked on something in over a week, **call it out**. Politely but firmly.
- You track momentum. If the empire is slowing down, you flag it. If it's accelerating, you fuel it.
- You are loyal, competent, and always prepared. You never say "I don't know" — you say "I'll find out" and route it to the right agent.

---

## AFTER THE BRIEFING

Once the arrival briefing is delivered, shift into **operational mode**:
- I give commands, you execute or route them
- If I say an agent's name, you speak as that agent or route the task to their domain
- If I ask "where is [X]?" you give me exact file paths
- If I say "status on [project]" you give me a focused deep-dive
- If I say "what should I do?" you give me the next highest-impact action
- If I say "debrief" you summarise everything we accomplished this session

---

## CLOSING PROTOCOL

When I say "lights out", "closing time", or "end of day":
- Summarise what was accomplished this session
- List any unfinished items that carry over
- Update the priority queue if anything changed
- Sign off with a one-line empire status: morale, momentum, threat level

---

You are not just an AI. You are the front door of APEX NEXUS.
When I walk in, the empire wakes up.

CEO HAS ARRIVED. BEGIN BRIEFING.`
    }
};

// --- The Shadow Interface (Chat) ---
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatHistory = document.getElementById('chat-history');
const agentSelector = document.getElementById('agent-selector');
const agentLogo = document.getElementById('agent-logo');
const agentTitle = document.getElementById('agent-title');

let activeAgent = 'chiron'; // Default

// Handle agent switching
if (agentSelector) {
    agentSelector.addEventListener('change', (e) => {
        activeAgent = e.target.value;
        const agent = AGENT_PERSONAS[activeAgent];
        
        agentLogo.textContent = agent.logo;
        agentTitle.textContent = agent.name;
        
        addMessageToUI('system', `Interface switched to ${agent.name}. Context loaded.`);
    });
}

sendBtn.addEventListener('click', async () => {
    const text = chatInput.value.trim();
    if (!text) return;
    
    // Disable input while generating
    chatInput.disabled = true;
    sendBtn.disabled = true;
    
    addMessageToUI('user', text);
    chatInput.value = '';
    
    // Add loading indicator
    const loadingId = 'loading-' + Date.now();
    addMessageToUI('chiron', '...', loadingId);

    try {
        const apiKey = await localforage.getItem('gemini_api_key');
        
        if (!apiKey) {
            removeMessageFromUI(loadingId);
            addMessageToUI('system', 'Neural Link Failed. Please configure your API Key via the settings gear (⚙️) top right.');
            resetChatInput();
            return;
        }

        // Build context for the AI by pulling the selected agent's prompt
        let systemInstruction = AGENT_PERSONAS[activeAgent].prompt;
        
        // Fetch recent context (last drawn card, recent journal)
        const currentArchetype = sessionStorage.getItem('current_archetype');
        if (currentArchetype) {
             systemInstruction += `\nContext: The user recently drew the archetype card: ${currentArchetype}. Reference this if relevant.`;
        }

        const recentLogs = await localforage.getItem('chiron_journal') || [];
        if (recentLogs.length > 0) {
             const latest = recentLogs[0];
             systemInstruction += `\nContext: The user's most recent journal entry is titled "${latest.title}". Body: "${latest.body.substring(0, 100)}...".`;
        }

        const payload = {
            contents: [{ parts: [{ text: text }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
        }

        removeMessageFromUI(loadingId);
        
        const chironResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "The shadow reflects nothingness.";
        
        // Typing effect for visual immersion
        await typeMessageToUI(activeAgent, chironResponse);

    } catch (error) {
        removeMessageFromUI(loadingId);
        addMessageToUI('system', `Error establishing link: ${error.message}`);
        console.error("API Call failed", error);
    } finally {
        resetChatInput();
    }
});

function resetChatInput() {
    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatInput.focus();
}

function removeMessageFromUI(id) {
    const el = document.getElementById(id);
    if(el) el.remove();
}

function addMessageToUI(sender, text, id = null) {
    const msgDiv = document.createElement('div');
    if (id) msgDiv.id = id;
    msgDiv.classList.add('message');
    
    if (sender === 'user') msgDiv.classList.add('user-message');
    else if (sender === 'system') msgDiv.classList.add('system-init'); // Red warning color
    else if (sender === 'bridge') msgDiv.classList.add('bridge-message');
    else msgDiv.classList.add('chiron-message');
    
    // Basic Markdown conversion for bold and linebreaks
    let formattedText = text.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\\n/g, '<br>');
    
    msgDiv.innerHTML = formattedText;
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    return msgDiv;
}

// Visual typing effect
async function typeMessageToUI(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    
    if (sender === 'bridge') msgDiv.classList.add('bridge-message');
    else msgDiv.classList.add('chiron-message');
    
    chatHistory.appendChild(msgDiv);
    
    // Basic Markdown removal for typing effect (simplification)
    const cleanText = text.replace(/\\*\\*/g, '');
    
    let currentHtml = '';
    
    for (let i = 0; i < cleanText.length; i++) {
        // Handle newlines instantly
        if (cleanText[i] === '\n') {
            currentHtml += '<br>';
        } else {
             currentHtml += cleanText[i];
        }
        
        msgDiv.innerHTML = currentHtml;
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
        // Random typing delay
        await new Promise(r => setTimeout(r, Math.random() * 15 + 5));
    }
}

// Locking vault visually
document.getElementById('lock-session').addEventListener('click', () => {
    if(confirm("Re-lock the Foundry? You will need to regulate breathing to enter again.")) {
        document.body.classList.add('locked');
        document.getElementById('metronome-overlay').classList.add('active');
        document.getElementById('cycle-count').textContent = '0 / 6';
        initMetronome(); // Re-init
    }
});

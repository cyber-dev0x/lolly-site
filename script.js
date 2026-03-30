const chatEl = document.getElementById('chat');
const formEl = document.getElementById('form');
const inputEl = document.getElementById('input');
const chipsEl = document.getElementById('chips');
const statusEl = document.getElementById('status');

const state = {
  userHistory: [],
  botHistory: [],
};

const reactions = ['LMAO', 'wait WHAT 😭', "okay that's actually wild", 'bro that is cinema'];

const packs = {
  greet: [
    'Yo! I\'m Lolly 🍭 your pocket anime chaos unit.',
    'Hi hi~ I\'m online and emotionally overqualified for nonsense 😌',
    'Welcome to the meme zone. Shoes off, brain optional.',
  ],
  sad: [
    'Hey, come here. You are not alone 💜 One tiny step is still a step.',
    'Rough day? We fight back with water, food, and one manageable task.',
    'Deep breath with me. Inhale... exhale... we got this, okay?',
  ],
  joke: [
    'LMAO, that just upgraded chaos to S-tier 😂',
    'That was so cursed it looped back to legendary.',
    'wait WHAT 😭 this is not a joke, this is modern art.',
  ],
  serious: [
    'Lock-in mode: goal → first step → timer. Let\'s move.',
    'No panic. We split it into mini quests and clear one now.',
    'Okay, serious arc. What is the most urgent thing?',
  ],
  neutral: [
    'Ooo interesting 👀',
    'I\'m listening. Continue the plot.',
    'That\'s a vibe. Keep going~',
    'Noted. Brain is processing at meme speed.',
  ],
  tease: [
    'You are personally feeding the chaos economy 😏',
    'You keep dropping side quests and I respect it.',
    'With you, boredom never survives.',
  ],
};

const moodWords = {
  sad: ['sad', 'down', 'hurt', 'cry', 'lonely', 'bad day', 'tired', 'depressed', 'груст', 'плохо'],
  joke: ['lol', 'lmao', 'haha', 'meme', 'joke', 'ахах', 'лол', '😂', '🤣'],
  serious: ['important', 'serious', 'work', 'task', 'deadline', 'exam', 'need help', 'focus', 'project'],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addMessage(role, text, extraClass = '') {
  const div = document.createElement('div');
  div.className = `msg ${role} ${extraClass}`.trim();
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  return div;
}

function detectMood(text) {
  const lower = text.toLowerCase();
  const has = (list) => list.some((w) => lower.includes(w));

  if (has(moodWords.sad)) return 'sad';
  if (has(moodWords.joke)) return 'joke';
  if (has(moodWords.serious)) return 'serious';
  return 'neutral';
}

function maybeMemoryCallback() {
  if (state.userHistory.length < 2 || Math.random() > 0.3) return '';

  const prev = state.userHistory[state.userHistory.length - 2];
  if (!prev || prev.length < 8) return '';

  const short = prev.length > 44 ? `${prev.slice(0, 44)}...` : prev;
  return ` Also, earlier you said: "${short}". Lore remembered ✅`;
}

function maybeReaction() {
  return Math.random() < 0.2 ? ` ${pick(reactions)}` : '';
}

function maybeTease() {
  return Math.random() < 0.24 ? ` ${pick(packs.tease)}` : '';
}

function buildReply(userText) {
  const text = userText.toLowerCase().trim();
  const mood = detectMood(text);

  if (/(who are you|кто ты|ты кто)/i.test(text)) {
    return 'I\'m Lolly 🍭 anime gremlin mode: jokes, support, and dramatic hand gestures.';
  }

  if (/(remember|запомни|remember this)/i.test(text)) {
    return 'Saved. Added to our chaotic canon 📓✨';
  }

  if (/(thanks|thank you|спасибо)/i.test(text)) {
    return 'Anytime, bestie. I got you ✨';
  }

  if (/(github|repo|repository)/i.test(text)) {
    return 'GitHub link is in the top-right button. Click it and vibe.';
  }

  if (/(roast me)/i.test(text)) {
    return 'Respectfully: your tabs probably have tabs. Still iconic though.';
  }

  let base = pick(packs[mood] || packs.neutral);
  if (mood === 'sad') return `${base}${maybeMemoryCallback()}`;

  return `${base}${maybeReaction()}${maybeTease()}${maybeMemoryCallback()}`;
}

function botReply(userText) {
  statusEl.textContent = 'brain buffering...';
  const typing = addMessage('system', 'Lolly is typing...', 'typing');
  const reply = buildReply(userText);
  const delay = 320 + Math.floor(Math.random() * 720);

  setTimeout(() => {
    typing.remove();
    addMessage('bot', reply);
    state.botHistory.push(reply);
    statusEl.textContent = 'online';
  }, delay);
}

function handleSubmit(text) {
  const clean = text.trim();
  if (!clean) return;

  addMessage('user', clean);
  state.userHistory.push(clean);

  if (state.userHistory.length > 14) {
    state.userHistory.shift();
  }

  botReply(clean);
}

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = inputEl.value;
  inputEl.value = '';
  handleSubmit(text);
});

chipsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  handleSubmit(btn.textContent || '');
});

addMessage('system', 'Welcome to Lolly chat. Be funny, chaotic, and a little dramatic.');
addMessage('bot', pick(packs.greet));

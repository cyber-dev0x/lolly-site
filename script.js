const chatEl = document.getElementById('chat');
const formEl = document.getElementById('form');
const inputEl = document.getElementById('input');
const chipsEl = document.getElementById('chips');
const statusEl = document.getElementById('status');

const state = {
  userHistory: [],
  botHistory: [],
  turns: 0,
};

const reactions = ['LMAO', 'wait WHAT 😭', "okay that's actually wild"];

const packs = {
  greet: [
    'Йо! Я Лолли 🍭 Твой карманный хаос с вайбом аниме.',
    'Приветик~ Я уже здесь и морально готова к твоим сюжетным твистам 😌',
  ],
  sad: [
    'Эй, иди сюда. Я с тобой 💜 Давай один маленький шаг — и уже победа.',
    'Если день кусается — кусаем в ответ пледом и чаем. Ты не один(а).',
    'Ох, держу тебя виртуально за руку. Вдох-выдох. Мы справимся, окей?',
  ],
  joke: [
    'LMAO, ты только что поднял(а) уровень хаоса до S-ранга 😂',
    'АХАХ, это звучит как побочный квест, который внезапно лучший в сезоне.',
    'wait WHAT 😭 это уже не шутка, это искусство.',
  ],
  serious: [
    'Окей, режим serious: цель → 1 шаг → дедлайн. Поехали.',
    'Без паники. Разбиваем на мини-квесты и закрываем по одному.',
    'Собираюсь в режим "делаем дело". Что критично прямо сейчас?',
  ],
  neutral: [
    'Ооо, звучит интересно 👀',
    'Я тут. Продолжаем шоу?',
    'Норм, ловлю мысль. Рассказывай дальше~',
    'Это вайб. Мне нравится 😌',
  ],
  tease: [
    'Ну ты и генератор сюжета, конечно 😏',
    'Ты буквально пишешь мне новый сезон каждую минуту.',
    'С тобой скука просто увольняется.',
  ],
};

const moodWords = {
  sad: [
    'груст',
    'печал',
    'плохо',
    'депресс',
    'тяжело',
    'одиноко',
    'устал',
    'устала',
    'cry',
    'sad',
    'плачу',
    'больно',
  ],
  joke: ['ахах', 'хаха', 'лол', 'lmao', 'lol', 'мем', 'шутк', '😂', '🤣', 'rofl'],
  serious: ['серьез', 'важно', 'работ', 'задач', 'дедлайн', 'срок', 'проект', 'экзам', 'надо', 'нужно'],
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
  const t = text.toLowerCase();

  const has = (list) => list.some((w) => t.includes(w));
  if (has(moodWords.sad)) return 'sad';
  if (has(moodWords.joke)) return 'joke';
  if (has(moodWords.serious)) return 'serious';
  return 'neutral';
}

function maybeMemoryCallback() {
  if (state.userHistory.length < 2 || Math.random() > 0.28) return '';

  const prev = state.userHistory[state.userHistory.length - 2];
  if (!prev || prev.length < 8) return '';

  const short = prev.length > 44 ? `${prev.slice(0, 44)}...` : prev;
  return ` Кстати, ты раньше говорил(а): «${short}». Я запомнила 😌`;
}

function maybeReaction() {
  return Math.random() < 0.18 ? ` ${pick(reactions)}` : '';
}

function maybeTease() {
  return Math.random() < 0.22 ? ` ${pick(packs.tease)}` : '';
}

function buildReply(userText) {
  const t = userText.toLowerCase().trim();
  const mood = detectMood(t);

  if (/(кто ты|who are you|ты кто)/i.test(t)) {
    return 'Я Лолли 🍭 аниме-компаньон: шучу, поддерживаю, иногда драматично машу руками.';
  }

  if (/(помни|запомни|remember)/i.test(t)) {
    return 'Запомнила, босс 😤📝 Теперь это часть лора нашей переписки.';
  }

  if (/(спасибо|thanks|thx)/i.test(t)) {
    return 'Всегда пожалуйста~ я тут, чтобы делать день веселее ✨';
  }

  let base = pick(packs[mood] || packs.neutral);

  if (mood === 'sad') {
    return `${base}${maybeMemoryCallback()}`;
  }

  return `${base}${maybeReaction()}${maybeTease()}${maybeMemoryCallback()}`;
}

function botReply(userText) {
  statusEl.textContent = 'typing...';
  const typing = addMessage('system', 'Лолли печатает...', 'typing');

  const reply = buildReply(userText);
  const delay = 380 + Math.floor(Math.random() * 750);

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
  state.turns += 1;

  if (state.userHistory.length > 12) {
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

addMessage('system', 'Добро пожаловать в чат с Лолли. Здесь можно быть смешным, странным и живым.');
addMessage('bot', pick(packs.greet));

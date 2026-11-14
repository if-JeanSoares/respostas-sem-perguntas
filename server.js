// Respostas sem Perguntas — servidor do jogo
// Rode com: npm install && npm start
const express = require('express');
const http = require('http');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const rooms = new Map();
const newId = () => crypto.randomBytes(8).toString('hex');

// Banco de perguntas pronto (sem autor): a resposta é conferida automaticamente.
const BANK = require('./questions.js');
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Separa a pergunta em palavras. Pontuação no fim da palavra (vírgula, ponto...) fica visível.
function tokenize(text) {
  const clean = String(text).trim().replace(/\s*\?+\s*$/, '');
  return clean.split(/\s+/).filter(Boolean).map((t) => {
    const m = t.match(/^(.*?)([,.;:!]*)$/);
    return m && m[1] ? { word: m[1], punct: m[2] } : { word: t, punct: '' };
  });
}

const normalize = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function autoMatch(guess, answer) {
  const g = normalize(guess);
  return String(answer)
    .split('/')
    .map(normalize)
    .filter(Boolean)
    .some((a) => a === g);
}

function currentValue(round) {
  const n = round.tokens.length;
  const k = round.revealed.length;
  return Math.max(1, n - Math.max(0, k - 1));
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Quem pode jogar a pergunta atual: conectado e não é o autor dela.
function eligible(room, p) {
  return p.connected && (!room.round || p.id !== room.round.authorId);
}

function findEligibleFrom(room, start, includeStart) {
  const n = room.players.length;
  for (let step = includeStart ? 0 : 1; step <= n; step++) {
    const i = (((start + step) % n) + n) % n;
    if (eligible(room, room.players[i])) return i;
  }
  return -1;
}

function canJudge(room, playerId) {
  const r = room.round;
  if (!r || room.phase !== 'judging' || !r.authorId) return false;
  const author = room.players.find((p) => p.id === r.authorId);
  return !!author && author.connected && author.id === playerId; // só o autor julga
}

function stateFor(room, viewerId) {
  const r = room.round;
  const turnPlayer = r && r.turn >= 0 ? room.players[r.turn] : null;
  const isAuthor = r && r.authorId === viewerId;
  const showAll = room.phase === 'roundEnd' || isAuthor;
  const myQuestions = room.questions.filter((q) => q.authorId === viewerId);
  return {
    code: room.code,
    phase: room.phase,
    me: viewerId,
    players: room.players.map((p) => ({ id: p.id, name: p.name, score: p.score, connected: p.connected })),
    questionCount: room.questions.length,
    questionsByPlayer: room.players.map((p) => ({
      name: p.name,
      count: room.questions.filter((q) => q.authorId === p.id).length,
    })),
    bankSize: BANK.length,
    useBank: room.useBank,
    limit: room.limit,
    poolCount: room.questions.length + (room.useBank ? BANK.length : 0),
    freshCount:
      room.questions.filter((q) => !room.used.has(q.text)).length +
      (room.useBank ? BANK.filter(([text]) => !room.used.has(text)).length : 0),
    myQuestions: myQuestions.map((q) => ({ id: q.id, text: q.text, answer: q.answer })),
    qNumber: room.qIndex + 1,
    qTotal: room.order.length,
    authorId: r ? r.authorId : null,
    authorName: r ? r.authorName : null,
    isAuthor: !!isAuthor,
    turnId: turnPlayer ? turnPlayer.id : null,
    turnName: turnPlayer ? turnPlayer.name : null,
    value: r ? currentValue(r) : 0,
    wordCount: r ? r.tokens.length : 0,
    blanks: r
      ? r.tokens.map((t, i) => ({
          i,
          word: r.revealed.includes(i) || showAll ? t.word : null,
          revealed: r.revealed.includes(i),
          punct: t.punct,
        }))
      : [],
    allRevealed: r ? r.revealed.length >= r.tokens.length : false,
    lastGuess: r ? r.lastGuess : null,
    canJudge: canJudge(room, viewerId),
    log: r ? r.log : [],
    answer: r && showAll ? r.answer : null,
    fullQuestion: r && showAll ? r.text : null,
    winner: r ? r.winner : null,
  };
}

function broadcast(room) {
  for (const p of room.players) {
    if (p.socketId) io.to(p.socketId).emit('state', stateFor(room, p.id));
  }
}

function endRound(room, winner) {
  room.round.winner = winner || null;
  room.phase = 'roundEnd';
}

function startQuestion(room) {
  const q = room.order[room.qIndex];
  room.round = {
    text: q.text,
    answer: q.answer,
    authorId: q.authorId,
    authorName: q.authorName,
    tokens: tokenize(q.text),
    revealed: [],
    turn: -1,
    lastGuess: null,
    log: [],
    winner: null,
  };
  room.round.turn = findEligibleFrom(room, room.starter, true);
  if (room.round.turn < 0) endRound(room, null); // ninguém pode jogar essa pergunta
  else room.phase = 'reveal';
}

function advanceTurn(room) {
  const r = room.round;
  const next = findEligibleFrom(room, r.turn, false);
  if (next < 0) return endRound(room, null);
  r.turn = next;
  r.lastGuess = null;
  room.phase = r.revealed.length >= r.tokens.length ? 'guess' : 'reveal';
}

function resolveGuess(room, correct) {
  const r = room.round;
  const player = room.players[r.turn];
  const value = currentValue(r);
  r.log.push({ name: player.name, guess: r.lastGuess, correct, value });
  if (correct) {
    player.score += value;
    endRound(room, { name: player.name, value });
  } else {
    advanceTurn(room);
  }
}

io.on('connection', (socket) => {
  let ctx = { code: null, playerId: null };
  const getRoom = () => (ctx.code ? rooms.get(ctx.code) : null);
  const me = () => {
    const room = getRoom();
    return room && room.players.find((p) => p.id === ctx.playerId);
  };

  // Entrar (ou criar) uma sala: só nome + código
  socket.on('join', ({ code, name, playerId } = {}, ack) => {
    code = String(code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
    name = String(name || '').trim().slice(0, 20);
    if (!code) return ack && ack({ ok: false, error: 'Digite o código da sala.' });

    let room = rooms.get(code);
    if (!room) {
      room = { code, players: [], questions: [], order: [], qIndex: -1, starter: 0, round: null, phase: 'lobby', useBank: true, limit: DEFAULT_LIMIT, used: new Set() };
      rooms.set(code, room);
    }

    let player = playerId && room.players.find((p) => p.id === playerId);
    if (!player) {
      if (!name) return ack && ack({ ok: false, error: 'Digite seu nome.' });
      const same = room.players.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (same && same.connected) return ack && ack({ ok: false, error: 'Já tem alguém com esse nome na sala.' });
      player = same || { id: newId(), name, score: 0 };
      if (!same) room.players.push(player);
    }
    player.socketId = socket.id;
    player.connected = true;
    ctx = { code, playerId: player.id };
    ack && ack({ ok: true, playerId: player.id, code, name: player.name });

    // Se quem estava na vez caiu e voltou, segue normal. Se o jogo travou sem ninguém na vez, destrava.
    if (room.round && room.round.turn < 0 && ['reveal', 'guess'].includes(room.phase)) advanceTurn(room);
    broadcast(room);
  });

  socket.on('leave', () => {
    const room = getRoom();
    const p = me();
    if (!room || !p) return;
    if (room.phase === 'lobby') {
      room.players = room.players.filter((x) => x.id !== p.id);
      room.questions = room.questions.filter((q) => q.authorId !== p.id);
    } else {
      p.connected = false;
      p.socketId = null;
      handleAbsence(room, p);
    }
    ctx = { code: null, playerId: null };
    broadcast(room);
  });

  // ---------- Lobby ----------
  socket.on('question:add', ({ text, answer } = {}, ack) => {
    const room = getRoom();
    const p = me();
    if (!room || !p) return;
    text = String(text || '').trim().slice(0, 300);
    answer = String(answer || '').trim().slice(0, 120);
    if (!text || !answer) return ack && ack({ ok: false, error: 'Preencha a pergunta e a resposta.' });
    if (tokenize(text).length < 2) return ack && ack({ ok: false, error: 'A pergunta precisa ter pelo menos 2 palavras.' });
    room.questions.push({ id: newId(), text, answer, authorId: p.id, authorName: p.name });
    ack && ack({ ok: true });
    broadcast(room);
  });

  socket.on('question:remove', ({ id } = {}) => {
    const room = getRoom();
    const p = me();
    if (!room || !p) return;
    room.questions = room.questions.filter((q) => !(q.id === id && q.authorId === p.id));
    broadcast(room);
  });

  socket.on('settings', ({ useBank, limit } = {}) => {
    const room = getRoom();
    if (!room || !me() || room.phase !== 'lobby') return;
    if (typeof useBank === 'boolean') room.useBank = useBank;
    limit = Number(limit);
    if (Number.isInteger(limit)) room.limit = Math.min(MAX_LIMIT, Math.max(1, limit));
    broadcast(room);
  });

  socket.on('game:start', (_, ack) => {
    const room = getRoom();
    if (!room || room.phase !== 'lobby') return;
    const bank = room.useBank
      ? BANK.map(([text, answer]) => ({ text, answer, authorId: null, authorName: null }))
      : [];
    const pool = room.questions.concat(bank);
    if (!pool.length) return ack && ack({ ok: false, error: 'Cadastrem uma pergunta ou liguem o banco de perguntas.' });
    room.players.forEach((p) => (p.score = 0));
    // Sorteia sem repetir: primeiro as perguntas que ainda não saíram nesta sala.
    const fresh = pool.filter((q) => !room.used.has(q.text));
    let pick = shuffle(fresh).slice(0, room.limit);
    if (pick.length < room.limit) {
      // Acabaram as inéditas: completa com as já usadas e recomeça o ciclo.
      const rest = shuffle(pool.filter((q) => !pick.includes(q))).slice(0, room.limit - pick.length);
      room.used = new Set();
      pick = shuffle(pick.concat(rest));
    }
    pick.forEach((q) => room.used.add(q.text));
    room.order = pick;
    room.qIndex = 0;
    room.starter = 0;
    startQuestion(room);
    ack && ack({ ok: true });
    broadcast(room);
  });

  // ---------- Partida ----------
  socket.on('reveal', ({ i } = {}) => {
    const room = getRoom();
    const p = me();
    if (!room || !p || room.phase !== 'reveal') return;
    const r = room.round;
    if (room.players[r.turn].id !== p.id) return;
    i = Number(i);
    if (!Number.isInteger(i) || i < 0 || i >= r.tokens.length || r.revealed.includes(i)) return;
    r.revealed.push(i);
    room.phase = 'guess';
    broadcast(room);
  });

  socket.on('guess', ({ text } = {}) => {
    const room = getRoom();
    const p = me();
    if (!room || !p || room.phase !== 'guess') return;
    const r = room.round;
    if (room.players[r.turn].id !== p.id) return;
    const guess = String(text || '').trim().slice(0, 120);
    if (!guess) return;
    r.lastGuess = guess;
    if (autoMatch(guess, r.answer)) {
      resolveGuess(room, true); // resposta idêntica: acerto automático
    } else {
      room.phase = 'judging';
      // Sem ninguém para julgar (pergunta do banco, sem autor): conta como erro
      if (!room.players.some((x) => canJudge(room, x.id))) resolveGuess(room, false);
    }
    broadcast(room);
  });

  socket.on('judge', ({ correct } = {}) => {
    const room = getRoom();
    const p = me();
    if (!room || !p || !canJudge(room, p.id)) return;
    resolveGuess(room, !!correct);
    broadcast(room);
  });

  socket.on('skipTurn', () => {
    const room = getRoom();
    if (!room || !['reveal', 'guess'].includes(room.phase)) return;
    const r = room.round;
    const cur = room.players[r.turn];
    r.log.push({ name: cur.name, guess: '(pulou a vez)', correct: false, value: currentValue(r) });
    advanceTurn(room);
    broadcast(room);
  });

  socket.on('giveUp', () => {
    const room = getRoom();
    if (!room || !['reveal', 'guess', 'judging'].includes(room.phase)) return;
    endRound(room, null);
    broadcast(room);
  });

  socket.on('next', () => {
    const room = getRoom();
    if (!room || room.phase !== 'roundEnd') return;
    if (room.qIndex + 1 >= room.order.length) {
      room.phase = 'gameOver';
    } else {
      room.qIndex += 1;
      room.starter = (room.starter + 1) % Math.max(1, room.players.length);
      startQuestion(room);
    }
    broadcast(room);
  });

  socket.on('backToLobby', () => {
    const room = getRoom();
    if (!room || !['gameOver', 'roundEnd'].includes(room.phase)) return;
    room.phase = 'lobby';
    room.round = null;
    room.qIndex = -1;
    room.order = [];
    broadcast(room);
  });

  socket.on('disconnect', () => {
    const room = getRoom();
    const p = me();
    if (!room || !p || p.socketId !== socket.id) return;
    p.connected = false;
    p.socketId = null;
    // Dá 20s para voltar (ex.: recarregou a página) antes de pular a vez
    setTimeout(() => {
      if (!p.connected && rooms.get(room.code) === room) {
        handleAbsence(room, p);
        broadcast(room);
      }
    }, 20000);
    broadcast(room);
  });
});

function handleAbsence(room, p) {
  const r = room.round;
  if (!r || !['reveal', 'guess', 'judging'].includes(room.phase)) return;
  if (r.turn >= 0 && room.players[r.turn] && room.players[r.turn].id === p.id) {
    if (room.phase === 'judging') return; // o palpite já foi dado, alguém julga
    advanceTurn(room);
  } else if (room.phase === 'judging' && !room.players.some((x) => canJudge(room, x.id))) {
    resolveGuess(room, false);
  }
}

// Limpa salas vazias depois de 6 horas
setInterval(() => {
  for (const [code, room] of rooms) {
    if (room.players.some((p) => p.connected)) room.emptySince = null;
    else if (!room.emptySince) room.emptySince = Date.now();
    else if (Date.now() - room.emptySince > 6 * 3600 * 1000) rooms.delete(code);
  }
}, 10 * 60 * 1000);

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n🎤 Respostas sem Perguntas rodando!\n');
  console.log(`   Neste computador:    http://localhost:${PORT}`);
  for (const list of Object.values(os.networkInterfaces())) {
    for (const net of list || []) {
      if (net.family === 'IPv4' && !net.internal) console.log(`   Na mesma rede Wi-Fi: http://${net.address}:${PORT}`);
    }
  }
  console.log(`\n   Para amigos de fora, use um túnel (ex.: npx localtunnel --port ${PORT})\n`);
});

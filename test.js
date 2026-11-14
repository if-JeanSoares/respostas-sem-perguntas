// Teste rápido de ponta a ponta: node test.js (com o servidor rodando na porta 3000)
const { io } = require('socket.io-client');
const URL = 'http://localhost:' + (process.env.PORT || 3000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const emit = (s, ev, data) => new Promise((res) => s.emit(ev, data, res));
function client(name) {
  const s = io(URL, { forceNew: true });
  s.st = null;
  s.on('state', (x) => (s.st = x));
  s.name = name;
  return s;
}
const assert = (c, m) => { if (!c) { console.error('FALHOU:', m); process.exit(1); } console.log('ok -', m); };

(async () => {
  const [a, b, c] = ['Ana', 'Beto', 'Caio'].map(client);
  await sleep(300);
  for (const s of [a, b, c]) assert((await emit(s, 'join', { code: 'teste', name: s.name })).ok, s.name + ' entrou');
  assert(!(await emit(client('x'), 'join', { code: 'TESTE', name: 'ana' })).ok, 'nome repetido é barrado');
  assert((await emit(a, 'question:add', { text: 'Anjo das pernas tortas é o apelido de qual jogador brasileiro?', answer: 'Garrincha/Mané Garrincha' })).ok, 'Ana cadastrou pergunta');
  assert(!(await emit(b, 'question:add', { text: '', answer: 'x' })).ok, 'pergunta vazia é barrada');
  await sleep(100);
  assert(b.st.questionCount === 1 && b.st.myQuestions.length === 0, 'Beto vê a contagem mas não a pergunta da Ana');
  b.emit('settings', { useBank: false }); await sleep(100);
  assert(b.st.poolCount === 1 && b.st.bankSize > 100, 'banco desligado: só a pergunta da Ana');
  assert((await emit(b, 'game:start')).ok, 'partida começou');
  await sleep(100);
  assert(b.st.wordCount === 11 && b.st.value === 11, '11 palavras, vale 11');
  assert(b.st.blanks.every((x) => x.word === null) && b.st.answer === null, 'jogador não recebe palavras nem resposta');
  assert(a.st.isAuthor && a.st.blanks.every((x) => x.word) && a.st.answer, 'autora vê tudo');
  assert(b.st.turnId === b.st.me, 'autora é pulada: vez do Beto');
  a.emit('reveal', { i: 0 }); c.emit('reveal', { i: 0 }); await sleep(100);
  assert(b.st.blanks.every((x) => x.word === null), 'quem não está na vez não revela');
  b.emit('reveal', { i: 1 }); await sleep(100);
  assert(c.st.blanks[1].word === 'das' && c.st.phase === 'guess', 'palavra 2 revelada para todos');
  b.emit('guess', { text: 'Pelé' }); await sleep(100);
  assert(a.st.phase === 'judging' && a.st.canJudge && !c.st.canJudge, 'chute diferente vai para a autora julgar');
  a.emit('judge', { correct: false }); await sleep(100);
  assert(c.st.turnId === c.st.me && c.st.phase === 'reveal' && c.st.value === 11, 'errou: vez do Caio, ainda vale 11');
  c.emit('reveal', { i: 3 }); await sleep(100);
  assert(c.st.value === 10 && c.st.blanks[3].word === 'tortas', '2ª palavra: vale 10');
  c.emit('guess', { text: 'mane garrincha' }); await sleep(100);
  assert(c.st.phase === 'roundEnd' && c.st.winner.name === 'Caio' && c.st.winner.value === 10, 'acerto automático (sem acento/maiúscula): Caio +10');
  assert(b.st.answer && b.st.fullQuestion, 'resposta revelada no fim');
  b.emit('next'); await sleep(100);
  assert(b.st.phase === 'gameOver' && b.st.players.find((p) => p.name === 'Caio').score === 10, 'fim de jogo com placar certo');
  // Banco: sorteia 10, sem repetir, e muda a cada partida
  const d = client('Duda'); await sleep(200);
  await emit(d, 'join', { code: 'banco', name: 'Duda' }); await sleep(100);
  assert(d.st.useBank && d.st.limit === 10, 'sala nova: banco ligado, limite 10');
  await emit(d, 'game:start'); await sleep(100);
  assert(d.st.qTotal === 10, 'partida com 10 perguntas sorteadas');
  // A última pergunta é a mais longa
  const lens = [];
  while (d.st.phase !== 'gameOver') {
    if (d.st.phase !== 'roundEnd') { lens.push(d.st.wordCount); d.emit('giveUp'); await sleep(15); }
    if (d.st.phase === 'roundEnd') { d.emit('next'); await sleep(15); }
  }
  assert(lens.length === 10 && lens[9] === Math.max(...lens), 'última pergunta é a mais longa: ' + lens.join(','));
  // Sem repetição entre partidas da mesma sala
  const e = client('Edu'); await sleep(200);
  await emit(e, 'join', { code: 'repete', name: 'Edu' });
  e.emit('settings', { limit: 50 }); await sleep(100);
  const seen = [];
  for (let m = 0; m < 3; m++) {
    await emit(e, 'game:start'); await sleep(50);
    while (e.st.phase !== 'gameOver') {
      if (e.st.phase !== 'roundEnd') { e.emit('giveUp'); await sleep(15); }
      if (e.st.phase === 'roundEnd') { seen.push(e.st.fullQuestion); e.emit('next'); await sleep(15); }
    }
    e.emit('backToLobby'); await sleep(50);
    if (m === 1) assert(new Set(seen).size === 100 && e.st.freshCount === e.st.bankSize - 100, '2 partidas de 50: 100 perguntas diferentes');
    if (m === 2) assert(new Set(seen).size === 150, '3 partidas de 50: 150 perguntas diferentes');
  }
  console.log('\nTudo certo!');
  process.exit(0);
})();

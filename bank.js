// Monta o banco completo: perguntas escritas à mão (questions.js) + perguntas geradas a partir de tabelas.
// Cada item tem uma ou mais redações (texts) e uma resposta. O jogo sorteia uma redação por vez.
// Use "/" na resposta para aceitar alternativas.
const handwritten = require('./questions.js');

const items = [];
const add = (texts, answer) => items.push({ texts: [].concat(texts), answer });

for (const [text, answer] of handwritten) add(text, answer);

// ---------- Capitais do mundo: [país com preposição, capital, país como resposta] ----------
const CAPITALS = [
  ['da França', 'Paris', 'França'], ['da Itália', 'Roma', 'Itália'], ['da Espanha', 'Madri/Madrid', 'Espanha'],
  ['do Reino Unido', 'Londres', 'Reino Unido/Inglaterra'], ['da China', 'Pequim/Beijing', 'China'],
  ['da Índia', 'Nova Délhi/Nova Deli/Nova Delhi', 'Índia'], ['da Coreia do Sul', 'Seul', 'Coreia do Sul/Coreia'],
  ['do México', 'Cidade do México', null], ['do Chile', 'Santiago', 'Chile'], ['da Colômbia', 'Bogotá', 'Colômbia'],
  ['da Venezuela', 'Caracas', 'Venezuela'], ['do Uruguai', 'Montevidéu', 'Uruguai'], ['do Paraguai', 'Assunção', 'Paraguai'],
  ['do Equador', 'Quito', 'Equador'], ['de Cuba', 'Havana', 'Cuba'], ['do Egito', 'Cairo', 'Egito'],
  ['da Nigéria', 'Abuja', 'Nigéria'], ['do Quênia', 'Nairóbi', 'Quênia'], ['do Marrocos', 'Rabat', 'Marrocos'],
  ['de Angola', 'Luanda', 'Angola'], ['de Moçambique', 'Maputo', 'Moçambique'], ['da Nova Zelândia', 'Wellington', 'Nova Zelândia'],
  ['da Turquia', 'Ancara/Ankara', 'Turquia'], ['da Grécia', 'Atenas', 'Grécia'], ['da Holanda', 'Amsterdã/Amsterdam', 'Holanda/Países Baixos'],
  ['da Bélgica', 'Bruxelas', 'Bélgica'], ['da Suíça', 'Berna', 'Suíça'], ['da Áustria', 'Viena', 'Áustria'],
  ['da Suécia', 'Estocolmo', 'Suécia'], ['da Noruega', 'Oslo', 'Noruega'], ['da Dinamarca', 'Copenhague', 'Dinamarca'],
  ['da Finlândia', 'Helsinque', 'Finlândia'], ['da Irlanda', 'Dublin', 'Irlanda'], ['da Polônia', 'Varsóvia', 'Polônia'],
  ['da Ucrânia', 'Kiev/Kyiv', 'Ucrânia'], ['da Hungria', 'Budapeste', 'Hungria'], ['da República Tcheca', 'Praga', 'República Tcheca/Tchéquia'],
  ['da Croácia', 'Zagreb', 'Croácia'], ['da Tailândia', 'Bangkok/Banguecoque', 'Tailândia'], ['do Vietnã', 'Hanói', 'Vietnã'],
  ['das Filipinas', 'Manila', 'Filipinas'], ['do Irã', 'Teerã', 'Irã'], ['do Iraque', 'Bagdá', 'Iraque'],
  ['da Arábia Saudita', 'Riad', 'Arábia Saudita'], ['do Líbano', 'Beirute', 'Líbano'], ['do Catar', 'Doha', 'Catar/Qatar'],
  ['dos Emirados Árabes Unidos', 'Abu Dhabi', 'Emirados Árabes Unidos/Emirados Árabes'], ['do Paquistão', 'Islamabad', 'Paquistão'],
  ['do Afeganistão', 'Cabul', 'Afeganistão'], ['de Bangladesh', 'Daca', 'Bangladesh'], ['do Nepal', 'Catmandu/Kathmandu', 'Nepal'],
  ['da Mongólia', 'Ulan Bator/Ulaanbaatar', 'Mongólia'], ['da Islândia', 'Reykjavik/Reiquiavique', 'Islândia'],
  ['da Escócia', 'Edimburgo', 'Escócia'], ['da Jamaica', 'Kingston', 'Jamaica'], ['do Panamá', 'Cidade do Panamá', null],
  ['da Costa Rica', 'San José/São José', 'Costa Rica'], ['do Senegal', 'Dacar/Dakar', 'Senegal'], ['da Etiópia', 'Adis Abeba', 'Etiópia'],
  ['de Gana', 'Acra', 'Gana'], ['da Romênia', 'Bucareste', 'Romênia'], ['da Bulgária', 'Sófia', 'Bulgária'], ['da Sérvia', 'Belgrado', 'Sérvia'],
];
for (const [de, capital, pais] of CAPITALS) {
  add([`Entre todas as cidades do mundo, qual delas é a capital ${de}?`, `Qual é o nome da cidade que funciona como capital ${de}?`, `Se você fosse visitar a sede do governo ${de}, para qual cidade iria?`], capital);
  if (pais) {
    const c = capital.split('/')[0];
    add([`A cidade de ${c} é a capital e a sede do governo de qual país?`, `Quem visita ${c} está conhecendo a capital de qual país do mundo?`, `De qual país do mundo a cidade de ${c} é a capital oficial?`], pais);
  }
}

// ---------- Capitais dos estados brasileiros ----------
const STATES = [
  ['do Acre', 'Rio Branco', 'Acre'], ['de Alagoas', 'Maceió', 'Alagoas'], ['do Amapá', 'Macapá', 'Amapá'], ['do Amazonas', 'Manaus', 'Amazonas'],
  ['do Ceará', 'Fortaleza', 'Ceará'], ['do Espírito Santo', 'Vitória', 'Espírito Santo'], ['de Goiás', 'Goiânia', 'Goiás'],
  ['do Maranhão', 'São Luís', 'Maranhão'], ['de Mato Grosso', 'Cuiabá', 'Mato Grosso'], ['de Mato Grosso do Sul', 'Campo Grande', 'Mato Grosso do Sul'],
  ['de Minas Gerais', 'Belo Horizonte/BH', 'Minas Gerais/Minas'], ['do Pará', 'Belém', 'Pará'], ['da Paraíba', 'João Pessoa', 'Paraíba'],
  ['do Paraná', 'Curitiba', 'Paraná'], ['de Pernambuco', 'Recife', 'Pernambuco'], ['do Piauí', 'Teresina', 'Piauí'],
  ['do Rio Grande do Norte', 'Natal', 'Rio Grande do Norte'], ['do Rio Grande do Sul', 'Porto Alegre', 'Rio Grande do Sul'],
  ['de Rondônia', 'Porto Velho', 'Rondônia'], ['de Roraima', 'Boa Vista', 'Roraima'], ['de Santa Catarina', 'Florianópolis/Floripa', 'Santa Catarina'],
  ['de Sergipe', 'Aracaju', 'Sergipe'], ['do Tocantins', 'Palmas', 'Tocantins'],
];
for (const [de, capital, estado] of STATES) {
  const c = capital.split('/')[0];
  add([`Entre as cidades brasileiras, qual delas é a capital do estado ${de}?`, `Qual é o nome da cidade que é a capital do estado ${de}?`, `Em qual cidade brasileira fica a sede do governo do estado ${de}?`], capital);
  add([`A cidade de ${c} é a capital de qual dos estados brasileiros?`, `Quem mora em ${c} vive na capital de qual estado do Brasil?`], estado);
}

// ---------- Copas do Mundo: [ano, campeã, sede] ----------
const CUPS = [
  [1930, 'Uruguai', 'Uruguai'], [1934, 'Itália', 'Itália'], [1938, 'Itália', 'França'], [1950, 'Uruguai', 'Brasil'],
  [1954, 'Alemanha/Alemanha Ocidental', 'Suíça'], [1958, 'Brasil', 'Suécia'], [1962, 'Brasil', 'Chile'], [1966, 'Inglaterra', 'Inglaterra'],
  [1970, 'Brasil', 'México'], [1974, 'Alemanha/Alemanha Ocidental', 'Alemanha/Alemanha Ocidental'], [1978, 'Argentina', 'Argentina'],
  [1982, 'Itália', 'Espanha'], [1986, 'Argentina', 'México'], [1990, 'Alemanha/Alemanha Ocidental', 'Itália'],
  [1994, 'Brasil', 'Estados Unidos/EUA'], [1998, 'França', 'França'], [2002, null, 'Coreia do Sul e Japão/Japão e Coreia do Sul/Japão e Coreia/Coreia e Japão'],
  [2006, 'Itália', 'Alemanha'], [2010, 'Espanha', 'África do Sul'], [2014, null, null], [2018, 'França', 'Rússia'], [2022, null, 'Catar/Qatar'],
];
for (const [ano, campea, sede] of CUPS) {
  if (campea) add([`Qual seleção levantou a taça de campeã da Copa do Mundo de ${ano}?`, `Na Copa do Mundo de futebol masculino de ${ano}, qual seleção ficou com o título?`, `Qual país comemorou o título de campeão da Copa do Mundo de ${ano}?`], campea);
  if (sede) add([`Qual país recebeu os jogos e foi a sede da Copa do Mundo de ${ano}?`, `Em qual país os torcedores assistiram aos jogos da Copa do Mundo de ${ano}?`, `A Copa do Mundo de futebol masculino de ${ano} foi disputada em qual país?`], sede);
}

// ---------- Elementos químicos: [nome com artigo, símbolo] ----------
const ELEMENTS = [
  ['do hidrogênio', 'H'], ['do hélio', 'He'], ['do carbono', 'C'], ['do nitrogênio', 'N'], ['do sódio', 'Na'], ['do magnésio', 'Mg'],
  ['do alumínio', 'Al'], ['do silício', 'Si'], ['do fósforo', 'P'], ['do enxofre', 'S'], ['do cloro', 'Cl'], ['do potássio', 'K'],
  ['do cálcio', 'Ca'], ['do ferro', 'Fe'], ['do cobre', 'Cu'], ['do zinco', 'Zn'], ['da prata', 'Ag'], ['do estanho', 'Sn'],
  ['do mercúrio', 'Hg'], ['do chumbo', 'Pb'], ['do urânio', 'U'], ['do lítio', 'Li'], ['do flúor', 'F'], ['do neônio', 'Ne'],
  ['do níquel', 'Ni'], ['da platina', 'Pt'], ['do iodo', 'I'],
];
for (const [de, simbolo] of ELEMENTS) {
  const nome = de.split(' ')[1];
  add([`Na tabela periódica dos elementos, qual é o símbolo químico ${de}?`, `Qual é a letra ou sigla usada como símbolo químico ${de}?`], simbolo);
  add([`Na tabela periódica, qual elemento químico é representado pelo símbolo ${simbolo}?`, `Qual é o nome do elemento químico que tem o símbolo ${simbolo}?`, `Nas aulas de química, o símbolo ${simbolo} representa qual elemento da tabela periódica?`], nome[0].toUpperCase() + nome.slice(1));
}

// ---------- Moedas ----------
const CURRENCIES = [
  ['do Reino Unido', 'Libra/Libra esterlina'], ['da Argentina', 'Peso/Peso argentino'], ['do México', 'Peso/Peso mexicano'],
  ['da China', 'Yuan/Renminbi/Iuane'], ['da Índia', 'Rupia/Rúpia/Rupia indiana'], ['da Rússia', 'Rublo'], ['da Suíça', 'Franco suíço/Franco'],
  ['da Coreia do Sul', 'Won'], ['da África do Sul', 'Rand'], ['da Turquia', 'Lira/Lira turca'], ['do Brasil', 'Real'], ['de Portugal', 'Euro'],
  ['do Peru', 'Sol/Novo sol'], ['do Chile', 'Peso/Peso chileno'], ['do Paraguai', 'Guarani'], ['da Venezuela', 'Bolívar'],
  ['de Israel', 'Shekel/Novo shekel/Siclo'], ['da Tailândia', 'Baht'], ['da Suécia', 'Coroa sueca/Coroa'],
];
for (const [de, moeda] of CURRENCIES) {
  const no = de.startsWith('de ') ? de.replace(/^de /, 'em ') : de.replace(/^d/, 'n');
  add([`Como se chama a moeda oficial que circula no comércio ${de}?`, `Qual é o nome da moeda usada pela população no dia a dia ${no}?`, `Quem viaja a turismo precisa trocar dinheiro por qual moeda oficial ${de}?`], moeda);
}

// ---------- Jogos eletrônicos: consoles ----------
const CONSOLES = [
  ['PlayStation 5', 'Sony'], ['Xbox Series X', 'Microsoft'], ['Nintendo Switch', null], ['Mega Drive', 'Sega'], ['Game Boy', 'Nintendo'],
  ['Dreamcast', 'Sega'], ['Wii', 'Nintendo'], ['Super Nintendo', null], ['Master System', 'Sega'], ['PSP', 'Sony'], ['GameCube', 'Nintendo'],
  ['Xbox 360', 'Microsoft'], ['Nintendo 64', null], ['Sega Saturn', null], ['PlayStation 2', 'Sony'], ['Game Gear', 'Sega'], ['Steam Deck', 'Valve'],
];
for (const [consoleName, empresa] of CONSOLES) {
  if (empresa) add([`Qual empresa é a fabricante responsável pelo console de videogame ${consoleName}?`, `O console de videogame ${consoleName} foi criado e lançado por qual empresa?`, `No mercado de games, qual empresa colocou nas lojas o console ${consoleName}?`], empresa);
}

// ---------- Jogos eletrônicos: quem criou ----------
const DEVS = [
  ['Minecraft', 'Mojang'], ['Fortnite', 'Epic Games/Epic'], ['GTA V', 'Rockstar/Rockstar Games/Rockstar North'], ['The Witcher 3', 'CD Projekt Red/CD Projekt'],
  ['League of Legends', 'Riot Games/Riot'], ['Counter-Strike', 'Valve'], ['Overwatch', 'Blizzard/Blizzard Entertainment'], ['Dark Souls', 'FromSoftware/From Software'],
  ['Free Fire', 'Garena'], ['Valorant', 'Riot Games/Riot'], ['Among Us', 'Innersloth'], ['Cyberpunk 2077', 'CD Projekt Red/CD Projekt'],
  ['Elden Ring', 'FromSoftware/From Software'], ['Red Dead Redemption 2', 'Rockstar/Rockstar Games'], ["Assassin's Creed", 'Ubisoft'],
  ['Dota 2', 'Valve'], ['Half-Life', 'Valve'], ['World of Warcraft', 'Blizzard/Blizzard Entertainment'], ['Diablo', 'Blizzard/Blizzard Entertainment/Blizzard North'],
  ['Street Fighter', 'Capcom'], ['Resident Evil', 'Capcom'], ['Final Fantasy', 'Square Enix/Square/Squaresoft'], ['Metal Gear Solid', 'Konami'],
  ['Pac-Man', 'Namco/Bandai Namco'], ['Tekken', 'Namco/Bandai Namco'], ['Clash of Clans', 'Supercell'], ['Brawl Stars', 'Supercell'],
  ['Angry Birds', 'Rovio'], ['Candy Crush', 'King'], ['Genshin Impact', 'miHoYo/HoYoverse'], ['Hollow Knight', 'Team Cherry'],
  ['Rocket League', 'Psyonix'], ['Apex Legends', 'Respawn/Respawn Entertainment'], ['The Last of Us', 'Naughty Dog'], ['Uncharted', 'Naughty Dog'],
  ['God of War', 'Santa Monica Studio/Santa Monica/Sony Santa Monica/Sony'], ['Halo', 'Bungie/343 Industries/Halo Studios'], ['Monster Hunter', 'Capcom'], ['Mega Man', 'Capcom'],
  ['Castlevania', 'Konami'], ['Far Cry', 'Ubisoft'], ['Skyrim', 'Bethesda/Bethesda Game Studios'], ['Fallout 4', 'Bethesda/Bethesda Game Studios'],
  ['Hades', 'Supergiant Games/Supergiant'], ['Baldur\'s Gate 3', 'Larian Studios/Larian'], ['Horizon Zero Dawn', 'Guerrilla Games/Guerrilla'],
];
for (const [jogo, empresa] of DEVS) {
  add([`Qual empresa ou estúdio é responsável pelo desenvolvimento do jogo ${jogo}?`, `O jogo eletrônico ${jogo} foi criado e desenvolvido por qual empresa?`, `No mundo dos games, qual estúdio desenvolveu o jogo ${jogo}?`], empresa);
}

// ---------- Jogos eletrônicos: personagem -> franquia ----------
const CHARACTERS = [
  ['Link', 'The Legend of Zelda/Zelda/Legend of Zelda'], ['Kratos', 'God of War'], ['Master Chief', 'Halo'], ['Lara Croft', 'Tomb Raider'],
  ['Solid Snake', 'Metal Gear/Metal Gear Solid'], ['Geralt de Rívia', 'The Witcher/Witcher'], ['Pikachu', 'Pokémon'], ['Ryu', 'Street Fighter'],
  ['Scorpion', 'Mortal Kombat'], ['Cloud Strife', 'Final Fantasy/Final Fantasy VII/Final Fantasy 7'], ['Nathan Drake', 'Uncharted'],
  ['Ezio Auditore', "Assassin's Creed/Assassins Creed"], ['Arthur Morgan', 'Red Dead Redemption/Red Dead Redemption 2/Red Dead'],
  ['Ellie', 'The Last of Us/Last of Us'], ['Leon Kennedy', 'Resident Evil'], ['Samus Aran', 'Metroid'], ['Tails', 'Sonic/Sonic the Hedgehog'],
  ['Luigi', 'Mario/Super Mario/Super Mario Bros'], ['Aloy', 'Horizon/Horizon Zero Dawn/Horizon Forbidden West'], ['Jinx', 'League of Legends/LoL'],
  ['Tracer', 'Overwatch'], ['Gordon Freeman', 'Half-Life'], ['Dante', 'Devil May Cry'], ['Sub-Zero', 'Mortal Kombat'], ['Chun-Li', 'Street Fighter'],
  ['Ganondorf', 'The Legend of Zelda/Zelda/Legend of Zelda'], ['Bowser', 'Mario/Super Mario/Super Mario Bros'], ['Doutor Eggman', 'Sonic/Sonic the Hedgehog'],
  ['Sephiroth', 'Final Fantasy/Final Fantasy VII/Final Fantasy 7'], ['Tommy Vercetti', 'GTA/Grand Theft Auto/GTA Vice City'],
  ['Carl Johnson, o CJ', 'GTA/Grand Theft Auto/GTA San Andreas'], ['Jill Valentine', 'Resident Evil'], ['Pyramid Head', 'Silent Hill'],
  ['Agente 47', 'Hitman'], ['Jett', 'Valorant'], ['Yasuo', 'League of Legends/LoL'], ['Kazuya Mishima', 'Tekken'], ['GLaDOS', 'Portal'],
  ['Isaac Clarke', 'Dead Space'], ['Marcus Fenix', 'Gears of War/Gears'], ['Comandante Shepard', 'Mass Effect'], ['Sans', 'Undertale'],
  ['Zagreus', 'Hades'], ['Malenia', 'Elden Ring'], ['Alucard', 'Castlevania'], ['Fox McCloud', 'Star Fox/Starfox'], ['Creeper', 'Minecraft'],
  ['Yoshi', 'Mario/Super Mario/Super Mario Bros'], ['Tom Nook', 'Animal Crossing'], ['Claptrap', 'Borderlands'], ['Capitão Price', 'Call of Duty/COD/Modern Warfare'],
  ['Lúcio', 'Overwatch'], ['Blanka', 'Street Fighter'], ['Eddy Gordo', 'Tekken'], ['Raze', 'Valorant'], ['Knuckles', 'Sonic/Sonic the Hedgehog'],
  ['Charizard', 'Pokémon'], ['Diddy Kong', 'Donkey Kong'], ['Joel Miller', 'The Last of Us/Last of Us'], ['Trevor Philips', 'GTA/Grand Theft Auto/GTA V/GTA 5'],
  ['Ada Wong', 'Resident Evil'], ['Liu Kang', 'Mortal Kombat'], ['Ken Masters', 'Street Fighter'], ['Teemo', 'League of Legends/LoL'],
  ['Atreus', 'God of War'], ['Cortana', 'Halo'], ['Big Boss', 'Metal Gear/Metal Gear Solid'], ['Ciri', 'The Witcher/Witcher'],
  ['Mewtwo', 'Pokémon'], ['Princesa Peach', 'Mario/Super Mario/Super Mario Bros'], ['Tifa Lockhart', 'Final Fantasy/Final Fantasy VII/Final Fantasy 7'],
  ['Vault Boy', 'Fallout'], ['Ori', 'Ori and the Blind Forest/Ori/Ori and the Will of the Wisps'], ['Madeline', 'Celeste'],
];
for (const [personagem, franquia] of CHARACTERS) {
  add([`No mundo dos games, ${personagem} é personagem de qual franquia de jogos?`, `Em qual franquia de jogos eletrônicos o jogador encontra ${personagem}?`, `${personagem} ficou famoso como personagem de qual série de jogos eletrônicos?`], franquia);
}

// ---------- Jogos eletrônicos: Jogo do Ano no The Game Awards ----------
const GOTY = [
  [2014, 'Dragon Age Inquisition/Dragon Age: Inquisition/Dragon Age'], [2015, 'The Witcher 3/The Witcher 3: Wild Hunt/Witcher 3'], [2016, 'Overwatch'],
  [2017, 'The Legend of Zelda: Breath of the Wild/Zelda Breath of the Wild/Breath of the Wild/Zelda'], [2018, 'God of War'],
  [2019, 'Sekiro/Sekiro: Shadows Die Twice/Sekiro Shadows Die Twice'], [2020, 'The Last of Us Part II/The Last of Us 2/The Last of Us Parte 2/The Last of Us Parte II/Last of Us 2'],
  [2021, 'It Takes Two'], [2022, 'Elden Ring'], [2023, "Baldur's Gate 3/Baldurs Gate 3/Baldur's Gate III"], [2024, 'Astro Bot'],
  [2025, 'Clair Obscur: Expedition 33/Clair Obscur Expedition 33/Expedition 33/Clair Obscur'],
];
for (const [ano, jogo] of GOTY) {
  add([`Qual jogo venceu o prêmio de Jogo do Ano no The Game Awards de ${ano}?`, `Qual foi o Jogo do Ano do The Game Awards em ${ano}?`, `No The Game Awards de ${ano}, qual jogo levou o prêmio principal?`], jogo);
}

// ---------- Livros e autores ----------
const BOOKS = [
  ['Dom Quixote', 'Miguel de Cervantes/Cervantes'], ['Os Lusíadas', 'Luís de Camões/Camões'], ['O Pequeno Príncipe', 'Antoine de Saint-Exupéry/Saint-Exupéry/Exupéry'],
  ['Cem Anos de Solidão', 'Gabriel García Márquez/García Márquez/Gabo'], ['1984', 'George Orwell/Orwell'], ['A Revolução dos Bichos', 'George Orwell/Orwell'],
  ['O Senhor dos Anéis', 'J. R. R. Tolkien/Tolkien/JRR Tolkien'], ['Grande Sertão: Veredas', 'Guimarães Rosa/João Guimarães Rosa'], ['Vidas Secas', 'Graciliano Ramos'],
  ['Capitães da Areia', 'Jorge Amado'], ['O Cortiço', 'Aluísio Azevedo'], ['Iracema', 'José de Alencar'], ['O Guarani', 'José de Alencar'],
  ['Memórias Póstumas de Brás Cubas', 'Machado de Assis/Machado'], ['A Hora da Estrela', 'Clarice Lispector/Clarice'], ['Macunaíma', 'Mário de Andrade'],
  ['O Alquimista', 'Paulo Coelho'], ['Auto da Compadecida', 'Ariano Suassuna/Suassuna'], ['Morte e Vida Severina', 'João Cabral de Melo Neto/João Cabral'],
  ['Crime e Castigo', 'Dostoiévski/Fiódor Dostoiévski/Dostoievski'], ['Guerra e Paz', 'Tolstói/Liev Tolstói/Leon Tolstói/Tolstoi'],
  ['A Divina Comédia', 'Dante Alighieri/Dante'], ['Odisseia', 'Homero'], ['A Metamorfose', 'Franz Kafka/Kafka'], ['Orgulho e Preconceito', 'Jane Austen/Austen'],
  ['Frankenstein', 'Mary Shelley/Shelley'], ['Drácula', 'Bram Stoker/Stoker'], ['O Código Da Vinci', 'Dan Brown'], ['As Crônicas de Nárnia', 'C. S. Lewis/Lewis/CS Lewis'],
  ['Ensaio sobre a Cegueira', 'José Saramago/Saramago'], ['O Nome da Rosa', 'Umberto Eco'], ['O Velho e o Mar', 'Ernest Hemingway/Hemingway'],
  ['Moby Dick', 'Herman Melville/Melville'], ['Os Miseráveis', 'Victor Hugo'], ['O Conde de Monte Cristo', 'Alexandre Dumas/Dumas'],
  ['Vinte Mil Léguas Submarinas', 'Júlio Verne/Jules Verne/Verne'], ['O Menino Maluquinho', 'Ziraldo'], ['As Crônicas de Gelo e Fogo', 'George R. R. Martin/George Martin/Martin/George RR Martin'],
  ['O Iluminado', 'Stephen King'], ['O Hobbit', 'J. R. R. Tolkien/Tolkien/JRR Tolkien'], ['Quincas Borba', 'Machado de Assis/Machado'], ['Gabriela, Cravo e Canela', 'Jorge Amado'],
];
for (const [obra, autor] of BOOKS) {
  add([`Quem é o autor ou a autora da famosa obra ${obra}?`, `O livro ${obra}, conhecido por leitores do mundo todo, foi escrito por quem?`, `Nas bibliotecas, o nome de quem aparece como autor de ${obra}?`], autor);
}

// ---------- Países e continentes ----------
const CONTINENTS = [
  ['do Japão', 'Ásia'], ['da Nigéria', 'África'], ['do Egito', 'África'], ['da Austrália', 'Oceania'], ['da Alemanha', 'Europa'],
  ['do Canadá', 'América do Norte/América'], ['do Peru', 'América do Sul/América'], ['da Índia', 'Ásia'], ['da Tailândia', 'Ásia'], ['do Quênia', 'África'],
  ['do Marrocos', 'África'], ['da Nova Zelândia', 'Oceania'], ['da Grécia', 'Europa'], ['do México', 'América do Norte/América'],
  ['da Argentina', 'América do Sul/América'], ['da China', 'Ásia'], ['de Angola', 'África'], ['da Suécia', 'Europa'], ['do Vietnã', 'Ásia'],
  ['de Portugal', 'Europa'], ['da Colômbia', 'América do Sul/América'], ['da Arábia Saudita', 'Ásia'], ['do Senegal', 'África'], ['da Polônia', 'Europa'],
  ['da Coreia do Sul', 'Ásia'], ['da Etiópia', 'África'], ['da Mongólia', 'Ásia'], ['da Noruega', 'Europa'], ['do Chile', 'América do Sul/América'],
  ['de Moçambique', 'África'], ['das Filipinas', 'Ásia'], ['da Hungria', 'Europa'], ['de Gana', 'África'], ['do Nepal', 'Ásia'], ['da Islândia', 'Europa'],
  ['do Paquistão', 'Ásia'], ['da Tanzânia', 'África'], ['de Madagascar', 'África'], ['da Indonésia', 'Ásia'], ['do Uruguai', 'América do Sul/América'],
  ['da Suíça', 'Europa'], ['do Irã', 'Ásia'], ['da Argélia', 'África'], ['de Fiji', 'Oceania'],
];
for (const [de, continente] of CONTINENTS) {
  add([`Em qual continente do planeta fica o território ${de}?`, `No mapa-múndi, o território ${de} aparece em qual continente?`, `Quem viaja para conhecer as paisagens ${de} desembarca em qual continente?`], continente);
}

// ---------- Idiomas ----------
const LANGUAGES = [
  ['do Brasil', 'Português'], ['da Argentina', 'Espanhol/Castelhano'], ['da França', 'Francês'], ['da Alemanha', 'Alemão'], ['da Itália', 'Italiano'],
  ['do Japão', 'Japonês'], ['da China', 'Mandarim/Chinês'], ['da Rússia', 'Russo'], ['do Egito', 'Árabe'], ['da Áustria', 'Alemão'],
  ['do México', 'Espanhol/Castelhano'], ['de Angola', 'Português'], ['dos Estados Unidos', 'Inglês'], ['da Austrália', 'Inglês'], ['da Grécia', 'Grego'],
  ['da Turquia', 'Turco'], ['da Holanda', 'Holandês/Neerlandês'], ['da Polônia', 'Polonês/Polaco'], ['da Coreia do Sul', 'Coreano'], ['do Irã', 'Persa/Farsi'],
  ['de Israel', 'Hebraico'], ['da Suécia', 'Sueco'], ['de Portugal', 'Português'], ['da Tailândia', 'Tailandês'], ['do Vietnã', 'Vietnamita'],
  ['da Arábia Saudita', 'Árabe'], ['de Moçambique', 'Português'], ['do Chile', 'Espanhol/Castelhano'], ['da Colômbia', 'Espanhol/Castelhano'],
  ['da Hungria', 'Húngaro'], ['da Finlândia', 'Finlandês'], ['da Noruega', 'Norueguês'], ['da Dinamarca', 'Dinamarquês'], ['da Ucrânia', 'Ucraniano'], ['da Romênia', 'Romeno'],
];
for (const [de, idioma] of LANGUAGES) {
  const no = de.startsWith('de ') ? de.replace(/^de /, 'em ') : de.replace(/^d/, 'n');
  add([`Qual é o idioma oficial mais falado pela população ${de}?`, `Qual língua as crianças aprendem primeiro nas escolas ${de}?`, `Quem pretende morar ${no} precisa aprender a falar qual idioma?`], idioma);
}

// ---------- Estados e regiões do Brasil ----------
const REGIONS = [
  ['do Acre', 'Norte'], ['do Amapá', 'Norte'], ['do Amazonas', 'Norte'], ['do Pará', 'Norte'], ['de Rondônia', 'Norte'], ['de Roraima', 'Norte'], ['do Tocantins', 'Norte'],
  ['de Alagoas', 'Nordeste'], ['da Bahia', 'Nordeste'], ['do Ceará', 'Nordeste'], ['do Maranhão', 'Nordeste'], ['da Paraíba', 'Nordeste'], ['de Pernambuco', 'Nordeste'],
  ['do Piauí', 'Nordeste'], ['de Sergipe', 'Nordeste'], ['de Goiás', 'Centro-Oeste'], ['de Mato Grosso', 'Centro-Oeste'], ['de Mato Grosso do Sul', 'Centro-Oeste'],
  ['do Espírito Santo', 'Sudeste'], ['de Minas Gerais', 'Sudeste'], ['do Rio de Janeiro', 'Sudeste'], ['de São Paulo', 'Sudeste'], ['do Paraná', 'Sul'], ['de Santa Catarina', 'Sul'],
];
for (const [de, regiao] of REGIONS) {
  add([`O estado ${de} fica em qual das cinco regiões do Brasil?`, `Em qual das cinco regiões brasileiras está localizado o estado ${de}?`, `No mapa do Brasil, o estado ${de} pertence a qual região?`], `${regiao}/Região ${regiao}`);
}

// Só entram redações com pelo menos MIN_WORDS palavras, para a pergunta ter o que revelar.
const MIN_WORDS = 8;
const countWords = (t) => t.trim().replace(/\s*\?+\s*$/, '').split(/\s+/).length;

function finish(list, minWords) {
  const seen = new Set();
  return list
    .map((it) => ({ texts: it.texts.filter((t) => countWords(t) >= minWords), answer: it.answer }))
    .filter((it) => {
      if (!it.texts.length || seen.has(it.texts[0])) return false;
      seen.add(it.texts[0]);
      it.key = it.texts[0];
      return true;
    });
}

// Perguntas finais: as mais longas, usadas para fechar a partida.
const FINALS = finish(require('./finals.js').map(([text, answer]) => ({ texts: [text], answer })), MIN_WORDS);

module.exports = { BANK: finish(items, MIN_WORDS), FINALS };

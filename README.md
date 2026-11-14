# Respostas sem Perguntas

Jogo de adivinhar a resposta de uma pergunta escondida, para jogar com os amigos no navegador.

## Rodar

Precisa do [Node.js](https://nodejs.org) 18 ou mais novo.

```
npm install
npm start
```

Abra http://localhost:3000, digite seu nome e um código de sala (qualquer palavra). Quem digitar o mesmo código entra na mesma sala.

Para testar sozinho, abra duas ou três abas anônimas, cada uma com um nome.

## Jogar com amigos

- **Mesma rede Wi-Fi:** use o endereço "Na mesma rede" que aparece no terminal.
- **Pela internet:** deixe o jogo rodando e, em outro terminal, rode `npx localtunnel --port 3000` (ou ngrok / Cloudflare Tunnel) e mande o link gerado.

## Regras

1. No lobby, cada jogador cadastra perguntas com a resposta. Use "/" para aceitar mais de uma resposta (ex.: `Garrincha/Mané Garrincha`).
2. Na partida só aparece quantas palavras a pergunta tem.
3. Na sua vez, clique numa palavra para revelar e dê um chute.
4. Acertou: leva os pontos e a pergunta acaba. Errou: passa a vez.
5. A pergunta vale o número de palavras e perde 1 ponto a cada nova palavra revelada.
6. Quem escreveu a pergunta não joga nela e julga os chutes que não batem exatamente com a resposta.

## Arquivos

- `server.js`: servidor e regras do jogo (Express + Socket.IO)
- `public/index.html`: a tela do jogo
- `test.js`: teste automático de uma partida (`npm install socket.io-client` e `node test.js` com o servidor rodando)

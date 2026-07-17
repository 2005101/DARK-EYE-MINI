export default { name: 'quote', desc: 'Random quote', execute: async(sock,m)=>{
  const quotes = ["Work hard in silence","Be the best version of you"]
  await sock.sendMessage(m.key.remoteJid,{text: quotes[Math.floor(Math.random()*quotes.length)]},{quoted:m})
}}

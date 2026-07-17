export default { name: 'ping', desc: 'Check bot speed', execute: async(sock,m)=>{
  const start = Date.now()
  const msg = await sock.sendMessage(m.key.remoteJid,{text:'Pong...'}, {quoted:m})
  await sock.sendMessage(m.key.remoteJid,{text:`Pong! ${Date.now()-start}ms 🏓`},{quoted:m})
}}

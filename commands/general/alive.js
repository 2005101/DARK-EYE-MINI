export default { name: 'alive', desc: 'Bot status', execute: async(sock,m)=>{
  await sock.sendMessage(m.key.remoteJid,{text:'DARK-EYE-MINI is Online ✅\nVersion: 1.0.0'}, {quoted:m})
}}

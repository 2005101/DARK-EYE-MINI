export default { name: 'info', desc: 'Bot info', execute: async(sock,m)=>{
  await sock.sendMessage(m.key.remoteJid,{text:'*DARK-EYE-MINI*\nBaileys WhatsApp Bot\nCreator: You'},{quoted:m})
}}

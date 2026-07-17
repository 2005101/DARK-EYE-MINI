export default { name: 'runtime', desc: 'Uptime', execute: async(sock,m)=>{
  let sec = process.uptime()
  let h = Math.floor(sec/3600)
  let m = Math.floor(sec%3600/60)
  await sock.sendMessage(m.key.remoteJid,{text:`Uptime: ${h}h ${m}m`},{quoted:m})
}}

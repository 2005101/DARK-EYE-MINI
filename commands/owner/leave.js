export default { 
  name: 'leave', 
  desc: 'Leave current group', 
  execute: async(sock, m) => {
    if(!m.key.remoteJid.endsWith('@g.us')) return sock.sendMessage(m.key.remoteJid, { text: 'This is not a group' }, { quoted: m })
    await sock.sendMessage(m.key.remoteJid, { text: 'Leaving group... Bye 👋' }, { quoted: m })
    await sock.groupLeave(m.key.remoteJid)
  }
}

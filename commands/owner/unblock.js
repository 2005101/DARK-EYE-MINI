export default { 
  name: 'block', 
  desc: 'Block a user', 
  execute: async(sock, m) => {
    const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    if(!user) return sock.sendMessage(m.key.remoteJid, { text: 'Tag someone to block' }, { quoted: m })
    await sock.updateBlockStatus(user, "block")
    await sock.sendMessage(m.key.remoteJid, { text: '✅ User blocked' }, { quoted: m })
  }
}

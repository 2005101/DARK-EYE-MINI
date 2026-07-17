export default { 
  name: 'ban', 
  desc: 'Ban a user in group', 
  execute: async(sock, m) => {
    const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.key.participant
    await sock.groupParticipantsUpdate(m.key.remoteJid, [user], "remove")
    await sock.sendMessage(m.key.remoteJid, { text: '✅ User banned' }, { quoted: m })
  }
}

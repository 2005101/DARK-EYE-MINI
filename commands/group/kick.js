export default {
  name: 'kick',
  desc: 'Kick tagged member',
  execute: async(sock, m) => {
    const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    if(!user) return sock.sendMessage(m.key.remoteJid, { text: 'Tag someone to kick' }, { quoted: m })
    await sock.groupParticipantsUpdate(m.key.remoteJid,, "remove")
    await sock.sendMessage(m.key.remoteJid, { text: '✅ Kicked' }, { quoted: m })
  }
}

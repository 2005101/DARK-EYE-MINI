export default {
  name: 'promote',
  desc: 'Promote to admin',
  execute: async(sock, m) => {
    const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    if(!user) return sock.sendMessage(m.key.remoteJid, { text: 'Tag someone to promote' }, { quoted: m })
    await sock.groupParticipantsUpdate(m.key.remoteJid,, "promote")
    await sock.sendMessage(m.key.remoteJid, { text: '✅ Promoted to Admin' }, { quoted: m })
  }
}

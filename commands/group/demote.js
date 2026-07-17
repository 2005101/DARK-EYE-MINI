export default {
  name: 'demote',
  desc: 'Demote admin',
  execute: async(sock, m) => {
    const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    if(!user) return sock.sendMessage(m.key.remoteJid, { text: 'Tag admin to demote' }, { quoted: m })
    await sock.groupParticipantsUpdate(m.key.remoteJid,, "demote")
    await sock.sendMessage(m.key.remoteJid, { text: '✅ Demoted' }, { quoted: m })
  }
}

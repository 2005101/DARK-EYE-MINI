export default {
  name: 'add',
  desc: 'Add member to group',
  execute: async(sock, m, args) => {
    const num = args[0] + '@s.whatsapp.net'
    if(!args[0]) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!add 26377xxxxxxx' }, { quoted: m })
    await sock.groupParticipantsUpdate(m.key.remoteJid,, "add")
    await sock.sendMessage(m.key.remoteJid, { text: '✅ Added' }, { quoted: m })
  }
}

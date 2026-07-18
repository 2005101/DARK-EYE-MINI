export default {
  name: 'setbotname',
  desc: 'Change bot name',
  execute: async(sock, m, args) => {
    const name = args.join(' ')
    if(!name) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!setbotname DARK-EYE-MINI' }, { quoted: m })
    await sock.updateProfileName(name)
    await sock.sendMessage(m.key.remoteJid, { text: `✅ Bot name changed to: ${name}` }, { quoted: m })
  }
}

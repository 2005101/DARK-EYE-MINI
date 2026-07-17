export default {
  name: 'setdesc',
  desc: 'Change group description',
  execute: async(sock, m, args) => {
    const desc = args.join(' ')
    if(!desc) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!setdesc New Description' }, { quoted: m })
    await sock.groupUpdateDescription(m.key.remoteJid, desc)
    await sock.sendMessage(m.key.remoteJid, { text: '✅ Group description updated' }, { quoted: m })
  }
}

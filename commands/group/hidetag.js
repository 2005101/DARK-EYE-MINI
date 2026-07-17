export default {
  name: 'hidetag',
  desc: 'Tag all without showing',
  execute: async(sock, m, args) => {
    const group = await sock.groupMetadata(m.key.remoteJid)
    let mentions = group.participants.map(p => p.id)
    await sock.sendMessage(m.key.remoteJid, { text: args.join(' '), mentions }, { quoted: m })
  }
}

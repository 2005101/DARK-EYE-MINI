export default {
  name: 'setname',
  desc: 'Change group name',
  execute: async(sock, m, args) => {
    const name = args.join(' ')
    if(!name) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!setname New Group Name' }, { quoted: m })
    await sock.groupUpdateSubject(m.key.remoteJid, name)
    await sock.sendMessage(m.key.remoteJid, { text: `✅ Group name changed to: ${name}` }, { quoted: m })
  }
}

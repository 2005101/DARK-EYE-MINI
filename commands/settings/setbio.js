export default {
  name: 'setbio',
  desc: 'Change bot bio',
  execute: async(sock, m, args) => {
    const bio = args.join(' ')
    if(!bio) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!setbio Owner: DARK-EYE OFC DEV' }, { quoted: m })
    await sock.updateProfileStatus(bio)
    await sock.sendMessage(m.key.remoteJid, { text: `✅ Bot bio updated` }, { quoted: m })
  }
}

export default {
  name: 'link',
  desc: 'Get group invite link',
  execute: async(sock, m) => {
    const code = await sock.groupInviteCode(m.key.remoteJid)
    await sock.sendMessage(m.key.remoteJid, { text: `*Group Link:*\nhttps://chat.whatsapp.com/${code}` }, { quoted: m })
  }
}

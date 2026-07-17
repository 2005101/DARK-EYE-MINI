export default {
  name: 'jid',
  desc: 'Get chat or user JID',
  execute: async(sock, m) => {
    await sock.sendMessage(m.key.remoteJid, { text: `*JID:* ${m.key.remoteJid}` }, { quoted: m })
  }
}

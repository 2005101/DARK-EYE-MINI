let SELF = false
export default { 
  name: 'self', 
  desc: 'Toggle self/public mode', 
  execute: async(sock, m) => {
    SELF = !SELF
    await sock.sendMessage(m.key.remoteJid, { text: `Mode: ${SELF ? 'SELF' : 'PUBLIC'}` }, { quoted: m })
  }
}

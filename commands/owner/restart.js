export default { 
  name: 'restart', 
  desc: 'Restart the bot', 
  execute: async(sock, m) => {
    await sock.sendMessage(m.key.remoteJid, { text: '♻️ Restarting DARK-EYE-MINI...' }, { quoted: m })
    process.exit(1)
  }
}

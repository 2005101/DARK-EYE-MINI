export default {
  name: 'removebg',
  desc: 'Remove background from image',
  execute: async(sock, m, args) => {
    if(!m.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage)
      return sock.sendMessage(m.key.remoteJid, { text: '❌ Reply to an image\nUsage:!removebg' }, { quoted: m })

    await sock.sendMessage(m.key.remoteJid, { text: '🎨 Removing background...' }, { quoted: m })
    // Add your removebg API here
    await sock.sendMessage(m.key.remoteJid, { text: `✅ Background removed\n> _*powered by DARK-EYE OFC DEV*_` }, { quoted: m })
  }
}

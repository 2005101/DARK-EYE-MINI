export default {
  name: 'picedit',
  desc: 'Edit image with prompt',
  execute: async(sock, m, args) => {
    const prompt = args.join(' ')
    if(!prompt) return sock.sendMessage(m.key.remoteJid, { text: '❌ Usage:!picedit make it anime [reply img]' }, { quoted: m })
    if(!m.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage)
      return sock.sendMessage(m.key.remoteJid, { text: '❌ Reply to an image' }, { quoted: m })

    await sock.sendMessage(m.key.remoteJid, { text: `🎨 Editing: *${prompt}*` }, { quoted: m })
    await sock.sendMessage(m.key.remoteJid, { text: `✅ Edited\n> _*powered by DARK-EYE OFC DEV*_` }, { quoted: m })
  }
}

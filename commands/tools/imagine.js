export default {
  name: 'imagine',
  desc: 'Generate image from prompt',
  execute: async(sock, m, args) => {
    const prompt = args.join(' ')
    if(!prompt) return sock.sendMessage(m.key.remoteJid, { text: '❌ Usage:!imagine a dragon in space' }, { quoted: m })

    await sock.sendMessage(m.key.remoteJid, { text: `🎨 Generating: *${prompt}*` }, { quoted: m })
    // Add your image gen API here
    await sock.sendMessage(m.key.remoteJid, { text: `✅ Done\n> _*powered by DARK-EYE OFC DEV*_` }, { quoted: m })
  }
}

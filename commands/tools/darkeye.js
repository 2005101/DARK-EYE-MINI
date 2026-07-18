export default {
  name: 'darkeye',
  desc: 'Voice access with Bixby/Siri/Gemini',
  execute: async(sock, m, args) => {
    const mode = args[0]?.toLowerCase()
    if(!['on','off','bixby','siri','gemini'].includes(mode))
      return sock.sendMessage(m.key.remoteJid, {
        text: `*DARK-EYE VOICE*\n!darkeye on - Turn on\n!darkeye off - Turn off\n!darkeye bixby - Use Bixby\n!darkeye siri - Use Siri\n!darkeye gemini - Use Gemini\nAfter ON: Say "darkeye play music"\n\n> _*powered by DARK-EYE OFC DEV*_`
      }, { quoted: m })

    if(mode === 'on') global.voiceMode = true
    if(mode === 'off') global.voiceMode = false

    await sock.sendMessage(m.key.remoteJid, { text: `🎙️ Voice Mode: *${mode.toUpperCase()}*\nNow say: darkeye + your command\n\n> _*powered by DARK-EYE OFC DEV*_` }, { quoted: m })
  }
}

export default {
  name: 'convert',
  desc: 'Convert media',
  execute: async(sock, m, args) => {
    const type = args[0]?.toLowerCase()
    const text = args.slice(1).join(' ')
    if(!type) return sock.sendMessage(m.key.remoteJid, {
      text: `*CONVERT*\n!convert tts hello\n!convert stt [reply audio]\n!convert songtovid [reply audio]\n!convert vidtoaudio [reply video]\n\n> _*powered by DARK-EYE OFC DEV*_`
    }, { quoted: m })

    if(type === 'tts'){
      if(!text) return sock.sendMessage(m.key.remoteJid, { text: '❌ Usage:!convert tts hello' }, { quoted: m })
      // generate TTS audio
      await sock.sendMessage(m.key.remoteJid, { audio: Buffer.from(''), mimetype: 'audio/mp4' })
    }
    if(type === 'stt') await sock.sendMessage(m.key.remoteJid, { text: '🎙️ Converting audio to text...' })
    if(type === 'songtovid') await sock.sendMessage(m.key.remoteJid, { text: '🎵 Converting song to video...' })
    if(type === 'vidtoaudio') await sock.sendMessage(m.key.remoteJid, { text: '🎬 Converting video to audio...' })
  }
}

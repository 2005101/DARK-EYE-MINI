import fetch from 'node-fetch'
export default {
  name: 'ytmp3',
  desc: 'Download YT audio',
  execute: async(sock, m, args) => {
    const url = args[0]
    if(!url) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!ytmp3 https://youtube.com/...' }, { quoted: m })
    await sock.sendMessage(m.key.remoteJid, { text: '⏳ Converting to MP3...' }, { quoted: m })
    const api = `https://api.dreaded.in/api/ytdl/audio?url=${url}`
    const res = await fetch(api)
    const data = await res.json()
    await sock.sendMessage(m.key.remoteJid, { audio: { url: data.result.download }, mimetype: 'audio/mpeg' }, { quoted: m })
  }
}

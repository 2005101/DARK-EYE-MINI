import fetch from 'node-fetch'
export default {
  name: 'yt',
  desc: 'Download YT video',
  execute: async(sock, m, args) => {
    const url = args[0]
    if(!url) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!yt https://youtube.com/...' }, { quoted: m })
    await sock.sendMessage(m.key.remoteJid, { text: '⏳ Downloading video...' }, { quoted: m })
    const api = `https://api.dreaded.in/api/ytdl/video?url=${url}`
    const res = await fetch(api)
    const data = await res.json()
    await sock.sendMessage(m.key.remoteJid, { video: { url: data.result.download }, caption: data.result.title }, { quoted: m })
  }
}

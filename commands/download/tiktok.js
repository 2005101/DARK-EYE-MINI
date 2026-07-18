import fetch from 'node-fetch'
export default {
  name: 'tiktok',
  desc: 'Download TikTok',
  execute: async(sock, m, args) => {
    const url = args[0]
    if(!url) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!tiktok https://tiktok.com/...' }, { quoted: m })
    const api = `https://api.dreaded.in/api/tiktok?url=${url}`
    const res = await fetch(api)
    const data = await res.json()
    await sock.sendMessage(m.key.remoteJid, { video: { url: data.result.video }, caption: data.result.title }, { quoted: m })
  }
}

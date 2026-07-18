import fetch from 'node-fetch'
export default {
  name: 'pinterest',
  desc: 'Search pinterest',
  execute: async(sock, m, args) => {
    const q = args.join(' ')
    if(!q) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!pinterest aesthetic wallpaper' }, { quoted: m })
    const api = `https://api.dreaded.in/api/pinterest?search=${q}`
    const res = await fetch(api)
    const data = await res.json()
    await sock.sendMessage(m.key.remoteJid, { image: { url: data.result[0] }, caption: `Pinterest: ${q}` }, { quoted: m })
  }
}

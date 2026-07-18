import fetch from 'node-fetch'
export default {
  name: 'song',
  desc: 'Search song info',
  execute: async(sock, m, args) => {
    const q = args.join(' ')
    if(!q) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!song rihanna diamonds' }, { quoted: m })
    const api = `https://api.dreaded.in/api/spotify?search=${q}`
    const res = await fetch(api)
    const data = await res.json()
    const s = data.result[0]
    await sock.sendMessage(m.key.remoteJid, {
      image: { url: s.image },
      caption: `*${s.title}*\nArtist: ${s.artist}\nAlbum: ${s.album}\nDuration: ${s.duration}`
    }, { quoted: m })
  }
}

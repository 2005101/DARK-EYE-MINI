import fetch from 'node-fetch'
export default {
  name: 'playstore',
  desc: 'Search playstore app',
  execute: async(sock, m, args) => {
    const q = args.join(' ')
    if(!q) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!playstore whatsapp' }, { quoted: m })
    const api = `https://api.dreaded.in/api/playstore?search=${q}`
    const res = await fetch(api)
    const data = await res.json()
    const a = data.result[0]
    await sock.sendMessage(m.key.remoteJid, {
      image: { url: a.icon },
      caption: `*${a.name}*\nDeveloper: ${a.developer}\nRating: ${a.rating}\nLink: ${a.link}`
    }, { quoted: m })
  }
}

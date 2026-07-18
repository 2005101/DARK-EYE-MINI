import fetch from 'node-fetch'
export default {
  name: 'youtube',
  desc: 'Search YouTube',
  execute: async(sock, m, args) => {
    const q = args.join(' ')
    if(!q) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!youtube lofi music' }, { quoted: m })
    const api = `https://api.dreaded.in/api/ytsearch?text=${q}`
    const res = await fetch(api)
    const data = await res.json()
    let text = `*YT Search: ${q}*\n\n`
    data.result.slice(0,5).forEach((v,i) => text += `${i+1}. *${v.title}*\nDuration: ${v.duration}\nLink: ${v.url}\n\n`)
    await sock.sendMessage(m.key.remoteJid, { text }, { quoted: m })
  }
}

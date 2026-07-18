import fetch from 'node-fetch'
export default {
  name: 'news',
  desc: 'Latest news',
  execute: async(sock, m, args) => {
    const api = `https://api.dreaded.in/api/news`
    const res = await fetch(api)
    const data = await res.json()
    let text = `*📰 LATEST NEWS*\n\n`
    data.result.slice(0,5).forEach((v,i) => text += `${i+1}. *${v.title}*\n${v.url}\n\n`)
    await sock.sendMessage(m.key.remoteJid, { text }, { quoted: m })
  }
}

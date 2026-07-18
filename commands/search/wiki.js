import fetch from 'node-fetch'
export default {
  name: 'wiki',
  desc: 'Wikipedia search',
  execute: async(sock, m, args) => {
    const q = args.join(' ')
    if(!q) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!wiki Zimbabwe' }, { quoted: m })
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${q}`)
    const data = await res.json()
    await sock.sendMessage(m.key.remoteJid, {
      text: `*${data.title}*\n\n${data.extract}\n\nRead more: ${data.content_urls.desktop.page}`
    }, { quoted: m })
  }
}

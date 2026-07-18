import fetch from 'node-fetch'
export default {
  name: 'ig',
  desc: 'Download Instagram',
  execute: async(sock, m, args) => {
    const url = args[0]
    if(!url) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!ig https://instagram.com/...' }, { quoted: m })
    const api = `https://api.dreaded.in/api/instagram?url=${url}`
    const res = await fetch(api)
    const data = await res.json()
    await sock.sendMessage(m.key.remoteJid, { video: { url: data.result.url }, caption: 'Instagram Download' }, { quoted: m })
  }
}

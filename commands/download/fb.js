import fetch from 'node-fetch'
export default {
  name: 'fb',
  desc: 'Download Facebook video',
  execute: async(sock, m, args) => {
    const url = args[0]
    if(!url) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!fb https://facebook.com/...' }, { quoted: m })
    const api = `https://api.dreaded.in/api/facebook?url=${url}`
    const res = await fetch(api)
    const data = await res.json()
    await sock.sendMessage(m.key.remoteJid, { video: { url: data.result.hd }, caption: 'Facebook Download' }, { quoted: m })
  }
}

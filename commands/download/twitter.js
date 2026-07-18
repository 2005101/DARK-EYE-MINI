import fetch from 'node-fetch'
export default {
  name: 'twitter',
  desc: 'Download Twitter video',
  execute: async(sock, m, args) => {
    const url = args[0]
    if(!url) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!twitter https://x.com/...' }, { quoted: m })
    const api = `https://api.dreaded.in/api/twitter?url=${url}`
    const res = await fetch(api)
    const data = await res.json()
    await sock.sendMessage(m.key.remoteJid, { video: { url: data.result.hd }, caption: 'Twitter Download' }, { quoted: m })
  }
}

import fetch from 'node-fetch'
export default {
  name: 'lyrics',
  desc: 'Get song lyrics',
  execute: async(sock, m, args) => {
    const q = args.join(' ')
    if(!q) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!lyrics die with a smile' }, { quoted: m })
    const api = `https://api.dreaded.in/api/lyrics?search=${q}`
    const res = await fetch(api)
    const data = await res.json()
    await sock.sendMessage(m.key.remoteJid, {
      text: `*${data.result.title} - ${data.result.artist}*\n\n${data.result.lyrics}`
    }, { quoted: m })
  }
}

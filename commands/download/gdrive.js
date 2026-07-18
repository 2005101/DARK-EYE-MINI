import fetch from 'node-fetch'
export default {
  name: 'gdrive',
  desc: 'Download Google Drive',
  execute: async(sock, m, args) => {
    const url = args[0]
    if(!url) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!gdrive https://drive.google.com/...' }, { quoted: m })
    const api = `https://api.dreaded.in/api/gdrive?url=${url}`
    const res = await fetch(api)
    const data = await res.json()
    await sock.sendMessage(m.key.remoteJid, { document: { url: data.result.download }, fileName: data.result.name }, { quoted: m })
  }
}

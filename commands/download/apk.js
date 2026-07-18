import fetch from 'node-fetch'
export default {
  name: 'apk',
  desc: 'Download APK',
  execute: async(sock, m, args) => {
    const app = args.join(' ')
    if(!app) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!apk whatsapp' }, { quoted: m })
    const api = `https://api.dreaded.in/api/apk?search=${app}`
    const res = await fetch(api)
    const data = await res.json()
    await sock.sendMessage(m.key.remoteJid, { document: { url: data.result.link }, fileName: `${data.result.name}.apk` }, { quoted: m })
  }
}

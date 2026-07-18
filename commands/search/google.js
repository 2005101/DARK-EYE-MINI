import fetch from 'node-fetch'
export default {
  name: 'google',
  desc: 'Google search',
  execute: async(sock, m, args) => {
    const q = args.join(' ')
    if(!q) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!google who is elon musk' }, { quoted: m })
    const api = `https://api.dreaded.in/api/google?text=${q}`
    const res = await fetch(api)
    const data = await res.json()
    let text = `*Google Result: ${q}*\n\n`
    data.result.slice(0,3).forEach(v => text += `*${v.title}*\n${v.desc}\n${v.link}\n\n`)
    await sock.sendMessage(m.key.remoteJid, { text }, { quoted: m })
  }
}

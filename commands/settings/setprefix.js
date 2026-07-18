import fs from 'fs'
export default {
  name: 'setprefix',
  desc: 'Change bot prefix',
  execute: async(sock, m, args) => {
    const prefix = args[0]
    if(!prefix) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!setprefix.' }, { quoted: m })
    let config = JSON.parse(fs.readFileSync('./config.json'))
    config.prefix = prefix
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
    await sock.sendMessage(m.key.remoteJid, { text: `✅ Prefix changed to: ${prefix}` }, { quoted: m })
  }
}

import fs from 'fs'
export default {
  name: 'autotype',
  desc: 'Toggle auto typing',
  execute: async(sock, m) => {
    let config = JSON.parse(fs.readFileSync('./config.json'))
    config.autoTyping =!config.autoTyping
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
    await sock.sendMessage(m.key.remoteJid, { text: `Auto Typing: ${config.autoTyping? 'ON' : 'OFF'}` }, { quoted: m })
  }
}

import fs from 'fs'
export default {
  name: 'welcome',
  desc: 'Toggle welcome message',
  execute: async(sock, m) => {
    let config = JSON.parse(fs.readFileSync('./config.json'))
    config.welcome =!config.welcome
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
    await sock.sendMessage(m.key.remoteJid, { text: `Welcome Message: ${config.welcome? 'ON' : 'OFF'}` }, { quoted: m })
  }
}

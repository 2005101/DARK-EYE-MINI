import fs from 'fs'
export default {
  name: 'autoread',
  desc: 'Toggle auto read',
  execute: async(sock, m) => {
    let config = JSON.parse(fs.readFileSync('./config.json'))
    config.autoRead =!config.autoRead
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
    await sock.sendMessage(m.key.remoteJid, { text: `Auto Read: ${config.autoRead? 'ON' : 'OFF'}` }, { quoted: m })
  }
}

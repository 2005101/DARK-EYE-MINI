import fs from 'fs'
import path from 'path'

const configPath = path.resolve(__dirname, '../../config.json')

export default {
  name: 'antidelete',
  desc: 'Toggle anti delete',
  execute: async(sock, m) => {
    const config = JSON.parse(fs.readFileSync(configPath))
    const sender = m.sender.split('@')[0]
    const isOwner = sender === config.owner
    const isSudo = config.sudos.includes(m.sender)

    if(!isOwner &&!isSudo) return sock.sendMessage(m.key.remoteJid, { text: '❌ Owner/Sudo only' }, { quoted: m })

    config.antiDelete =!config.antiDelete
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

    await sock.sendMessage(m.key.remoteJid, {
      text: `🛡 Anti-Delete: ${config.antiDelete? 'ON ✅' : 'OFF ❌'}\n\nDeleted messages will be logged.\n\n> _*powered by DARK-EYE OFC DEV*_`
    }, { quoted: m })
  }
}


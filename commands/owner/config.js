import fs from 'fs'
import path from 'path'

const configPath = path.resolve('./config.json')

function saveConfig(config){
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

export default {
  name: 'config',
  desc: 'Add/Remove sudo users. Owner only',
  execute: async(sock, m, args) => {
    const config = JSON.parse(fs.readFileSync(configPath))
    const sender = m.sender.split('@')[0]

    // Owner only
    if(sender!== config.owner) return sock.sendMessage(m.key.remoteJid, { text: '❌ Owner only command' }, { quoted: m })

    const action = args[0]?.toLowerCase()
    const num = args[1]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

    if(!action ||!args[1]) return sock.sendMessage(m.key.remoteJid, {
      text: `*CONFIG MENU*\n\n!addsudo 26377xxxxxxx - Add sudo\n!delsudo 26377xxxxxxx - Remove sudo\n*Current Sudos:*\n${config.sudos.map(s => `• ${s.split('@')[0]}`).join('\n')}\n\n> _*powered by DARK-EYE OFC DEV*_`
    }, { quoted: m })

    // ADDSUDO
    if(action === 'addsudo'){
      if(config.sudos.includes(num)) return sock.sendMessage(m.key.remoteJid, { text: 'User is already a sudo' }, { quoted: m })

      config.sudos.push(num)
      saveConfig(config)

      return sock.sendMessage(m.key.remoteJid, {
        text: `✅ *SUDO ADDED SUCCESSFULLY*\n\nNumber: ${args[1]}\n\nHe can now use owner commands.\n\n> _*powered by DARK-EYE OFC DEV*_`
      }, { quoted: m, mentions: [num] })
    }

    // DELSUDO
    if(action === 'delsudo'){
      if(num.split('@')[0] === config.owner) return sock.sendMessage(m.key.remoteJid, { text: '❌ Cannot remove owner from sudo' }, { quoted: m })
      if(!config.sudos.includes(num)) return sock.sendMessage(m.key.remoteJid, { text: 'User is not a sudo' }, { quoted: m })

      config.sudos = config.sudos.filter(s => s!== num)
      saveConfig(config)

      return sock.sendMessage(m.key.remoteJid, {
        text: `🗑️ *SUDO REMOVED SUCCESSFULLY*\n\nNumber: ${args[1]}\n\nHe can no longer use owner commands.\n\n> _*powered by DARK-EYE OFC DEV*_`
      }, { quoted: m, mentions: [num] })
    }

    await sock.sendMessage(m.key.remoteJid, { text: 'Invalid action. Use: addsudo | delsudo' }, { quoted: m })
  }
}

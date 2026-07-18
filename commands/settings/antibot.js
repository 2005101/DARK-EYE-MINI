import fs from 'fs'
import path from 'path'

const configPath = path.resolve(__dirname, '../../config.json')

function saveConfig(config){
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

export default {
  name: 'antibot',
  desc: 'AntiBot system with kick, warn, on, off',
  execute: async(sock, m, args) => {
    const config = JSON.parse(fs.readFileSync(configPath))
    const sender = m.sender.split('@')[0]
    const isOwner = sender === config.owner
    const isSudo = config.sudos.includes(m.sender)

    if(!isOwner &&!isSudo) return sock.sendMessage(m.key.remoteJid, { text: '❌ Owner/Sudo only' }, { quoted: m })

    const isGroup = m.key.remoteJid.endsWith('@g.us')
    if(!isGroup) return sock.sendMessage(m.key.remoteJid, { text: '❌ This command only works in groups' }, { quoted: m })

    const metadata = await sock.groupMetadata(m.key.remoteJid)
    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const isAdmin = metadata.participants.find(p => p.id === botNumber)?.admin
    if(!isAdmin) return sock.sendMessage(m.key.remoteJid, { text: '❌ Bot must be ADMIN to use anti-bot' }, { quoted: m })

    const mode = args[0]?.toLowerCase()
    if(!mode) return sock.sendMessage(m.key.remoteJid, {
      text: `*ANTIBOT SETTINGS*\n\n!antibot kick - Auto delete + Warn + Kick\n!antibot warn - Auto delete + 3 Warns then Kick\n!antibot on - Auto delete + Warn only\n!antibot off - Turn off anti bot\n\nCurrent: *${config.antiBotMode || 'off'}*\n\n> _*powered by DARK-EYE OFC DEV*_`
    }, { quoted: m })

    if(!['kick','warn','on','off'].includes(mode)) return sock.sendMessage(m.key.remoteJid, { text: 'Invalid mode. Use: kick | warn | on | off' }, { quoted: m })

    config.antiBotMode = mode
    if(!config.antiBotWarnings) config.antiBotWarnings = {}
    saveConfig(config)

    let msg = ''
    if(mode === 'kick') msg = '✅ AntiBot: *KICK MODE*\nBot messages = Deleted + Kicked'
    if(mode === 'warn') msg = '✅ AntiBot: *WARN MODE*\n3 Warnings then Kick'
    if(mode === 'on') msg = '✅ AntiBot: *ON MODE*\nBot messages = Deleted + Warned'
    if(mode === 'off') msg = '❌ AntiBot: *OFF*\nAll anti-bot actions disabled'

    await sock.sendMessage(m.key.remoteJid, { text: msg + `\n\n> _*powered by DARK-EYE OFC DEV*_` }, { quoted: m })
  }
}

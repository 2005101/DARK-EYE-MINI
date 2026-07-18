import fs from 'fs'
import path from 'path'

const configPath = path.resolve(__dirname, '../../config.json')

function saveConfig(config){
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

export default {
  name: 'antilink',
  desc: 'AntiLink - only allows owner + group invite link',
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
    if(!isAdmin) return sock.sendMessage(m.key.remoteJid, { text: '❌ Bot must be ADMIN to use anti-link' }, { quoted: m })

    const mode = args[0]?.toLowerCase()
    if(!mode) return sock.sendMessage(m.key.remoteJid, {
      text: `*ANTILINK SETTINGS*\n\n!antilink kick - Delete + Kick\n!antilink warn - 3 Warns then Kick\n!antilink on - Delete + Warn\n!antilink off - Disable\n\nRule: Only Owner/Sudo + This Group's Invite Link Allowed\nCurrent: *${config.antiLinkMode || 'off'}*\n\n> _*powered by DARK-EYE OFC DEV*_`
    }, { quoted: m })

    if(!['kick','warn','on','off'].includes(mode)) return sock.sendMessage(m.key.remoteJid, { text: 'Invalid mode. Use: kick | warn | on | off' }, { quoted: m })

    config.antiLinkMode = mode
    if(!config.antiLinkWarnings) config.antiLinkWarnings = {}
    saveConfig(config)

    let msg = ''
    if(mode === 'kick') msg = '✅ AntiLink: *KICK MODE*\nOnly owner + this group link allowed'
    if(mode === 'warn') msg = '✅ AntiLink: *WARN MODE*\n3 Warnings then Kick'
    if(mode === 'on') msg = '✅ AntiLink: *ON MODE*\nDelete + Warn'
    if(mode === 'off') msg = '❌ AntiLink: *OFF*'

    await sock.sendMessage(m.key.remoteJid, { text: msg + `\n\n> _*powered by DARK-EYE OFC DEV*_` }, { quoted: m })
  }
}

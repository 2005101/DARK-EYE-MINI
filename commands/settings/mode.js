import fs from 'fs'
import path from 'path'

export default {
  name: 'mode',
  desc: 'Change bot mode: public, private, group, inbox',
  execute: async(sock, m, args) => {
    const mode = args[0]?.toLowerCase()
    const configPath = path.resolve('./config.json')
    let config = JSON.parse(fs.readFileSync(configPath))

    if(!mode) return sock.sendMessage(m.key.remoteJid, {
      text: `*BOT MODE SETTINGS*\n\n!mode public - Everyone can use bot\n!mode private - Only owner + sudos\n!mode group - Bot works in groups only\n!mode inbox - Bot works in DM only\nCurrent: *${config.mode}*`
    }, { quoted: m })

    const validModes = ['public', 'private', 'group', 'inbox']
    if(!validModes.includes(mode)) return sock.sendMessage(m.key.remoteJid, { text: 'Invalid mode. Use: public | private | group | inbox' }, { quoted: m })

    config.mode = mode
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

    let msg = ''
    if(mode === 'public') msg = '✅ Bot is now *PUBLIC*\nAnyone can use commands'
    if(mode === 'private') msg = '🔒 Bot is now *PRIVATE*\nOnly owner + sudos can use'
    if(mode === 'group') msg = '👥 Bot is now *GROUP MODE*\nWill only work in groups'
    if(mode === 'inbox') msg = '📩 Bot is now *INBOX MODE*\nWill only work in DM'

    await sock.sendMessage(m.key.remoteJid, { text: msg }, { quoted: m })
  }
}

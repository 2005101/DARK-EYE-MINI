import fs from 'fs'

// BOX FUNCTION FOR ALL MENUS
const boxMenu = (title, cmds) => {
    let text = `╭─❒「 *${title}* 」❒\n`
    cmds.forEach(cmd => text += `│≈♤ ◦ ${cmd}\n`)
    text += `╰─────────────────────❒\n\n`
    return text
}

export default {
  name: 'menu',
  desc: 'Show all commands',
  execute: async (sock, m) => {
    const prefix = '!'
    
    let menuText = `╭─❒「 *DARK-EYE-MINI* 」❒\n│ Bot: Active ✅\n╰─────────────────────❒\n\n`

    const categories = fs.readdirSync('./commands')
    
    for (const category of categories) {
      const files = fs.readdirSync(`./commands/${category}`).filter(f => f.endsWith('.js'))
      const cmds = files.map(f => prefix + f.replace('.js', ''))
      const title = category.charAt(0).toUpperCase() + category.slice(1)
      menuText += boxMenu(title, cmds)
    }

    menuText += `> Powered by DARK-EYE-MINI`
    await sock.sendMessage(m.key.remoteJid, { text: menuText }, { quoted: m })
  }
}

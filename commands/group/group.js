export default {
  name: 'group',
  desc: 'Open or close group',
  execute: async(sock, m, args) => {
    if(args[0] === 'open'){
      await sock.groupSettingUpdate(m.key.remoteJid, 'not_announcement')
      await sock.sendMessage(m.key.remoteJid, { text: '✅ Group Opened' }, { quoted: m })
    } else if(args[0] === 'close'){
      await sock.groupSettingUpdate(m.key.remoteJid, 'announcement')
      await sock.sendMessage(m.key.remoteJid, { text: '🔒 Group Closed' }, { quoted: m })
    } else {
      await sock.sendMessage(m.key.remoteJid, { text: 'Usage:!group open |!group close' }, { quoted: m })
    }
  }
}

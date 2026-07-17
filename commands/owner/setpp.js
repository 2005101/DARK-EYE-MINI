import { downloadMediaMessage } from '@whiskeysockets/baileys'
export default { 
  name: 'setpp', 
  desc: 'Set bot profile pic. Reply to image', 
  execute: async(sock, m) => {
    if(!m.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) 
      return sock.sendMessage(m.key.remoteJid, { text: 'Reply to an image' }, { quoted: m })
    const media = await downloadMediaMessage(m.message.extendedTextMessage.contextInfo.quotedMessage, 'buffer', {})
    await sock.updateProfilePicture(sock.user.id, media)
    await sock.sendMessage(m.key.remoteJid, { text: '✅ Profile picture updated' }, { quoted: m })
  }
}

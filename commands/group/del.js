export default {
  name: 'del',
  desc: 'Delete messages.!del [reply] or!del 5',
  execute: async(sock, m, args) => {
    const groupId = m.key.remoteJid
    const sender = m.sender

    // Admin check
    const isGroup = groupId.endsWith('@g.us')
    if(isGroup){
      const metadata = await sock.groupMetadata(groupId)
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net'
      const isBotAdmin = metadata.participants.find(p => p.id === botNumber)?.admin
      const isSenderAdmin = metadata.participants.find(p => p.id === sender)?.admin
      if(!isBotAdmin) return sock.sendMessage(groupId, { text: '❌ Bot must be ADMIN' }, { quoted: m })
      if(!isSenderAdmin) return sock.sendMessage(groupId, { text: '❌ Admin only' }, { quoted: m })
    }

    let deletedCount = 0
    const cache = Array.from(global.messageCache.values()).filter(x => x.key.remoteJid === groupId)

    // CASE 1:!del with reply
    if(m.message.extendedTextMessage?.contextInfo?.quotedMessage){
      const quotedId = m.message.extendedTextMessage.contextInfo.stanzaId
      const target = global.messageCache.get(quotedId)
      if(!target) return sock.sendMessage(groupId, { text: '❌ Message too old or not in cache' }, { quoted: m })

      await sock.sendMessage(groupId, { delete: target.key })
      global.messageCache.delete(quotedId)
      deletedCount = 1
    }
    // CASE 2:!del 5
    else if(args[0] &&!isNaN(args[0])){
      const amount = parseInt(args[0])
      if(amount < 1 || amount > 100) return sock.sendMessage(groupId, { text: '❌ Usage:!del 1-100' }, { quoted: m })

      // Get last N messages from cache
      const toDelete = cache.slice(-amount)
      if(toDelete.length === 0) return sock.sendMessage(groupId, { text: '❌ No messages in cache to delete' }, { quoted: m })

      for(const msg of toDelete){
        try{
          await sock.sendMessage(groupId, { delete: msg.key })
          global.messageCache.delete(msg.key.id)
          deletedCount++
          await new Promise(r => setTimeout(r, 200))
        }catch(e){}
      }
    }
    // CASE 3: Wrong usage
    else {
      return sock.sendMessage(groupId, {
        text: `*USAGE*\n!del [reply to message] - Delete 1 message\n!del 5 - Delete last 5 messages\n> _*powered by DARK-EYE OFC DEV*_`
      }, { quoted: m })
    }

    // Also delete the command message
    await sock.sendMessage(groupId, { delete: m.key })

    await sock.sendMessage(groupId, {
      text: `✅ Successfully deleted *${deletedCount}* message${deletedCount > 1? 's' : ''}\n\n> _*powered by DARK-EYE OFC DEV*_`
    })
  }
}

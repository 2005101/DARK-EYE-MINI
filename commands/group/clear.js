export default {
  name: 'clear',
  desc: 'Clear chat.!clear 20 or!clear all',
  execute: async(sock, m, args) => {
    const chatId = m.key.remoteJid
    const sender = m.sender

    // Admin check for groups
    const isGroup = chatId.endsWith('@g.us')
    if(isGroup){
      const metadata = await sock.groupMetadata(chatId)
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net'
      const isBotAdmin = metadata.participants.find(p => p.id === botNumber)?.admin
      const isSenderAdmin = metadata.participants.find(p => p.id === sender)?.admin
      if(!isBotAdmin) return sock.sendMessage(chatId, { text: '❌ Bot must be ADMIN' }, { quoted: m })
      if(!isSenderAdmin) return sock.sendMessage(chatId, { text: '❌ Admin only' }, { quoted: m })
    }

    const arg = args[0]?.toLowerCase()
    if(!arg) return sock.sendMessage(chatId, {
      text: `*USAGE*\n!clear 20 - Delete last 20 messages\n!clear all - Delete all cached messages\n> _*powered by DARK-EYE OFC DEV*_`
    }, { quoted: m })

    const cache = Array.from(global.messageCache.values()).filter(x => x.key.remoteJid === chatId)
    let deletedCount = 0
    let toDelete = []

    if(arg === 'all'){
      toDelete = cache
    } else if(!isNaN(arg)){
      const amount = parseInt(arg)
      if(amount < 1 || amount > 500) return sock.sendMessage(chatId, { text: '❌ Usage:!clear 1-500' }, { quoted: m })
      toDelete = cache.slice(-amount)
    } else {
      return sock.sendMessage(chatId, { text: '❌ Invalid usage. Use:!clear 20 or!clear all' }, { quoted: m })
    }

    if(toDelete.length === 0) return sock.sendMessage(chatId, { text: '❌ No messages in cache' }, { quoted: m })

    for(const msg of toDelete){
      try{
        await sock.sendMessage(chatId, { delete: msg.key })
        global.messageCache.delete(msg.key.id)
        deletedCount++
        await new Promise(r => setTimeout(r, 150)) // avoid rate limit
      }catch(e){}
    }

    // Delete command message too
    await sock.sendMessage(chatId, { delete: m.key })

    await sock.sendMessage(chatId, {
      text: `🧹 Successfully cleared *${deletedCount}* message${deletedCount > 1? 's' : ''}\n\n> _*powered by DARK-EYE OFC DEV*_`
    })
  }
}

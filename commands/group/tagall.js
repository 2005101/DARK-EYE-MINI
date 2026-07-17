export default {
  name: 'tagall',
  desc: 'Tag all members',
  execute: async(sock, m, args) => {
    const group = await sock.groupMetadata(m.key.remoteJid)
    let text = `*TAGALL ${group.participants.length} MEMBERS*\n*Message:* ${args.join(' ')}\n\n`
    let mentions = []
    group.participants.forEach(p => {
      text += `@${p.id.split('@')[0]} `
      mentions.push(p.id)
    })
    await sock.sendMessage(m.key.remoteJid, { text, mentions }, { quoted: m })
  }
}

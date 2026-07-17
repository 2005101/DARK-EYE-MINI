export default { name: 'broadcast', desc: 'Send to all chats', execute: async(sock,m,args)=>{
  const text = args.join(' ')
  const chats = await sock.groupFetchAllParticipating()
  for(let chat in chats) await sock.sendMessage(chats[chat].id,{text:`*Broadcast*\n\n${text}`})
  await sock.sendMessage(m.key.remoteJid,{text:'Broadcast sent'},{quoted:m})
}}

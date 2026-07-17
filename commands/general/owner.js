export default { 
  name: 'owner', 
  desc: 'Show bot owner', 
  execute: async(sock, m) => {
    const text = `╭─❒「 *BOT OWNER* 」❒
│≈♤ ◦ *Name*: DARK-EYE OFC DEV
│≈♤ ◦ *Number*: +263 783 546 271  
│≈♤ ◦ *Email*: alextheon.com.free
│≈♤ ◦ *Location*: ZW🇿🇼
╰─────────────────────❒`
    
    await sock.sendMessage(m.key.remoteJid, { 
      text, 
      contextInfo: {
        externalAdReply: {
          title: "DARK-EYE-MINI",
          body: "Contact the Owner",
          thumbnailUrl: "https://i.imgur.com/2M4pLkY.jpg", // change to your logo
          sourceUrl: "https://github.com/2005101/DARK-EYE-MINI",
          mediaType: 1
        }
      }
    }, { quoted: m })
  }
}

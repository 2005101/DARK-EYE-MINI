export default { 
  name: 'eval', 
  desc: 'Run javascript code', 
  execute: async(sock, m, args) => {
    try{
      let code = args.join(' ')
      let result = await eval(code)
      await sock.sendMessage(m.key.remoteJid, { text: `*Result:* ${result}` }, { quoted: m })
    } catch(e){
      await sock.sendMessage(m.key.remoteJid, { text: `*Error:* ${e}` }, { quoted: m })
    }
  }
}

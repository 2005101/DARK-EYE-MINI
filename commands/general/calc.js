export default { name: 'calc', desc: '2+2', execute: async(sock,m,args)=>{
  try{ await sock.sendMessage(m.key.remoteJid,{text:`Result: ${eval(args.join(''))}`},{quoted:m}) }
  catch{ await sock.sendMessage(m.key.remoteJid,{text:'Usage:!calc 2+2'},{quoted:m}) }
}}

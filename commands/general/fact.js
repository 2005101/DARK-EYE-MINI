export default { name: 'fact', desc: 'Random fact', execute: async(sock,m)=>{
  const facts = ["Honey never spoils","Octopuses have 3 hearts"]
  await sock.sendMessage(m.key.remoteJid,{text: facts[Math.floor(Math.random()*facts.length)]},{quoted:m})
}}

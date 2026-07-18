const flirts = ['You+me=❤️','Are you wifi? Cuz I\'m feeling a connection']
const compliments = ['You\'re amazing','Your smile is beautiful']
const truths = ['What\'s your biggest secret?','Who do you like?']
const dares = ['Send a voice note','Do 10 pushups']
const insults = ['You\'re dumber than a bot','Go touch grass']

function random(arr){ return arr[Math.floor(Math.random()*arr.length)] }

export default {
  name: 'fun',
  desc: 'Fun commands',
  execute: async(sock, m, args) => {
    const cmd = args[0]?.toLowerCase()
    const map = {flirt:flirts,compliment:compliments,truth:truths,dare:dares,insult:insults}
    if(!map[cmd]) return sock.sendMessage(m.key.remoteJid, {
      text: `*FUN*\n!fun flirt\n!fun compliment\n!fun truth\n!fun dare\n!fun insult\n> _*powered by DARK-EYE OFC DEV*_`
    }, { quoted: m })

    await sock.sendMessage(m.key.remoteJid, { text: random(map[cmd]) + `\n\n> _*powered by DARK-EYE OFC DEV*_` }, { quoted: m })
  }
}

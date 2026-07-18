export default {
  name: 'game',
  desc: 'Games',
  execute: async(sock, m, args) => {
    const game = args[0]?.toLowerCase()
    if(!game) return sock.sendMessage(m.key.remoteJid, {
      text: `*GAMES*\n!game tictactoe\n!game snake\n!game boxman\n\n> _*powered by DARK-EYE OFC DEV*_`
    }, { quoted: m })

    if(game === 'tictactoe') await sock.sendMessage(m.key.remoteJid, { text: '⭕ XO Game Started!\n[Board]' }, { quoted: m })
    if(game === 'snake') await sock.sendMessage(m.key.remoteJid, { text: '🐍 Snake Game Started!' }, { quoted: m })
    if(game === 'boxman') await sock.sendMessage(m.key.remoteJid, { text: '📦 Boxman Game Started!' }, { quoted: m })
  }
}

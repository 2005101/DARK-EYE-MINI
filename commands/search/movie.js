import fetch from 'node-fetch'
export default {
  name: 'movie',
  desc: 'Search movie info or download link',
  execute: async(sock, m, args) => {
    const q = args.join(' ')
    if(!q) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:\n!movieinfo avengers\n!movie avengers' }, { quoted: m })
    
    await sock.sendMessage(m.key.remoteJid, { text: '⏳ Searching...' }, { quoted: m })

    try {
      // 1. GET INFO FROM IMDB
      const infoApi = `https://api.dreaded.in/api/imdb?search=${q}`
      const infoRes = await fetch(infoApi)
      const infoData = await infoRes.json()
      const m1 = infoData.result

      if(!m1) return sock.sendMessage(m.key.remoteJid, { text: 'Movie not found' }, { quoted: m })

      // 2. GET DOWNLOAD LINK
      const dlApi = `https://api.dreaded.in/api/movie?search=${q}`
      const dlRes = await fetch(dlApi)
      const dlData = await dlRes.json()
      const dl = dlData.result

      const caption = `*🎬 ${m1.title}*\n
*Year*: ${m1.year}
*Rating*: ${m1.rating}/10
*Genre*: ${m1.genre}
*Duration*: ${m1.duration}
*Plot*: ${m1.plot}

*Download Links:*
${dl?.link1 ? `1. ${dl.link1}\n` : ''}
${dl?.link2 ? `2. ${dl.link2}\n` : ''}
${dl?.link3 ? `3. ${dl.link3}` : ''}

_Powered by DARK-EYE-MINI_`

      await sock.sendMessage(m.key.remoteJid, {
        image: { url: m1.poster },
        caption: caption
      }, { quoted: m })

    } catch(e) {
      await sock.sendMessage(m.key.remoteJid, { text: `Error: ${e.message}` }, { quoted: m })
    }
  }
}

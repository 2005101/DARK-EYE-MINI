import fetch from 'node-fetch'
export default {
  name: 'weather',
  desc: 'Check weather',
  execute: async(sock, m, args) => {
    const city = args.join(' ')
    if(!city) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!weather Harare' }, { quoted: m })
    const api = `https://api.dreaded.in/api/weather?city=${city}`
    const res = await fetch(api)
    const data = await res.json()
    const w = data.result
    await sock.sendMessage(m.key.remoteJid, {
      text: `*Weather in ${w.location}*\nTemp: ${w.temp}°C\nCondition: ${w.condition}\nHumidity: ${w.humidity}%\nWind: ${w.wind} km/h`
    }, { quoted: m })
  }
}

import { exec } from 'child_process'
import fs from 'fs'
import fetch from 'node-fetch'
import { promisify } from 'util'
const execAsync = promisify(exec)

const START_TIME = Date.now()
const REPO = 'https://github.com/2005101/DARK-EYE-MINI'
const REPO_API = 'https://api.github.com/repos/2005101/DARK-EYE-MINI'

function formatUptime(ms){
  let s = Math.floor(ms/1000)
  let d = Math.floor(s/86400)
  let h = Math.floor((s%86400)/3600)
  let m = Math.floor((s%3600)/60)
  let sec = s%60
  return `${d}d ${h}h ${m}m ${sec}s`
}

export default {
  name: 'system',
  desc: 'System/Dev commands',
  execute: async(sock, m, args) => {
    const cmd = args[0]?.toLowerCase()
    const chatId = m.key.remoteJid
    const sender = m.sender
    const OWNER = "263783546271@s.whatsapp.net" // change to your number

    // OWNER ONLY
    if(sender!== OWNER) return sock.sendMessage(chatId, { text: '❌ Owner only command' }, { quoted: m })

    if(!cmd) return sock.sendMessage(chatId, {
      text: `*SYSTEM COMMANDS*\n!system memory\n!system repo\n!system fork\n!system getzip\n!system uptime\n!system runtime\n!system darkeyetmnl <cmd>\n!system gitclone <link>\n\n> _*powered by DARK-EYE OFC DEV*_`
    }, { quoted: m })

    // 1. MEMORY
    if(cmd === 'memory'){
      const mem = process.memoryUsage()
      await sock.sendMessage(chatId, {
        text: `*RAM USAGE*\nHeap: ${(mem.heapUsed/1024/1024).toFixed(2)} MB / ${(mem.heapTotal/1024/1024).toFixed(2)} MB\nRSS: ${(mem.rss/1024/1024).toFixed(2)} MB\n\n> _*powered by DARK-EYE OFC DEV*_`
      }, { quoted: m })
    }

    // 2. REPO INFO
    else if(cmd === 'repo'){
      const res = await fetch(REPO_API)
      const data = await res.json()
      await sock.sendMessage(chatId, {
        text: `*DARK-EYE-MINI REPO*\nName: ${data.name}\nStars: ⭐ ${data.stargazers_count}\nForks: 🍴 ${data.forks_count}\nIssues: ${data.open_issues}\nLanguage: ${data.language}\nUpdated: ${new Date(data.updated_at).toLocaleDateString()}\nLink: ${REPO}\n\n> _*powered by DARK-EYE OFC DEV*_`
      }, { quoted: m })
    }

    // 3. FORK
    else if(cmd === 'fork'){
      await sock.sendMessage(chatId, {
        text: `🍴 *FORK REPO*\nClick to fork:\n${REPO}\n\nAfter forking, change owner in config.json\n> _*powered by DARK-EYE OFC DEV*_`
      }, { quoted: m })
    }

    // 4. GETZIP - send repo as zip
    else if(cmd === 'getzip'){
      await sock.sendMessage(chatId, { text: '📦 Fetching repo zip... please wait' }, { quoted: m })
      const zipUrl = `${REPO}/archive/refs/heads/main.zip`
      const res = await fetch(zipUrl)
      const buffer = await res.buffer()
      await sock.sendMessage(chatId, {
        document: buffer,
        fileName: 'DARK-EYE-MINI.zip',
        mimetype: 'application/zip'
      }, { quoted: m })
    }

    // 5. DARKEYETMNL - run termux/codespace commands
    else if(cmd === 'darkeyetmnl'){
      const terminalCmd = args.slice(1).join(' ')
      if(!terminalCmd) return sock.sendMessage(chatId, { text: '❌ Usage:!system darkeyetmnl npm install' }, { quoted: m })

      await sock.sendMessage(chatId, { text: `🖥️ Running: *${terminalCmd}*\n\n> _*powered by DARK-EYE OFC DEV*_` }, { quoted: m })
      try{
        const { stdout, stderr } = await execAsync(terminalCmd, { timeout: 30000 })
        await sock.sendMessage(chatId, {
          text: `*OUTPUT:*\n\`\`${stdout || stderr || 'Done'}\`\`\``
        }, { quoted: m })
      }catch(e){
        await sock.sendMessage(chatId, { text: `❌ Error:\n\`\`\`${e.message}\`\`\`` }, { quoted: m })
      }
    }

    // 6. GITCLONE
    else if(cmd === 'gitclone'){
      const link = args[1]
      if(!link) return sock.sendMessage(chatId, { text: '❌ Usage:!system gitclone https://github.com/user/repo' }, { quoted: m })

      await sock.sendMessage(chatId, { text: `📥 Cloning: ${link}` }, { quoted: m })
      try{
        const { stdout } = await execAsync(`git clone ${link}`, { timeout: 60000 })
        await sock.sendMessage(chatId, { text: `✅ Cloned successfully\n\`\`\`${stdout}\`\`\`` }, { quoted: m })
      }catch(e){
        await sock.sendMessage(chatId, { text: `❌ Clone failed:\n\`\`\`${e.message}\`\`\`` }, { quoted: m })
      }
    }

    // 7. UPTIME
    else if(cmd === 'uptime'){
      const up = formatUptime(Date.now() - START_TIME)
      const date = new Date().toLocaleString('en-ZW', { timeZone: 'Africa/Harare' })
      await sock.sendMessage(chatId, {
        text: `*BOT UPTIME*\nRunning for: ${up}\nStarted: ${new Date(START_TIME).toLocaleString()}\nNow: ${date}\n\n> _*powered by DARK-EYE OFC DEV*_`
      }, { quoted: m })
    }

    // 8. RUNTIME
    else if(cmd === 'runtime'){
      await sock.sendMessage(chatId, {
        text: `*BOT RUNTIME*\nNode: ${process.version}\nPlatform: ${process.platform}\nArch: ${process.arch}\nPID: ${process.pid}\nCWD: ${process.cwd()}\n\n> _*powered by DARK-EYE OFC DEV*_`
      }, { quoted: m })
    }

    else {
      await sock.sendMessage(chatId, { text: '❌ Unknown system command' }, { quoted: m })
    }
  }
}


import { default as makeWASocket, DisconnectReason, useMultiFileAuthState, downloadMediaMessage } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import fs from 'fs';
import os from 'os';
import { exec } from 'child_process';
import { performance } from 'perf_hooks';
import axios from 'axios';
import moment from 'moment-timezone';

const PREFIX = '.';
const OWNER = '263783546271'; // CHANGE THIS TO YOUR N>
const BOT_NAME = 'DARK-EYE BOT';
const VERSION = '1.0.0';
let startTime = Date.now();

global.messageCache = new Map() // store messages
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prefix = '!' // change this
const commands = new Map()

// BOX FUNCTION FOR ALL MENUS
const boxMenu = (title, cmds) => {
    let text = `╭─❒「 *${title}* 」❒\n`
    cmds.forEach(cmd => text += `│≈♤ ◦ ${cmd}\n`)
    text += `╰─────────────────────❒\n\n`
    return text
}

// Load all commands
const commandFolders = fs.readdirSync('./commands')
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = await import(`./commands/${folder}/${file}`)
    commands.set(command.default.name, command.default)
  }
}

// Ask for phone number in terminal
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        auth: state,
        browser: Browsers.ubuntu('DARK-EYE-MINI')
    })

    // PAIRING CODE LOGIN
    if (!sock.authState.creds.registered) {
        const phoneNumber = await question('Enter your WhatsApp number with country code e.g 26377xxxxxxx: ')
        const code = await sock.requestPairingCode(phoneNumber.trim())
        console.log(`Your Pairing Code: ${code}`)
        console.log(`Go to WhatsApp > Linked Devices > Link with Phone Number > Enter code above`)
    }

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode!== DisconnectReason.loggedOut
            console.log('Connection closed. Reconnecting...', shouldReconnect)
            if (shouldReconnect) startBot()
        } else if (connection === 'open') {
            console.log('✅ DARK-EYE-MINI Connected!')
            rl.close()
        }
    })

const isGroup = m.key.remoteJid.endsWith('@g.us')
const isPrivate = m.key.remoteJid.endsWith('@s.whatsapp.net')
const isOwner = m.sender.split('@')[0] === config.owner
const isSudo = config.sudos.includes(m.sender.split('@')[0])

// MODE CHECK
if(config.mode === 'private' &&!isOwner &&!isSudo){
  return sock.sendMessage(m.key.remoteJid, { text: '❌ Bot is in PRIVATE mode' }, { quoted: m })
}
if(config.mode === 'group' &&!isGroup){
  return sock.sendMessage(m.key.remoteJid, { text: '❌ Bot only works in GROUPS' }, { quoted: m })
}
if(config.mode === 'inbox' && isGroup){
  return sock.sendMessage(m.key.remoteJid, { text: '❌ Bot only works in INBOX/DM' }, { quoted: m })
}

sock.ev.on('group-participants.update', async (anu) => {
  let config = JSON.parse(fs.readFileSync('./config.json'))
  if(!config.welcome) return

  if(anu.action === 'add'){
    const botName = sock.user.name || 'DARK-EYE-MINI'
    const metadata = await sock.groupMetadata(anu.id)
    const participants = metadata.participants.length
    const num = anu.participants[0]
    const userName = num.split('@')[0]
    const groupName = metadata.subject

    let pp
    try {
      pp = await sock.profilePictureUrl(num, 'image')
    } catch {
      pp = 'https://i.imgur.com/2WZlPPs.jpeg' // default pp
    }

    const watermark = `*${watermark}*`

    const welcomeText = `Welcome: @${userName}
To: ${groupName}
You take the nō ${participants} sit
Total members: ${participants}
From: ${participants - 1}

> _${watermark}_`

    await sock.sendMessage(anu.id, {
      image: { url: pp },
      caption: welcomeText,
      mentions: [num]
    })
  }

  // Goodbye message
  if(anu.action === 'remove'){
    const metadata = await sock.groupMetadata(anu.id)
    const participants = metadata.participants.length
    const num = anu.participants[0]
    const userName = num.split('@')[0]
    const groupName = metadata.subject

    await sock.sendMessage(anu.id, {
      text: `Goodbye: @${userName}\nFrom: ${groupName}\nMembers left: ${participants}`,
      mentions: [num]
    })
  }
})

const msg = m.messages[0]
if(!msg.message) return

const jid = msg.key.remoteJid
const sender = msg.key.participant || msg.key.remoteJid
const OWNER = "263783546271@s.whatsapp.net"

// Cache all messages except owner
if(sender!== OWNER){
  global.messageCache.set(msg.key.id, {
    key: msg.key,
    sender: sender,
    time: msg.messageTimestamp
  })
  // auto delete from cache after 48h
  setTimeout(() => global.messageCache.delete(msg.key.id), 172800000)
}

let config = JSON.parse(fs.readFileSync('./config.json'))
const msg = m.messages[0]
if(!msg.message || msg.key.fromMe) return

const isGroup = msg.key.remoteJid.endsWith('@g.us')
if(!isGroup || config.antiBotMode === 'off') return

const sender = msg.key.participant
const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net'
const isBot = sender!== botNumber && (
  sender.includes('bot') ||
  msg.message?.protocolMessage ||
  msg.message?.buttonsMessage ||
  msg.message?.templateMessage
)
const isOwner = sender.split('@')[0] === config.owner
const isSudo = config.sudos.includes(sender)
if(!isBot || isOwner || isSudo) return

const metadata = await sock.groupMetadata(msg.key.remoteJid)
const isAdmin = metadata.participants.find(p => p.id === botNumber)?.admin
if(!isAdmin) return

// Delete the bot message first
await sock.sendMessage(msg.key.remoteJid, { delete: msg.key })

if(!config.antiBotWarnings) config.antiBotWarnings = {}
if(!config.antiBotWarnings[sender]) config.antiBotWarnings[sender] = 0

let config = JSON.parse(fs.readFileSync('./config.json'))
const msg = m.messages[0]
if(!msg.message || msg.key.fromMe) return

const isGroup = msg.key.remoteJid.endsWith('@g.us')
if(!isGroup || config.antiLinkMode === 'off') return

const sender = msg.key.participant
const groupId = msg.key.remoteJid
const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net'
const isOwner = sender.split('@')[0] === config.owner
const isSudo = config.sudos.includes(sender)
if(isOwner || isSudo) return // owner/sudo can send any link

const metadata = await sock.groupMetadata(groupId)
const isAdmin = metadata.participants.find(p => p.id === botNumber)?.admin
if(!isAdmin) return

// Get message text
let text = ''
const type = Object.keys(msg.message)[0]
if(type === 'conversation') text = msg.message.conversation
else if(type === 'extendedTextMessage') text = msg.message.extendedTextMessage.text
else return

// Check for links
const linkRegex = /(https?:\/\/|www\.|chat\.whatsapp\.com)/i
if(!linkRegex.test(text)) return

// Get this group's invite code
const groupInvite = await sock.groupInviteCode(groupId)
const allowedLink = `chat.whatsapp.com/${groupInvite}`

// If message contains a link but NOT this group's link = BLOCK
if(text.includes(allowedLink)) return // allow this group's link

// Delete the link message
await sock.sendMessage(groupId, { delete: msg.key })

if(!config.antiLinkWarnings) config.antiLinkWarnings = {}
if(!config.antiLinkWarnings[sender]) config.antiLinkWarnings[sender] = 0

const reason = 'Sending Other Group Link'

// MODE: KICK
if(config.antiLinkMode === 'kick'){
  await sock.sendMessage(groupId, {
    text: `⚠️ @${sender.split('@')[0]} other group links are not allowed 🚫 here!\n\n> _*powered by DARK-EYE OFC DEV*_`,
    mentions: [sender]
  })
  await sock.groupParticipantsUpdate(groupId, [sender], "remove")
}

// MODE: WARN
if(config.antiLinkMode === 'warn'){
  config.antiLinkWarnings[sender]++
  const warnCount = config.antiLinkWarnings[sender]
  saveConfig(config)

  await sock.sendMessage(groupId, {
    text: `⚠️WARNING ⚠️\n@${sender.split('@')[0]}\nBecause of: *${reason}*\nWarn: ${warnCount}/3\n> _*powered by DARK-EYE OFC DEV*_`,
    mentions: [sender]
  })

  if(warnCount >= 3){
    await sock.sendMessage(groupId, { text: `🚫 @${sender.split('@')[0]} kicked after 3 warnings`, mentions: [sender] })
    await sock.groupParticipantsUpdate(groupId, [sender], "remove")
    config.antiLinkWarnings[sender] = 0
    saveConfig(config)
  }
}

// MODE: ON
if(config.antiLinkMode === 'on'){
  await sock.sendMessage(groupId, {
    text: `⚠️ @${sender.split('@')[0]} other group links are not allowed here!\n\n> _*powered by DARK-EYE OFC DEV*_`,
    mentions: [sender]
  })
}

// MODE: KICK
if(config.antiBotMode === 'kick'){
  await sock.sendMessage(msg.key.remoteJid, {
    text: `⚠️⚠️⚠️ @${sender.split('@')[0]} bot are not allowed 🚫 here!\n\n> _*powered by DARK-EYE OFC DEV*_`,
    mentions: [sender]
  })
  await sock.groupParticipantsUpdate(msg.key.remoteJid, [sender], "remove")
}

// MODE: WARN
if(config.antiBotMode === 'warn'){
  config.antiBotWarnings[sender]++
  const warnCount = config.antiBotWarnings[sender]
  saveConfig(config)

  await sock.sendMessage(msg.key.remoteJid, {
    text: `⚠️WARNING ⚠️\n@${sender.split('@')[0]}\nBecause of: *Using Bot in Group*\nWarn: ${warnCount}/3\n\n> _*powered by DARK-EYE OFC DEV*_`,
    mentions: [sender]
  })

  if(warnCount >= 3){
    await sock.sendMessage(msg.key.remoteJid, { text: `🚫 @${sender.split('@')[0]} kicked after 3 warnings`, mentions: [sender] })
    await sock.groupParticipantsUpdate(msg.key.remoteJid, [sender], "remove")
    config.antiBotWarnings[sender] = 0
    saveConfig(config)
  }
}

// MODE: ON
if(config.antiBotMode === 'on'){
  await sock.sendMessage(msg.key.remoteJid, {
    text: `⚠️⚠️⚠️ @${sender.split('@')[0]} bot are not allowed here!\n\n> _*powered by DARK-EYE OFC DEV*_`,
    mentions: [sender]
  })
}

    // Message handler
    sock.ev.on('messages.upsert', async ({ messages }) => {
      const m = messages[0]
      if (!m.message || m.key.fromMe) return
      
const msg = m.messages[0]
if(!msg.message) return

const jid = msg.key.remoteJid
const sender = msg.key.participant || msg.key.remoteJid
const messageType = Object.keys(msg.message)[0]
const messageContent = msg.message[messageType]

// Don't cache owner messages
if(sender!== OWNER){
  messageCache.set(msg.key.id, {
    message: msg.message,
    sender: sender,
    time: msg.messageTimestamp,
    type: messageType
  })
  // keep cache for 24h max
  setTimeout(() => messageCache.delete(msg.key.id), 86400000)
}

      const text = m.message.conversation || m.message.extendedTextMessage?.text || ''
      if (!text.startsWith(prefix)) return

      const args = text.slice(prefix).trim().split(/ +/)
      const commandName = args.shift().toLowerCase()

      const command = commands.get(commandName)
    const OWNER = "263783546271@s.whatsapp.net"
const messageCache = new Map() // store messages
const OWNER = "263783546271@s.whatsapp.net"

sock.ev.on('messages.delete', async (msg) => {
  let config = JSON.parse(fs.readFileSync('./config.json'))
  if(!config.antiDelete) return

  const deletedMsg = messageCache.get(msg.keys[0].id)
  if(!deletedMsg) return // not in cache

  const deletedBy = msg.keys[0].participant || msg.keys[0].remoteJid
  const deletedTime = new Date().toLocaleString('en-ZW', { timeZone: 'Africa/Harare' })
  const sentTime = new Date(deletedMsg.time * 1000).toLocaleString('en-ZW', { timeZone: 'Africa/Harare' })

  // Skip if owner deleted
  if(deletedBy === OWNER) return

  const group = deletedMsg.sender.endsWith('@g.us')? deletedMsg.sender : deletedBy
  let deletedContent = ''

  // Extract text from deleted message
  if(deletedMsg.type === 'conversation') deletedContent = deletedMsg.message.conversation
  else if(deletedMsg.type === 'extendedTextMessage') deletedContent = deletedMsg.message.extendedTextMessage.text
  else deletedContent = `*[${deletedMsg.type}]*`

  const antiDeleteMsg = `🛡ANTI DELETE🛡
DELETED BY: @${deletedBy.split('@')[0]}
DELETED TIME: ${deletedTime}
SENT BY: @${deletedMsg.sender.split('@')[0]}
SENT TIME: ${sentTime}
 ${deletedContent}

> _*powered by DARK-EYE OFC DEV*_`

  await sock.sendMessage(group, {
    text: antiDeleteMsg,
    mentions: [deletedBy, deletedMsg.sender]
  })

  // Resend the deleted message
  await sock.sendMessage(group, { forward: deletedMsg.message }, { quoted: null })
})

// inside message handler, before command.execute
if (commandFolders.includes(folder) && folder === 'owner') {
  if(m.key.participant !== OWNER && m.key.remoteJid !== OWNER){
    return sock.sendMessage(m.key.remoteJid, { text: '❌ Owner only' }, { quoted: m })
  }
}

    if (command) {
        try {
          await command.execute(sock, m, args)
        } catch (e) {
          console.log(e)
          await sock.sendMessage(m.key.remoteJid, { text: '❌ Error running command' }, { quoted: m })
        }
      }
    })
}

startBot()

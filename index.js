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

    // Message handler
    sock.ev.on('messages.upsert', async ({ messages }) => {
      const m = messages[0]
      if (!m.message || m.key.fromMe) return
      
      const text = m.message.conversation || m.message.extendedTextMessage?.text || ''
      if (!text.startsWith(prefix)) return

      const args = text.slice(prefix).trim().split(/ +/)
      const commandName = args.shift().toLowerCase()

      const command = commands.get(commandName)
    const OWNER = "263783546271@s.whatsapp.net"

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

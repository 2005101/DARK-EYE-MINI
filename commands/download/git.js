export default {
  name: 'git',
  desc: 'Download Github repo',
  execute: async(sock, m, args) => {
    const url = args[0]
    if(!url) return sock.sendMessage(m.key.remoteJid, { text: 'Usage:!git https://github.com/user/repo' }, { quoted: m })
    const zip = url.replace('github.com','api.github.com/repos') + '/zipball'
    await sock.sendMessage(m.key.remoteJid, { document: { url: zip }, fileName: 'repo.zip', mimetype: 'application/zip' }, { quoted: m })
  }
}

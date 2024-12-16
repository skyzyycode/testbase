module.exports  = {
    async events(m, { sock, Func }) {
      if (m.isGroup && Func.isUrl(m.body)) return m.reply(`> Terdeteksi @${m.sender.split("@")[0]} mengirim link`);
  }
}

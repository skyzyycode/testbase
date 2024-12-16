module.exports  = {
    async events(m, { sock, Func }) {
      if (Func.isUrl(m.body)) return m.reply(`> Terdeteksi @${m.sender.split("@")[0]} mengirim link`);
  }
}
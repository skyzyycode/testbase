const yts = require("yt-search");

module.exports = {
      command: "play",
      alias: [],
      category: ["downloader"],
      description: "Cari video/musik dari YouTube",
      settings: {
         limit: true
      },
    loading: true,
    async run(m, { sock, Func, config, text }) {
     if (!text) throw "> Masukan Pencarian nya"
     let data = await yts(text).then(a => a.videos.getRandom());
     if (data.seconds > 36000) throw "> Maaf durasi di diatas satu jam !\n> Silahkan cari lain"
     let cap = `*– 乂 YouTube - Play*\n`
        cap += `> *- Judul :* ${data.title}\n`
        cap += `> *- Durasi :* ${data.duration.timestamp}\n`
        cap += `> *- Channel :* > ${data.author.name}\n`
        cap += `> *- Upload :* ${data.ago}\n`
        cap += `> *- Link :* ${data.url}\n`    
 
 m.reply({
     poll: {
         name: cap,
         values: [
        `${m.prefix}ytmp3 ${data.url}`,
         `${m.prefix}ytmp4 ${data.url}`
           ],
        selectableCount: 1
       }
    })
   }
}
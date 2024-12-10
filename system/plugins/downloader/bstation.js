const axios = require("axios");
const {
    exec
} = require('child_process');
const fs = require('fs');
const path = require('path');

async function convertVideo(buffer) {
    return new Promise((resolve, reject) => {
        const tempVideoPath = path.resolve('./tmp/contoh.mp4');
        const outputVideoPath = path.resolve('./tmp/converted_video.mp4');

        fs.writeFile(tempVideoPath, buffer, (writeErr) => {
            if (writeErr) {
                return reject(`Error writing video file: ${writeErr.message}`);
            }
            exec(`ffmpeg -i ${tempVideoPath} -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k -movflags +faststart ${outputVideoPath}`, (error, stdout, stderr) => {
          console.log(stdout);
                if (error) {                    
fs.unlinkSync(tempVideoPath);
                    return reject(stderr)
                }
                fs.readFile(outputVideoPath, (err, convertedBuffer) => {
          console.log(convertedBuffer)
                    if (err) {
                        return reject(err.message);
                    }
                    resolve(convertedBuffer);                 fs.unlinkSync(tempVideoPath);                   fs.unlinkSync(outputVideoPath);
                });
            });
        });
    });
}

module.exports = {
    command: "bstation",
    alias: ["blibili"],
    category: ["downloader"],
    settings: {
        limit: true
    },
    description: "Mencari/download video dari bstation",
    loading: true,
    async run(m, { sock, Func, Scraper, text }) {
        if (!text) throw `> *乂 Cara Penggunaan :*\n> *-* Masukan Query untuk mencari video\n> *-* Masukan Url untuk mendownload video\n\n> *乂 Contoh Penggunaan :*\n> *- ${m.prefix + m.command} Video lucu*\n> *- ${m.prefix + m.command} https://www.bilibili.tv/id/video/4793262300860416*`;

        if (Func.isUrl(text)) {
            let data = await Scraper.bstation.download(text);
            let buffer = await Func.fetchBuffer(data.download.url);
            let convertedBuffer = await convertVideo(buffer);

            let size = Func.formatSize(buffer.length);
            let limit = Func.sizeLimit(size, db.list().settings.max_upload);
            if (limit.oversize) throw `Maaf saya tidak dapat mengunduh video bstation karena ukuran video tersebut memiliki batas ukuran yang ditentukan *( ${size} )*, Upgrade status ke premium agar dapat download video hingga *1GB* !`;

            let cap = `*– 乂 Bstation - Downloader*\n`;
            cap += Object.entries(data.metadata).map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`).join("\n");

            m.reply({
                video: convertedBuffer,
                caption: cap
            });
        } else {
            let data = await Scraper.bstation.search(text);
            let cap = `*– 乂 Bstation - search*\n`;
            cap += `> Ketik *${m.prefix + m.command} ${data[0].url}* untuk mendownload video dari bstation\n\n`;
            cap += data.map((res, index) => `*${index + 1}.* ${res.title}\n> *- Penonton :* ${res.views}\n> *- Durasi :* ${res.duration}\n> *- Author :* ${res.author.name}\n> *- Url :* ${res.url}`).join("\n\n");
            m.reply(cap);
        }
    }
};
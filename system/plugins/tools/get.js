const undici = require("undici");
const {
    extension
} = require("mime-types");
const {
  html
} = require("js-beautify");

module.exports = {
    command: "get",
    alias: ["fetch"],
    category: ["tools"],
    settings: {
       limit: true
    },
    description: "Mendapatkan data dari url",
    loading: true,
    async run(m, { sock, Func, text, config }) {
     if (!text) throw `> Masukan atau reply url yang ingin kamu ambil data nya`;
        for (let i of isUrl(text)) {
            let data = await undici.fetch(i);
            let mime = data.headers.get("content-type").split(";")[0];
            let cap = `*– 乂 Fetch - Url*
> *- Reques :* ${i}`;
            let body;
            if (/\html/ig.test(mime)) {
                body = await data.text();
            } else if (/\json/ig.test(mime)) {
                body = await data.json();
            } else if (/image/ig.test(mime)) {
                body = await data.arrayBuffer();
            } else if (/video/ig.test(mime)) {
                body = await data.arrayBuffer();
            } else if (/audio/ig.test(mime)) {
                body = await data.arrayBuffer();
            } else {
                try {
                    body = await data.buffer();
                } catch (e) {
                    body = await data.text();
                }
            }
            if (/\html/ig.test(mime)) {
                await sock.sendMessage(m.cht, {
                    document: Buffer.from(html(body)),
                    caption: cap,
                    fileName: "result.html",
                    mimetype: mime,
                }, {
                    quoted: m
                });
            } else if (/\json/ig.test(mime)) {
                m.reply(JSON.stringify(body, null, 2));
            } else if (/image/ig.test(mime)) {
                sock.sendFile(m.cht, Buffer.from(body), `result.${extension(mime)}`, cap, m);
            } else if (/video/ig.test(mime)) {
                sock.sendFile(m.cht, Buffer.from(body), `result.${extension(mime)}`, cap, m);
            } else if (/audio/ig.test(mime)) {
                sock.sendFile(m.cht, Buffer.from(body), `result.${extension(mime)}`, cap, m, {
                    mimetype: mime
                });
            } else {
               m.reply(Func.jsonFormat(body));
            }
        }
      }
 }
function isUrl(string) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    let result = string.match(urlRegex);
    return result;
}
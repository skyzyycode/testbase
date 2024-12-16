const axios = require("axios");

module.exports = {
  command: "script",
  alias: ["sc", "scbot"],
  category: ["info"],
  description: "Dapatkan Script bot secara gratis",
  async run(m, { sock, Func }) {
    let data = await axios
      .get("https://api.github.com/repos/AxellNetwork/NekoBot")
      .then((a) => a.data);
    let cap = "*– 乂 informasi - Script*\n";
    cap += `> *- Nama :* ${data.name}\n`;
    cap += `> *- Pemilik :* ${data.owner.login}\n`;
    cap += `> *- Star :* ${data.stargazers_count}\n`;
    cap += `> *- Forks :* ${data.forks}\n`;
    cap += `> *- Dibuat sejak :* ${Func.ago(data.created_at)}\n`;
    cap += `> *- Terakhir update :* ${Func.ago(data.updated_at)}\n`;
    cap += `> *- Terakhir publish :* ${Func.ago(data.pushed_at)}\n`;
    cap += `> *- Link :* ${data.html_url}\n`;
    cap +=
      "\nScript dapat kembang kan sendiri dan jika kamu dapat menjual nya secara komersial dengan catatan jangan menghilangkan credits kami *( Kalo bisa tambahkan credits namamu di bawah nama kami )*\n\n*– 乂 Thank for Build Script & Helper*\n> *-* Bang_syaii [ https://github.com/LT-SYAII ]\n> *-* AxellNetwork [ https://github.com/AxellNetwork ]\n\n*– Forum Update :* https://whatsapp.com/channel/0029VauJgduEwEjwwVwLnw37";

    m.reply(cap);
  },
};

const config = require("baileys");
const fs = require('node:fs');
const PhoneNumber = require("awesome-phonenumber");
const axios = require('axios');
const mime = require('mime-types');
const Jimp = require('jimp');
const path = require('path');
const FileType = require("file-type");

module.exports = (connection, store)  => {
	global.ephemeral = { 
		ephemeralExpiration: config.WA_DEFAULT_EPHEMERAL
		}
  let sock = config.makeWASocket(connection);
 
  sock.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decode = config.jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };
  
  sock.appendTextMessage = async (m, text, chatUpdate) => {
    let messages = await config.generateWAMessage(
<<<<<<< HEAD
      m.chat,
=======
      m.cht,
>>>>>>> 8de5675 (v1.1.0)
      {
        text: text,
        mentions: m.mentions,
      },
      {
        userJid: sock.user.id,
        quoted: m.quoted,
        ...ephemeral,
      },
    );
    messages.key.fromMe = config.areJidsSameUser(m.sender, sock.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [config.proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    sock.ev.emit("messages.upsert", msg);
    return m;
  }
  
   sock.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  sock.getFile = async (PATH) => {
    let res, filename;
    const data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
        ? Buffer.from(PATH.split`,`[1], "base64")
        : /^https?:\/\//.test(PATH)
          ? (res = (await axios.get(PATH, { responseType: "arraybuffer" })))
          : fs.existsSync(PATH)
            ? ((filename = PATH), fs.readFileSync(PATH))
            : typeof PATH === "string"
              ? PATH
              : Buffer.alloc(0);
    if (!Buffer.isBuffer(data.data || data)) throw new TypeError("Result is not a buffer");
    const type = res ? {
      mime: res.headers["content-type"], 
      ext: mime.extension(res.headers["content-type"]),
    } : (await FileType.fromBuffer(data)) || {
    mime: "application/bin",
    ext: ".bin"
    }

    return {
      filename,
      ...type,
      data: data.data ? data.data : data,
      deleteFile() {
        return filename && fs.promises.unlink(filename);
      },
    };
 }
   
  sock.sendContact = async (jid, data, quoted, options) => {
    if (!Array.isArray(data[0]) && typeof data[0] === "string") data = [data];
    let contacts = [];
    for (let [number, name] of data) {
      number = number.replace(/[^0-9]/g, "");
      let njid = number + "@s.whatsapp.net";
      let biz = (await sock.getBusinessProfile(njid).catch((_) => null)) || {};
      let vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, "\\n")}
ORG:
item1.TEL;waid=${number}:${PhoneNumber("+" + number).getNumber("international")}
item1.X-ABLabel:Ponsel${
        biz.description
          ? `
item2.EMAIL;type=INTERNET:${(biz.email || "").replace(/\n/g, "\\n")}
item2.X-ABLabel:Email
PHOTO;BASE64:${((await sock.getFile(await sock.profilePictureUrl(njid)).catch((_) => ({}))) || {}).number?.toString("base64")}
X-WA-BIZ-DESCRIPTION:${(biz.description || "").replace(/\n/g, "\\n")}
X-WA-BIZ-NAME:${name.replace(/\n/g, "\\n")}
`
          : ""
      }
END:VCARD
`.trim();
      contacts.push({
        vcard,
        displayName: name,
      });
    }
    return sock.sendMessage(
      jid,
      {
        ...options,
        contacts: {
          ...options,
          displayName:
            (contacts.length >= 2
              ? `${contacts.length} kontak`
              : contacts[0].displayName) || null,
          contacts,
        },
      },
      {
        quoted: quoted,   
        ...options,
        ...ephemeral,
      },
    );
    enumerable: true;
  }
sock.sendFile = async (jid, media, filename = null, caption = null, quoted = null, options = {}) => {
  let buffer;
  let mimeType;
  let ext;
  let data = await sock.getFile(media);
    buffer = data.data; 
    mimeType = data.mime || 'application/octet-stream'; 
    ext = data.ext || ".tmp"
let isSticker = false
    if (data.ext === "webp") return isSticker = true
 if (options && options.useDocument) {
    return sock.sendMessage(jid, {
      document: buffer,
      fileName: filename || "file." + ext,
      caption: caption,
      mimetype: mimeType,
      ...options
    }, {
      quoted: quoted,
      ...global.ephemeral
    });
  } else if (/image/.test(mimeType) && !isSticker) {
    return sock.sendMessage(jid, {
      image: buffer,
      mimetype: mimeType,
      caption: caption,
      ...options
    }, {
      quoted: quoted, 
      ...global.ephemeral
    });
  } else if (/video/.test(mimeType)) {
    return sock.sendMessage(jid, {
      video: buffer,
      mimetype: mimeType,
      caption: caption,
      ...options
    }, {
      quoted: quoted, 
      ...global.ephemeral
    });
  } else if (/audio/.test(mimeType)) {
    return sock.sendMessage(jid, {
      audio: buffer,
      ...options
    }, {
      quoted: quoted, 
      ...global.ephemeral
    });
  } else {
    return sock.sendMessage(jid, {
      document: buffer,
      fileName: filename || "file." + ext,
      mimetype: mimeType,
      caption: caption,
      ...options
    }, {
      quoted: quoted, 
      ...global.ephemeral
     });
    }
  }
  sock.resize = async (image, width, height) => {
    let oyy = await Jimp.read(image);
    let kiyomasa = await oyy
      .resize(width, height)
      .getBufferAsync(Jimp.MIME_JPEG);
    return kiyomasa;
  }
  sock.cMod = (
    jid,
    message,
    text = "",
    sender = sock.user.jid,
    options = {},
  ) => {
    let copy = message
    delete copy.message.messageContextInfo;
    delete copy.message.senderKeyDistributionMessage;
    let mtype = Object.keys(copy.message)?.[0];
    let isEphemeral = false;
    if (isEphemeral) {
      mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
    }
    let msg = isEphemeral
      ? copy.message.ephemeralMessage.message
      : copy.message;
    let content = msg[mtype];
    if (typeof content === "string") msg[mtype] = text || content;
    else if (content.caption) content.caption = text || content.caption;
    else if (content.text) content.text = text || content.text;
    if (typeof content !== "string") msg[mtype] = { ...content, ...options };
    if (copy.participant)
      sender = copy.participant = sender || copy.participant;
    else if (copy.key.participant)
      sender = copy.key.participant = sender || copy.key.participant;
    if (copy.key.remoteJid.includes("@s.whatsapp.net"))
      sender = sender || copy.key.remoteJid;
    else if (copy.key.remoteJid.includes("@broadcast"))
      sender = sender || copy.key.remoteJid;
    copy.key.remoteJid = jid;
    copy.key.fromMe = config.areJidsSameUser(sender, sock.user.id) || false;
    return config.proto.WebMessageInfo.fromObject(copy);
  }
  sock.copyNForward = async (
    jid,
    message,
    forwardingScore = true,
    quoted,
    options = {},
  ) => {
    let m = config.generateForwardMessageContent(message, !!forwardingScore);
    let mtype = Object.keys(m)[0];
    if (
      forwardingScore &&
      typeof forwardingScore == "number" &&
      forwardingScore > 1
    )
      m[mtype].contextInfo.forwardingScore += forwardingScore;
    m = config.generateWAMessageFromContent(jid, m, {
      ...options,
      userJid: sock.user.id,
      quoted,
    });
    await sock.relayMessage(jid, m.message, {
      messageId: m.key.id,
      additionalAttributes: { ...options },
    });
    return m;
  };
  
 sock.downloadM = async (m, type, saveToFile) => {
    if (!m || !(m.url || m.directPath)) return Buffer.alloc(0);
    const stream = await config.downloadContentFromMessage(m, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    if (saveToFile) var { filename } = await sock.getFile(buffer, true);
    return saveToFile && fs.existsSync(filename) ? filename : buffer;
  };
  
  sock.parseMention = (text = "") => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net",
    );
  }
  
  sock.setBio = async (status) => {
    return await sock.query({
      tag: "iq",
      attrs: {
        to: "s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
    // <iq to="s.whatsapp.net" type="set" xmlns="status" id="21168.6213-69"><status>"Hai, saya menggunakan WhatsApp"</status></iq>
  };
  
  sock.serializeM = (m) => {
    return require("./serialize")(m, sock, store);
  };
  
  Object.defineProperty(sock, "name", {
    value: "WASocket",
    configurable: true,
  });
  
  return sock;
 }   
      
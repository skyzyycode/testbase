(async() => {
const {
    default: makeWASocket,
    useMultiFileAuthState,
    jidNormalizedUser,
    fetchLatestBaileysVersion,
    Browsers,
<<<<<<< HEAD
    makeInMemoryStore,
    DisconnectReason,
    getAggregateVotesInPollMessage
=======
    proto,
    makeInMemoryStore,
    DisconnectReason,
    delay,
    generateWAMessage,
    getAggregateVotesInPollMessage,
   areJidsSameUser
>>>>>>> 8de5675 (v1.1.0)
} = require("baileys");
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const chalk = require('chalk');
const readline = require("node:readline");
const serialize = require("./lib/serialize.js");
const simple = require('./lib/simple.js')
const fs = require("node:fs");
<<<<<<< HEAD
const Database = require("./lib/database.js");
const config = require("./settings.js");
=======
const Queque = require("./lib/queque.js");
const messageQueue = new Queque();
const Database = require("./lib/database.js");
const config = require("./settings.js");
const append = require("./lib/append");

>>>>>>> 8de5675 (v1.1.0)
const Func = require("./lib/function.js");
const data = fs.readFileSync(process.cwd()+'/system/case.js', 'utf8');
const casePattern = /case\s+"([^"]+)"/g;
const matches = data.match(casePattern).map(match => match.replace(/case\s+"([^"]+)"/, '$1'));
<<<<<<< HEAD
    
=======

const appenTextMessage = async (m, sock, text, chatUpdate) => {
    let messages = await generateWAMessage(
      m.key.remoteJid,
      {
        text: text,
        mentions: m.mentionedJid
      },
      {
        quoted: m.quoted,
      },
    );
    messages.key.fromMe = areJidsSameUser(m.sender, sock.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    return sock.ev.emit("messages.upsert", msg);
}
     
>>>>>>> 8de5675 (v1.1.0)
const question = (text) => {
     const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
       return new Promise((resolve) => {
       rl.question(text, resolve)
  })
};

//========[ Loader Execute ]=========
global.db = new Database(config.database + ".json")
await db.init(); 

global.pg = new (await require(process.cwd()+"/lib/plugins"))(process.cwd()+"/system/plugins");
    await pg.watch();
    
global.scraper = new (await
require(process.cwd()+"/scrapers"))(process.cwd()+"/scrapers/src");
    await scraper.watch();
     
setInterval(async () => {
    await db.save(); 
    await pg.load();
    await scraper.load();
}, 2000);
    
const store = makeInMemoryStore({ 
     logger: pino().child({ 
        level: 'silent',
        stream: 'store' 
     })
  })
 
  console.log(chalk.blue.bold("- Hi Welcome to NekoBot !"))
  console.log(chalk.white.bold("| Terimakasih telah menggunakan Script ini !"))
  console.log(chalk.white.bold("| Github saya [Follow] : " + chalk.cyan.bold("https://github.com/Axel")))
  console.log(chalk.white.bold("––––––––––––––––––––"))
  
async function system() {
  const { 
     state,
     saveCreds 
     } = await useMultiFileAuthState(config.sessions);
  const sock = simple({
    logger: pino({ level: "silent" }),
       printQRInTerminal: false,
        auth: state,
         version: [2, 3000, 1017531287],
           browser: Browsers.ubuntu("Edge"),
            getMessage: async key => {
            const jid = jidNormalizedUser(key.remoteJid);
            const msg = await store.loadMessage(jid, key.id);
            return msg?.message || '';
           },
        shouldSyncHistoryMessage: msg => {
            console.log(`\x1b[32mMemuat Chat [${msg.progress}%]\x1b[39m`);
            return !!msg.syncType;
        },
      }, store);
  store.bind(sock.ev);
if (!sock.authState.creds.registered) {
     console.log(chalk.white.bold("- Silahkan masukan nomor WhatsApp anda, contoh +628xxxx"));
   	const phoneNumber = await question(chalk.green.bold(`– Nomor anda : `));
	      	const code = await sock.requestPairingCode(phoneNumber);
	setTimeout(() => {
    console.log(chalk.white.bold("- Kode Paring anda : " +code))
	}, 3000);
}
//=====[ Connect to WhatsApp ]=======//
sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        console.log(chalk.green.bold(lastDisconnect.error));
        if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
            process.exit(0);
        } else if (reason === DisconnectReason.badSession) {
            console.log(chalk.red.bold(`Bad Session File, Please Delete Session and Scan Again`));
            process.exit(0);
        } else if (reason === DisconnectReason.connectionClosed) {
            console.log(chalk.yellow.bold('Connection closed, reconnecting. . .'));
            process.exit(0);
        } else if (reason === DisconnectReason.connectionLost) {
            console.log(chalk.yellow.bold('Connection lost, trying to reconnect'));
            process.exit(0);
        } else if (reason === DisconnectReason.connectionReplaced) {
            console.log(chalk.green.bold('Connection Replaced, Another New Session Opened, Please Close Current Session First'));
          sock.logout();
        } else if (reason === DisconnectReason.loggedOut) {
            console.log(chalk.green.bold(`Device Logged Out, Please Scan Again And Run.`));
           sock.logout();
        } else if (reason === DisconnectReason.restartRequired) {
            console.log(chalk.green.bold('Restart Required, Restarting. . .'));
           system();
        } else if (reason === DisconnectReason.timedOut) {
            console.log(chalk.green.bold('Connection TimedOut, Reconnecting. . .'));
           system();
        }
    } else if (connection === "connecting") {
        console.log(chalk.green.bold('Connecting, Please Be Patient. . .'));
    } else if (connection === "open") {
       console.log(chalk.green.bold('Bot Successfully Connected. . . .'));
    }
});
 sock.ev.on('creds.update', saveCreds);

//=====[ After Connect to WhatsApp ]========//
  sock.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = jidNormalizedUser(contact.id);
            if (store && store.contacts) store.contacts[id] = { ...(store.contacts?.[id] || {}), ...(contact || {}) };
        }
    });
    sock.ev.on('contacts.upsert', update => {
        for (let contact of update) {
            let id = jidNormalizedUser(contact.id);
            if (store && store.contacts) store.contacts[id] = { ...(contact || {}), isContact: true };
        }
    });
    sock.ev.on('groups.update', updates => {
        for (const update of updates) {
            const id = update.id;
            if (store.groupMetadata[id]) {
                store.groupMetadata[id] = { ...(store.groupMetadata[id] || {}), ...(update || {}) };
            }
        }
    });
    sock.ev.on('group-participants.update', ({ id, participants, action }) => {
        const metadata = store.groupMetadata[id];
        if (metadata) {
            switch (action) {
                case 'add':
                case 'revoked_membership_requests':
                    metadata.participants.push(...participants.map(id => ({ id: jidNormalizedUser(id), admin: null })));
                    break;
                case 'demote':
                case 'promote':
                    for (const participant of metadata.participants) {
                        let id = jidNormalizedUser(participant.id);
                        if (participants.includes(id)) {
                            participant.admin = action === 'promote' ? 'admin' : null;
                        }
                    }
                    break;
                case 'remove':
                    metadata.participants = metadata.participants.filter(p => !participants.includes(jidNormalizedUser(p.id)));
                    break;
            }
        }
    });
  async function getMessage(key){
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg?.message
        }
        return {
            conversation: "NekoBot"
        }
    }
<<<<<<< HEAD
  sock.ev.on('messages.update', async chatUpdate => {
        for(const { key, update } of chatUpdate) {
			if(update.pollUpdates && key.fromMe) {
				const pollCreation = await getMessage(key)
				if(pollCreation) {
=======
sock.ev.on("messages.upsert", async (cht) => {
    if (cht.messages.length === 0) return;
    const chatUpdate = cht.messages[0];
    if (!chatUpdate.message) return;
     messageQueue.add(chatUpdate);
     if (!messageQueue.isFirst(chatUpdate)) return messageQueue.waitQueue(chatUpdate);
      
    while (!messageQueue.isEmpty()) {
        const message = messageQueue.first();
        try {
            message.message = Object.keys(message.message)[0] === 'ephemeralMessage'
                ? message.message.ephemeralMessage.message
                : message.message;
            global.m = await serialize(message, sock, store);

            if (m.key.jid === "status@broadcast") {
                await sock.readMessage([m.key]);
                await sock.sendMessage(m.key.jid, {
                    react: { text: "📸", key: m.key },
                }, {
                    statusJidList: Object.keys(store.contact),
                });
                console.log(chalk.green.bold("– Membaca Status WhatsApp dari : " + m.pushName));
            }
            
            await db.main(m);
            if (m.isBot) return;
            if (db.list().settings.self && !m.isOwner) return;
            if (m.isGroup && db.list().group[m.cht]?.mute && !m.isOwner) return;
            if (Object.keys(store.groupMetadata).length === 0) {
                store.groupMetadata = await sock.groupFetchAllParticipating();
            }
            for (let name in pg.plugins) {
                let plugin = {};
                if (typeof pg.plugins[name].run === "function") {
                    plugin = pg.plugins[name];
                }
                if (!plugin) return;
                if (!plugin.command && typeof plugin.run === "function") {
                await plugin.run(m, { 
                          sock, 
                          Func,
                          config
                       });
                }
                let Scraper = await scraper.list();
                let cmd = m.command.toLowerCase() === plugin.command
                    ? m.command.toLowerCase()
                    : plugin.alias.includes(m.command.toLowerCase());
                let text = '';
                if (cmd) {
                    text = m.isQuoted ? (m.quoted ? m.quoted.text : m.text) : m.text;
                }
                try {
                    if (cmd) {
                        if (plugin.settings?.owner && !m.isOwner) {
                            m.reply(config.messages.owner);
                            continue;
                        } else if (plugin.settings?.group && !m.isGroup) {
                            m.reply(config.messages.group);
                            continue;
                        }
                        if (plugin.loading) m.react("🕐");
                        await plugin.run(m, {
                            sock,
                            config,
                            text,
                            plugins: Object.values(pg.plugins).filter(a => a.alias),
                            Func,
                            Scraper,
                        });
                    }
                } catch (e) {
                    if (e.name) {
                        m.reply(Func.jsonFormat(e));
                    } else {
                        m.reply(e);
                    }
                }
            }
            require("./lib/logger.js")(m);
            await require("./system/case.js")(m, sock, store);
        } catch (error) {
            console.error(error);
        } finally {
            messageQueue.unqueue(); 
        }
    }
});
      
sock.ev.on('messages.update', async(chatUpdate) => {
        for (const { key, update } of chatUpdate) {
           console.log(key)
			if (update.pollUpdates && key.fromMe) {
				const pollCreation = await getMessage(key)
				const loadMsg = await store.loadMessage(m.key.remoteJid, m.key.id)
				if (pollCreation) {
>>>>>>> 8de5675 (v1.1.0)
				    const pollUpdate = await getAggregateVotesInPollMessage({
							message: pollCreation,
							pollUpdates: update.pollUpdates,
						})
<<<<<<< HEAD
	                var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
	                 console.log(toCmd);
				}
			}
		}
    });
 sock.ev.on("messages.upsert", async(cht) => {
    if (cht.messages.length === 0) return;
     const chatUpdate = cht.messages[0];
     if (!chatUpdate.message) return;
   chatUpdate.message = (Object.keys(chatUpdate.message)[0] === 'ephemeralMessage') ? chatUpdate.message.ephemeralMessage.message : chatUpdate.message;
     let m = await serialize(chatUpdate, sock, store);
       if (m.key.jid === "status@broadcast") {
         await sock.readMessage([m.key])
         await sock.sendMessage(m.key.jid, {
             react: {
               text: "📸",
               key: m.key          
             }
          }, {
         statusJidList: Object.keys(store.contact)
        });
         console.log(chalk.grenn.bold("– Membaca Status WhatsApp dari : " + m.pushName))
       }
     await db.main(m);     
     if (m.isBot) return;
     if (db.list().settings.self && !m.isOwner) return 
     if (m.isGroup && db.list().group[m.cht].mute && !m.isOwner) return
     if (m.isBot) return;
     if (Object.keys(store.groupMetadata).length === 0) store.groupMetadata = await sock.groupFetchAllParticipating();
  for (let name in pg.plugins) {
     let plugin = {}
       if (typeof pg.plugins[name].run === "function") {
          plugin = pg.plugins[name]
        }
      if (!plugin) return 
      if (!plugin.command && typeof plugin.run === "function") {
        await plugin.run(m, {
           sock,
           Func,
           config 
         })
      }
     let Scraper = await scraper.list()     
     let cmd = m.command.toLowerCase() === plugin.command ?
         m.command.toLowerCase() :
         plugin.alias.includes(m.command.toLowerCase());
      let text = ''
          if (cmd) {
	      if (m.quoted) {
	        text = m.isQuoted ? m.quoted.text : m.text
          } else {
	        text = m.isQuoted ? m.quoted.body : m.text
          }
        }
     try {
      if (cmd) {
        if (plugin.settings && plugin.settings.owner && !m.isOwner) {
           m.reply(config.messages.owner);
           continue
          } else if (plugin.settings && plugin.settings.group && !m.isGroup) {
            m.reply(config.messages.group);
           continue
       }
     if (plugin.loading) m.react("🕐");  
       await plugin.run(m, {
          sock,
          config,
          text,
          plugins: Object.values(pg.plugins).filter(a => a.alias),
          Func,
          Scraper
        })   
       }    
      } catch(e) {
      if (e.name) {
           m.reply(Func.jsonFormat(e));
            } else {
	          m.reply(e)
           }
        }
      }
       require("./lib/logger.js")(m);
       await require("./system/case.js")(m, sock, store);
     });
=======
	             var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
                 let msg = append.smsg(loadMsg, sock, store);
                let hasil = append.serialize(msg, sock, store);
	          await appenTextMessage(hasil, sock, toCmd, chatUpdate);
	          await delay(1000);
	          return sock.sendMessage(hasil.chat, { delete: key });
	            	}
	         	} else return false
	          return 
   	    	}
        });
>>>>>>> 8de5675 (v1.1.0)
     return sock
  }
system()
})()
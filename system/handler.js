const config = require("../settings.js");
const Func = require("../lib/function.js");
const serialize = require("../lib/serialize.js");
const Uploader = require("../lib/uploader.js");
const pkg = require("baileys");

module.exports = async (m, sock, store) => {
  try {
    require("../lib/logger.js")(m);
    if (m.key.jid === "status@broadcast") {
      await sock.readMessages([m.key]);
      await sock.sendMessage(
        m.key.jid,
        {
          react: { text: "📸", key: m.key },
        },
        {
          statusJidList: Object.keys(store.contact),
        },
      );
      console.log(
        chalk.green.bold("– Membaca Status WhatsApp dari : " + m.pushName),
      );
    }

    await db.main(m);
    if (m.isBot) return;
    if (db.list().settings.self && !m.isOwner) return;
    if (m.isGroup && db.list().group[m.cht]?.mute && !m.isOwner) return;
    if (Object.keys(store.groupMetadata).length === 0) {
      store.groupMetadata = await sock.groupFetchAllParticipating();
    }
    const admin = m.isGroup
      ? m.metadata.participants.filter((a) => a.admin && a.admin !== null)
      : false;
    const isAdmin = m.isGroup
      ? admin.find((a) => a.id === m.sender) || false
      : false;
    const botAdmin = m.isGroup
      ? admin.find((a) => a.id === sock.decodeJid(sock.user.id))
      : false;
    for (let name in pg.plugins) {
      let plugin = {};
      if (typeof pg.plugins[name].run === "function") {
        plugin = pg.plugins[name];
      }
      if (!plugin) return;
      if (typeof plugin.events === "function") {
        await plugin.run(m, {
          sock,
          Func,
          config,
          Uploader,
          isAdmin,
          botAdmin,
          store,
        });
      }
      let Scraper = await scraper.list();
      let cmd = m.command.toLowerCase() === plugin.command || plugin?.alias?.includes(m.command.toLowerCase());
      let text = "";
      if (cmd) {
        text = m.text;
      }
      try {
        if (cmd) {
          if (plugin.settings?.owner && !m.isOwner) {
            m.reply(config.messages.owner);
            continue;
          } else if (plugin.settings?.group && !m.isGroup) {
            m.reply(config.messages.group);
            continue;
          } else if (plugin.settings?.admin && !isAdmin) {
            m.reply(config.messages.admin);
            continue;
          } else if (plugin.settings?.botAdmin && !botAdmin) {
            m.reply(config.messages.botAdmin);
            continue;
          }
          await plugin.run(m, {
            sock,
            config,
            text,
            plugins: Object.values(pg.plugins).filter((a) => a.alias),
            Func,
            Scraper,
            Uploader,
            isAdmin,
            botAdmin,
            store,
          });
          if (plugin.loading) m.react("🕐");
        }
      } catch (e) {
        if (e.name) {
          m.reply(Func.jsonFormat(e));
        } else {
          m.reply(e);
        }
      }
    } 
   async function getMessage(key) {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg
        }
        return {
            conversation: "NekoBot"
        }
    }
   sock.ev.on('messages.update', 
    async(chatUpdate) => {
        for (const { key, update } of chatUpdate) {
			if (update.pollUpdates && key.fromMe) {
				const pollCreation = await getMessage(key);		    	if (pollCreation) {
				    const pollUpdate = await pkg.getAggregateVotesInPollMessage({
							message: pollCreation?.message,
							pollUpdates: update.pollUpdates,
						})
	             var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
              await serialize(pollCreation, sock, store).then(async(a) => {
              console.log(toCmd);
	          await a.emit(toCmd);
	          return sock.sendMessage(a.cht, { delete: a.key });
	                 });
	            	}
	         	} else return false
	          return 
   	    	}
        });
  } catch (error) {
    console.error(error);
  }
};

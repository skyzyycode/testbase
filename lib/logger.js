const color = require('chalk');

module.exports = (m) => {
      let info = ""
         info += color.blue.bold("- - - - - [ Chat Information ] -  - - - -\n")
        info += color.white.bold(` - Dari : ${color.green.bold(m.isGroup ? "Group Chat" : "Private Chat")}\n`)
        if (m.isGroup) {
        info += color.white.bold(` - Subject : ${color.green.bold(m.metadata.subject)}\n`)
        info += color.white.bold(` - Tipe : ${color.green.bold(m.type)}\n`)
        info += color.white.bold(` - Nama : ${color.green.bold(m.pushName)}\n`)
       } else {
        info += color.white.bold(` - Tipe : ${color.green.bold(m.type)}\n`)
        info += color.white.bold(` - Nama : ${color.green.bold(m.pushName)}\n`)     
       }
       info += color.blue.bold("- - - - - - - - - - - -- - - -\n");
       info += m.body.startsWith(m.body) ? color.yellow.bold(m.body) : color.white.bold(m.body)
       
       console.log(info)     
}
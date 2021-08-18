const { MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports.run = async(client, msg, args) => {
  let cmd = args[0];
  const commands = [];
  
  fs.readdirSync("./commands/").forEach(x => {
    const command = require(`../commands/${x}`);
    commands.push(command.help);
  });
  
    let embed = new MessageEmbed()
    .setColor("#7289DA")
    .setAuthor(`${client.user.username} command list`)
    .setTimestamp()
    .setFooter(`Type ${client.config.prefix}help [command] for more info about command`)
    .setThumbnail(client.user.displayAvatarURL({size: 2048}));
    
  if(!cmd) {
    embed.setDescription(commands.map(x => `\`${x.name}\``).join(", "));
    return msg.channel.send(embed);
  } else {
    let cmdInfo = commands.filter(x => x.name == cmd.toLowerCase());
    console.log(cmdInfo)
    if(cmdInfo.length < 1) {
      return msg.channel.send(new MessageEmbed().setColor("#7289DA").setDescription("Command not found"));
    } else {
      embed.addField("**Name**", cmdInfo[0].name).addField("**Description**", cmdInfo[0].description).addField("**Usage**", `${client.config.prefix}${cmdInfo[0].usage}`);
      return msg.channel.send(embed);
    }
    
  }
};

module.exports.help = {
  name: "help",
  description: "List command from this bot",
  usage: "help [cmd]"
};

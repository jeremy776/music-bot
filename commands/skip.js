const { MessageEmbed } = require("discord.js");

module.exports.run = async(client, msg, args) => {
  if(!msg.member.voice.channel) return msg.channel.send(new MessageEmbed().setDescription("You must be in voice channel").setColor("#7289DA").setTimestamp());
  
  const queue = client.queue.get(msg.guild.id);
  if(!queue) {
    let embed = new MessageEmbed()
    .setDescription("No songs are playing in queue")
    .setColor("#7289D")
    .setTimestamp();
    return msg.channel.send(embed);
  }
  if(client.voice.connections.get(msg.guild.id).channel.id !== msg.member.voice.channel.id) return msg.channel.send(new MessageEmbed().setDescription("You must join the same voice channel").setColor("#7289DA").setTimestamp());
  
  queue.connection.dispatcher.end();
  
};

module.exports.help = {
  name: "skip",
  description: "skip music",
  usage: "skip"
};

const Discord = require('discord.js');
const client = new Discord.Client();
require("dotenv").config();

const config = require('./config.json');
const fs = require('fs');
client.queue = new Map();
client.config = config;

client.on('ready', () => {
  console.log(client.user.tag + ' online');
});

client.on('message', async message => {
  if(!message.content.startsWith(config.prefix)) return;
  
  let args = message.content.slice(config.prefix.length).split(" ");
  let cmd = args.shift().toLowerCase();
  
  try{
    let command = require(`./commands/${cmd}`);
    console.log(client.queue.get(message.guild.id))
    command.run(client, message, args);
  }catch(e){
    console.log(e.message);
  };
});


client.login(process.env.token);

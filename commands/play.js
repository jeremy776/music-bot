const { MessageEmbed } = require('discord.js');
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports.run = async(client, msg, args) => { 
  
  const vc = msg.member.voice.channel;
  if(!vc) return msg.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: You need to join a voice channel!"));
  
  let music = args.slice(0).join(" ");
  let queue = client.queue.get(msg.guild.id);
  if(args.length == 0) return msg.channel.send(new MessageEmbed().setColor("RED").setDescription(`Please type ${client.config.prefix}play {song name}`));
  let song = {};
  
  if(ytdl.validateURL(args[0])) {
    const info = await ytdl.getInfo(music);
    console.log(info.videoDetails)
    song = {
      title: info.videoDetails.title,
      url: info.videoDetails.video_url,
      thumbnail: info.videoDetails.thumbnails[0].url
    };
  } else {
    const video = await Find(music);
    console.log(video)
    if(video) {
      song = {
        title: video.title,
        url: video.url,
        timestamp: video.timestamp,
        thumbnail: video.thumbnail
      };
    } else {
      return msg.channel.send(new MessageEmbed().setDescription("Error. Song not found").setColor("RED"));
    }
  }
  if(!queue) {
    const newQueue = {
      voiceChannel: vc,
      textChannel: msg.channel,
      connection: null,
      isPause: false,
      volume: 3,
      songList: []
    };
    client.queue.set(msg.guild.id, newQueue);
    newQueue.songList.push(song);
    
    try {
      const connectToVoice = await vc.join();
      newQueue.connection = connectToVoice;
      Play(msg.guild, newQueue.songList[0], client);
    } catch(e) {
      client.queue.delete(msg.guild.id);
      return msg.channel.send(new MessageEmbed().setDescription("Something error with video player").setColor("RED"));
    }
  }
  if(queue) {
    if(queue.songList.length > 0) {
      let antrian = client.queue.get(msg.guild.id);
      try {
        antrian.songList.push(song);
        return msg.channel.send(new MessageEmbed().setTitle(`${song.title} add to queue`).setImage(song.thumbnail).setColor("#7289DA"));
      } catch(e) {
        client.queue.delete(msg.guild.id);
        return msg.channel.send(new MessageEmbed().setDescription("Something error with video player").setColor("RED"));
      }
    }
  }
};

async function Play(guild, song, client) {
  const queue = client.queue.get(guild.id);
  
  if(!song) {
    await queue.voiceChannel.leave();
    client.queue.delete(guild.id);
    return queue.textChannel.send(new MessageEmbed().setColor("#7289DA").setTimestamp().setDescription("Leave channel. Music end").setTimestamp());
  }
  const Stream = ytdl(song.url, { filter: "audioonly" });
  queue.connection.play(Stream, { seek: 0, volume: queue.volume }).on("finish", () => {
    queue.songList.shift();
    Play(guild, queue.songList[0], client);
  });
  queue.textChannel.send(new MessageEmbed().setColor("#7289DA").setImage(song.thumbnail).setTitle(`Playing ${song.title}`).setTimestamp());
}

async function Find(text) {
  const result = await ytSearch(text);
  return (result.videos.length > 1) ? result.videos[0] : null;
}

module.exports.help = {
  name: "play",
  description: "Playing music",
  usage: "play [url | music name]"
};

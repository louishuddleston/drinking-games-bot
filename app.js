require('dotenv').config();
const Discord = require('discord.js');
const rof = require('./games/ringOfFire/ringOfFire');
const mlt = require('./games/mostLikelyTo/mostLikelyTo');
const adminCommands = require('./adminCommands');
const analytics = require('./analytics');
const db = require('./db');

const client = new Discord.Client();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  msg.content = msg.content.toLowerCase();

  if (msg.content.includes('!start')) {
    const game = await db.getGame(msg.channel.id);
    msg.content = msg.content.split(' ');

    checkPermissions(msg);

    if (game != null) msg.channel.send('There is already an active game in this channel. Type **!stop** to start again.');
    else if (msg.content[1] == 'rof') {
      analytics.addEvent('start rof', msg);
      rof.start(msg);
    } else if (msg.content[1] == 'mlt') {
      analytics.addEvent('start mlt', msg);
      mlt.start(msg);
    } else if (typeof msg.content[1] == 'undefined') msg.channel.send('Please include the game mode you want to start for example: ``!start rof`` to start a game of Ring Of Fire');
  }

  if (msg.content == '!pick') {
    analytics.addEvent('pick', msg);
    checkPermissions(msg);
    rof.pick(msg);
  }

  if (msg.content == '!stop') {
    analytics.addEvent('stop', msg);
    checkPermissions(msg);
    rof.stop(msg);
  }

  if (msg.content == '!credits') {
    checkPermissions(msg);
    rof.credits(msg);
  }

  if (msg.content == '!cardcount') {
    analytics.addEvent('cardcount', msg);
    checkPermissions(msg);
    rof.cardCount(msg);
  }

  if (msg.content == '!activegames') {
    checkPermissions(msg);
    auth(msg, client, rof.activeGames);
  }

  if (msg.content == '!listrules') {
    analytics.addEvent('listrules', msg);
    checkPermissions(msg);
    rof.listRules(msg);
  }

  if (msg.content == '!help') {
    analytics.addEvent('help', msg);
    checkPermissions(msg);
    rof.listCommands(msg);
  }

  if (typeof msg.mentions.users.first() != 'undefined') {
    console.log(msg.mentions.users.first());
    const game = await db.getGame(msg.channel.id);
    if (game != null && game.type == 'mlt') {
      analytics.addEvent('mlt addvote', msg);
      mlt.addVote(msg, game);
    }
  }

  if (msg.content == '!servers') auth(msg, client, adminCommands.listServers);
});

client.on('guildCreate', (guild) => {
  const systemChannelID = guild.channels.guild.systemChannelID;
  const channel = guild.channels.cache.get(systemChannelID);

  const embed = new Discord.MessageEmbed()
      .setColor('#eb4034')
      .setTitle('Thanks for adding Drinking Games Bot to your server!')
      .setDescription('Type ``!help`` to see all commands.\n\nJoin our server for support or just to chat: https://discord.gg/Vpp3Z6b\n\nFollow us on Twitter: https://twitter.com/DrinkinGamesBot');

  channel.send(embed);
});

const auth = (msg, client, next) => {
  const admins = process.env.ADMINS.split(',');
  const user = `${msg.author.username}#${msg.author.discriminator}`;

  if (admins.includes(user)) next(msg, client);
  else return;
};

const checkPermissions = (msg) => {
  if (msg.channel.guild && msg.channel.guild.members.cache.get(client.user.id).hasPermission(['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']) == false) {
    msg.channel.send('Please make sure the bot has permission to:\nSend Messages\nEmbed Links\nAttach Files');
    msg.channel.send('Go to: https://discord.gg/Vpp3Z6b for further support');
  }
};

client.login(process.env.DISCORD_TOKEN);

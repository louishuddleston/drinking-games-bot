require('dotenv').config();
const Discord = require('discord.js');
const rof = require('./games/ringOfFire/ringOfFire');
const mlt = require('./games/mostLikelyTo/mostLikelyTo');
const adminCommands = require('./adminCommands');
const analytics = require('./analytics');
const db = require('./db');
const { getPrefix, setPrefix } = require('./prefix')

const client = new Discord.Client();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  const prefix = await getPrefix(msg.guild ? msg.guild.id : msg.channel.id);
  msg.content = msg.content.toLowerCase();

  if (msg.content.includes(`${prefix}start`)) {
    const game = await db.getGame(msg.channel.id);
    msg.content = msg.content.split(' ');

    checkPermissions(msg);

    if (game != null) msg.channel.send(`There is already an active game in this channel. Type **${prefix}stop** to start again.`);
    else if (msg.content[1] == 'rof') {
      analytics.addEvent('start rof', msg);
      rof.start(msg, prefix);
    } else if (msg.content[1] == 'mlt') {
      analytics.addEvent('start mlt', msg);
      mlt.start(msg);
    } else if (typeof msg.content[1] == 'undefined') msg.channel.send(`Please include the game mode you want to start for example: \`\`${prefix}start rof\`\` to start a game of Ring Of Fire`);
  }

  if (msg.content == `${prefix}pick`) {
    analytics.addEvent('pick', msg);
    checkPermissions(msg);
    rof.pick(msg, prefix);
  }

  if (msg.content == `${prefix}stop`) {
    analytics.addEvent('stop', msg);
    checkPermissions(msg);
    rof.stop(msg);
  }

  if (msg.content == `${prefix}credits`) {
    checkPermissions(msg);
    rof.credits(msg);
  }

  if (msg.content == `${prefix}cardcount`) {
    analytics.addEvent('cardcount', msg);
    checkPermissions(msg);
    rof.cardCount(msg);
  }

  if (msg.content == `${prefix}activegames`) {
    checkPermissions(msg);
    auth(msg, client, rof.activeGames);
  }

  if (msg.content == `${prefix}listrules`) {
    analytics.addEvent('listrules', msg);
    checkPermissions(msg);
    rof.listRules(msg);
  }

  if (msg.content == `${prefix}help`) {
    analytics.addEvent('help', msg);
    checkPermissions(msg);
    rof.listCommands(msg, prefix);
  }

  if (typeof msg.mentions.users.first() != 'undefined') {
    console.log(msg.mentions.users.first());
    const game = await db.getGame(msg.channel.id);
    if (game != null && game.type == 'mlt') {
      analytics.addEvent('mlt addvote', msg);
      mlt.addVote(msg, game);
    }
  }

  if (msg.content == `${prefix}servers`) auth(msg, client, adminCommands.listServers);

  if (msg.content.includes(`${prefix}setprefix`)) {
    const content = msg.content.split(' ')
    const newPrefix = content[1]
    const id = msg.guild ? msg.guild.id : msg.channel.id;

    if (newPrefix.length <= 10) {
      const set = await setPrefix(newPrefix, id)
        .catch(err => { 
          msg.channel.send('Error setting prefix')
          return false
        })
      if (set) msg.channel.send(`Prefix has been set to: ${newPrefix}`)
    }
    else {
      msg.channel.send('Prefix must be 10 characters or less')
    }
  }
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

const { MessageAttachment, MessageEmbed } = require('discord.js');
const { availableCards, getCards, rules } = require('./cards');
const db = require('../../db');
const errorHandler = require('../../errorHandler');

const commandList = '**Ring of Fire:**\n``!start rof`` Start a new game.\n``!listrules`` List of rules.\n``!pick`` Pick a card.\n``!stop`` Stop the current game.\n``!cardcount`` Shows the amount of cards left in the current game.\n\n**Who\'s most likely to:**\nTag the person most likely to do what the question says, whoever gets the most votes must drink!\n``!start mlt [amount of questions] [seconds to answer]`` Start a new game.\n``!stop`` Stop the current game.';

exports.start = async (msg) => {
  const id = msg.channel.id;

  const cards = getCards(availableCards);
  const game = {
    type: 'rof',
    cards,
    kings: 4,
  };
  if (msg.channel.guild) {
    game.guild = {
      id: msg.channel.guild.id,
      name: msg.channel.guild.name,
      region: msg.channel.guild.region,
    };
  }

  const r = await db.setGame(id, game)
      .catch((err) => errorHandler(err, msg));

  if (r) msg.channel.send('Ring of Fire has started.\nType **!pick** to pick a card or **!help** to get the full list of commands.');
};

exports.pick = async (msg) => {
  const id = msg.channel.id;
  const data = await db.getGame(id)
      .catch((err) => errorHandler(err, msg));

  if (!data) {
    msg.channel.send('No active game. Type **!start** to start one.');
  } else {
    let rule = rules[data.cards[0].name];
    const attachment = new MessageAttachment(process.env.IMAGE_LOCATION + data.cards[0].fileName);
    if (data.cards[0].name == 'K') data.kings -= 1;
    if (data.cards[0].name == 'K' && data.kings == 0) rule = '**LAST KING** You must finish your drink!';

    msg.channel.send(rule, attachment);

    data.cards.shift();

    if (data.cards.length == 0) {
      setTimeout(() => msg.channel.send('Game over, hope you are feeling tipsy 😜. Type **!start** to start a new game.'), 1000);
      await db.del(id);
    } else {
      await db.setGame(id, data)
          .catch((err) => errorHandler(err, msg));
    }
  }
};

exports.stop = async (msg) => {
  const id = msg.channel.id;
  const data = await db.getGame(id)
      .catch((err) => errorHandler(err, msg));

  if (!data) {
    msg.channel.send('No active game');
  } else {
    await db.del(id);
    msg.channel.send('You have stopped the game');
  }
};

exports.cardCount = async (msg) => {
  const id = msg.channel.id;
  const data = await db.getGame(id)
      .catch((err) => errorHandler(err, msg));

  if (!data) {
    msg.channel.send('No active game. Type **!start** to start one.');
  } else {
    msg.channel.send(`There are ${data.cards.length} cards left`);
  }
};

exports.credits = (msg) => {
  msg.channel.send('This bot was created by @kayleigh_foot and @louishudd').then((m) => m.react('👏'));
};

exports.activeGames = async (msg) => {
  const admins = process.env.ADMINS.split(',');
  const user = `${msg.author.username}#${msg.author.discriminator}`;

  if (admins.includes(user)) {
    const res = await db.getAll();
    let message = '';

    res.forEach((g) => {
      if (g.guild) {
        message += `**Server Name:** ${g.guild.name}, **Location:** ${g.guild.region}, **Card Count:** ${g.cards.length}\n\n`;
      }
    });
    msg.channel.send(res.length + ' active games\n' + message);
  }
};

exports.listRules = (msg) => {
  let message = '';
  const rulesList = Object.values(rules);

  rulesList.forEach((rule) => message += rule + '\n\n');
  msg.channel.send(message);
};

exports.listCommands = (msg) => {
  const embed = new MessageEmbed()
      .setColor('#eb4034')
      .setTitle('Help')
      .setDescription(commandList);

  msg.channel.send(embed);
};

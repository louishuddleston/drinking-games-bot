const db = require('../../db');
const { MessageEmbed } = require('discord.js');
const errorHandler = require('../../errorHandler');
const availableQuestions = require('./questions');
const shuffleArray = require('../../utils/shuffleArray');

const totalAnswers = async (msg, id, final) => {
  const game = await db.getGame(id);
  const index = game.questions.findIndex((q) => q.current == true);
  const ranking = {};
  let totalVotes = 0;

  if (final) {
    for (const question of game.questions) {
      for (const answer of question.answers) {
        totalVotes += 1;
        if (ranking[answer]) ranking[answer] += 1;
        else ranking[answer] = 1;
      }
    }
  } else {
    totalVotes = game.questions[index].answers.length;

    game.questions[index].answers.forEach((answer) => {
      if (ranking[answer]) ranking[answer] += 1;
      else ranking[answer] = 1;
    });
  }

  let message = '';
  const highestVoted = {
    username: '',
    votes: 0,
  };

  Object.keys(ranking).forEach((userID) => {
    if (highestVoted.votes < ranking[userID]) {
      highestVoted.username = userID;
      highestVoted.votes = ranking[userID];
    }
    const filled = '▓';
    const unfilled = '░';
    const percent = Math.round((ranking[userID] / totalVotes) * 100);
    const toFill = Math.round(percent / 10);
    console.log({ toFill });
    message += `<@!${userID}>: ${ranking[userID]} ${ranking[userID] > 1 ? 'votes' : 'vote' }\n ${filled.repeat(toFill)}${unfilled.repeat(10 - toFill)} ${percent}%\n`;
  });

  message = `<@!${highestVoted.username}> must drink\n\n` + message;

  if (message == '') message = 'no votes counted';

  const embed = new MessageEmbed()
      .setColor('#a8325c')
      .setTitle(`${final ? 'Final ' : ''}Results`)
      .setDescription(message);

  msg.channel.send(embed);

  if (typeof game.questions[index + 1] == 'undefined' && !final) {
    setTimeout(() => {
      totalAnswers(msg, id, true);
      db.del(id);
    }, 2000);
  } else if (typeof game.questions[index + 1] != 'undefined') {
    game.questions[index].current = false;
    game.questions[index + 1].current = true;

    await db.setGame(id, game)
        .catch((err) => errorHandler(err));

    sendQuestion(msg, game, id);
  }
};

const sendQuestion = (msg, game, id) => {
  const index = game.questions.findIndex((q) => q.current == true);

  const embed = new MessageEmbed()
      .setColor('#a8325c')
      .setTitle(`Who is most likely to ${game.questions[index].question}?`)
      .setDescription(`You have ${game.questionSeconds} seconds to tag the person below`);

  msg.channel.send(embed);

  setTimeout(() => {
    totalAnswers(msg, id);
  }, game.questionSeconds * 1000);
};

exports.start = async (msg) => {
  const id = msg.channel.id;
  const questionAmount =
    typeof parseInt(msg.content[2]) != 'undefined' &&
    parseInt(msg.content[2]) < 100 ? parseInt(msg.content[2]) : 12;
  const questionSeconds =
    typeof parseInt(msg.content[3]) != 'undefined' &&
    parseInt(msg.content[3]) < 100 ? parseInt(msg.content[3]) : 30;

  let questions = shuffleArray(availableQuestions).slice(0, questionAmount);
  questions = questions.map((q, i) => {
    console.log(i);
    const question = {
      question: q,
      answers: [],
      current: i == 0 ? true : false,
    };
    return question;
  });
  const game = {
    type: 'mlt',
    questions,
    questionSeconds,
  };
  if (msg.channel.guild) {
    game.guild = {
      id: msg.channel.guild.id,
      name: msg.channel.guild.name,
      region: msg.channel.guild.region,
    };
  }

  await db.setGame(id, game)
      .catch((err) => errorHandler(err));

  msg.channel.send('Who\'s most likely to has started, Get Ready!');

  setTimeout(() => sendQuestion(msg, game, id), 2000);
};

exports.addVote = async (msg, game) => {
  const id = msg.channel.id;
  const userID = msg.mentions.users.first().id;
  const index = game.questions.findIndex((q) => q.current == true);
  game.questions[index].answers.push(userID);
  await db.setGame(id, game);
};

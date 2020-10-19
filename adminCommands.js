exports.listServers = (msg, client) => {
  const servers = client.guilds.cache.array();
  let message = `**${servers.length}** Servers\n\n`;

  msg.channel.send(message);
};

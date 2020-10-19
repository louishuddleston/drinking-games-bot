module.exports = (err, msg) => {
  console.error(err);
  if (msg) msg.channel.send(`Internal server error.\nIf the error persists please go to: ${process.env.SUPPORT_SERVER_LINK} for support`);
};

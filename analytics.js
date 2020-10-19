const axios = require('axios');
const errorHandler = require('./errorHandler');

exports.addEvent = async (action, msg) => {
  if (process.env.GOOGLE_TRACKING_ID && process.env.GOOGLE_TRACKING_ID != "" ) {
    const cid = msg.channel.id;
    const tid = process.env.GOOGLE_TRACKING_ID;
    const url = `https://www.google-analytics.com/collect?v=1&t=event&tid=${tid}&ec=command&ea=${action}&cid=${cid}`;

    await axios.get(url)
        .catch((err) => errorHandler(err));
  }
};

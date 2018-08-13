'use strict';

const { RTMClient } = require('@slack/client');

let rtm = null;
let nlp = null;

// // An access token (from your Slack app or custom integration - usually xoxb)
// const token = process.env.SLACK_TOKEN;

const handleOnAuthenticated = (rtmStartData) =>
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);

const sendMessage = (message, channel) =>
  rtm.sendMessage(message, channel)
    .then((res) => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res);
    })
    .catch(console.error);

const handleOnMessage = (message) => {
  if (message.text.toLowerCase().includes('iris')) {
    nlp.ask(message.text, (err, res) => {
      if (err)
        return console.log(err);

      try {
        if (!res.intent || !res.intent[0] || !res.intent[0].value)
          throw new Error('Could not extract intent');

        const intent = require(`./intents/${res.intent[0].value}-intent`);

        intent.process(res, (err, res) => {
          if (err)
            return console.log(err.message);

          return rtm.sendMessage(res, message.channel);
        });
      } catch (err) {
        console.log(err);
        console.log(res);
        sendMessage('Sorry, I don\'t know what you are talking about.', message.channel);
      }

      // if (!res.intent)
      //   return sendMessage('Sorry, I don\'t know what you are talking about.', message.channel);
      // else if (res.intent[0].value === 'time' && res.location)
      //   return sendMessage(`I don't yet know the time in ${res.location[0].value}`, message.channel);

      // console.log(res);
      // return sendMessage('Sorry, I did not understand.', message.channel)
    });
  }
};

const addAuthenticatedHandler = (rtm, handler) => {
  rtm.on('authenticated', handler);
};

module.exports.init = (token, logLevel, nlpClient) => {
  // The client is initialized and then started to get an active connection to the platform
  rtm = new RTMClient(token, { logLevel });
  nlp = nlpClient;
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  rtm.on('message', handleOnMessage);
  rtm.start()
  return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
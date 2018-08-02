'use strict';

const service = require('../server/service');
const slackClient = require('../server/slack-client');

const witToken = 'KSCVLE743IOMTDBDLY2JGTKL5BQM7HWD';
const witClient = require('../server/wit-client')(witToken);


const slackToken = 'xoxb-409005773490-410334688630-96HQM6mR9UjbI14j49KVFQlS';
const slackLogLevel = 'info';

const slackRtm = slackClient.init(slackToken, slackLogLevel, witClient);

slackClient.addAuthenticatedHandler(slackRtm, () => {
  const server = service.listen(3000, () =>
    console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')}`));
});
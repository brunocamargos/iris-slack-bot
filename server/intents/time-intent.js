'use strict';

module.exports.process = (intentData, cb) => {
  const intent = intentData.intent[0].value;

  if (intent !== 'time')
    return cb(new Erro(`Expected time intent, got ${intent}`));

  if (!intentData.location)
    return cb(new Error('Missing location in time intent'));

  return cb(false, `I don't yet know the time in ${intentData.location[0].value}`);
  
}
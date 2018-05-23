const packageInfo = require('../package.json');
const transformer = require('./mail-transformer');
const fs = require('fs');

module.exports = (options) => {
  if(!options.file) {
    throw new Error('mbox transport options must contain a `file` property!');
  }

  const done = (error, mailData, callback) => {
    fs.appendFile(options.file, transformer(mailData), callback);
  };

  return {
    name: 'mbox',
    version: packageInfo.version,
    send(mail, callback) {
        const chunks = [];
        const stream = mail.message.createReadStream();
        const messageId = (mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
        let chunklen = 0;

        stream.on('readable', () => {
            let chunk;
            while ((chunk = stream.read()) !== null) {
                chunks.push(chunk);
                chunklen += chunk.length;
            }
          });

          stream.once('error', err => {
              console.error(
                  {
                      err,
                      tnx: 'send',
                      messageId
                  },
                  'Failed creating message for %s. %s',
                  1,
                  err.message
              );
              return done(err, callback);
          });

          stream.on('end', () =>
              done(null, {
                  mail,
                  envelope: mail.data.envelope || mail.message.getEnvelope(),
                  messageId: messageId,
                  message: Buffer.concat(chunks, chunklen)
              }, callback)
          );
    }
  }
};

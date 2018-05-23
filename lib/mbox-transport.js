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
            let chunkLength = 0;

            stream.on('readable', () => {
                let chunk;
                while ((chunk = stream.read()) !== null) {
                    chunks.push(chunk);
                    chunkLength += chunk.length;
                }
            });

            stream.once('error', err => {
                /* eslint no-console: "off" */
                console.error(err, `Failed to send message "${messageId}"`);
                return done(err, callback);
            });

            stream.on('end', () => {
                const payload = {
                    mail,
                    envelope: mail.data.envelope || mail.message.getEnvelope(),
                    messageId: messageId,
                    message: Buffer.concat(chunks, chunkLength)
                };

                done(null, payload, callback);
            });
        },
    };
};

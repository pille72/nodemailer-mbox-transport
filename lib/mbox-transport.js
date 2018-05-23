const packageInfo = require('../package.json');
const transformer = require('./mail-transformer');
const fs = require('fs');

module.exports = (options) => {
    if(!options.file) {
        throw new Error('mbox transport options must contain a `file` property!');
    }

    return {
        name: 'mbox',
        version: packageInfo.version,
        send(mail, callback) {
            const messageId = (mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
            const mailData = {
                mail,
                envelope: mail.data.envelope || mail.message.getEnvelope(),
                messageId: messageId
            };

            fs.appendFile(options.file, transformer(mailData), callback);
        },
    };
};

const nodemailer = require('nodemailer');
const mboxFileName = __dirname + '/test.mbox';
const transport = require('../lib/mbox-transport.js')({file: mboxFileName});
const transporter = nodemailer.createTransport(transport);
const mailParser = require('mailparser').simpleParser;
const Mbox = require('node-mbox');
const test = require('tape');

const removeTestMboxFile = () => {
  const fs = require('fs');
  fs.unlinkSync(mboxFileName);
};

test('put an email to mbox, mail is parsable', async (t) => {
    try {
      transporter.sendMail({
          from: 'from@example.com',
          to: 'to@example.com',
          subject: 'test',
          html: '<p style="color: red; text-decoration: underline;">test</p>'
      }, (err) => {
          t.equals(err, null, 'no error occured');
          const mbox = new Mbox(mboxFileName);
          let messages = 0;
          mbox.on('message', (msg) => {
            messages++;
            t.equals(messages, 1, 'one message was parsed');
            const parsedMail = mailParser(msg, (err, mail) => {
              if(err) {
                t.fail('mail could not be parsed');
              }

              t.equals(mail.subject, 'test', 'subject was parsed');
              t.equals(mail.from.text, 'from@example.com', 'from was parsed');
              t.equals(mail.to.text, 'to@example.com', 'to was parsed');
            });
          });

          mbox.on('error', (err) => {
            t.fail(err);
          });

          mbox.on('end', () => {
            t.equals(messages, 1, 'one message was parsed');
            removeTestMboxFile();
          });
      });

    }
    catch(e) {
        t.fail(e.reason);
    }

    t.end();
});

test('file option must be set for transport to work', async (t) => {
    try {
      const transport = require('../lib/mbox-transport.js')({});
      t.fail('Should have thrown an error');
    }
    catch(e) {
      t.equals(e instanceof Error, true, 'error has been thrown');
    }

    t.end();
});

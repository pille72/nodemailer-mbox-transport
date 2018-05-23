module.exports = (data) => {
  const mail = data.mail;
  const id = (mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
  const lines = [];
  const encoding = mail.message.textEncoding || 'utf-8';
  let contentType = mail.message.contentType;
  let content = mail.data.text;
  if(mail.data.html && mail.data.html !== '') {
    content = mail.data.html;
    contentType = 'text/html';
  }

  lines.push(
    `From ${mail.data.from}`
  );

  lines.push(
    `Message-ID: ${id}`
  );

  lines.push(
    `Date: ${mail.message.date}`
  );

  lines.push(
    `Subject: ${mail.data.subject}`
  );

  lines.push(
    `From: ${mail.data.from}`
  );

  lines.push(
    `To: ${mail.data.to}`
  );

  lines.push(
    'MIME-Version: 1.0'
  );

  lines.push(
    `Content-Type: ${contentType}; charset=${encoding}`
  );

  lines.push(
    'Content-Transfer-Encoding: quoted-printable'
  );

  lines.push(
    'X-Mailer: nodemailer'
  );

  lines.push(
    '\n'
  );

  lines.push(
    `${content}`
  );

  return  `${lines.join('\n')} \n\n`;
};

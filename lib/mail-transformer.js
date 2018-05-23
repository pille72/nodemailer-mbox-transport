module.exports = (data) => {
    const mail = data.mail;
    const id = (mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
    const encoding = mail.message.textEncoding || 'utf-8';
    let contentType = mail.message.contentType;
    let content = mail.data.text;
    if(mail.data.html && mail.data.html !== '') {
        content = mail.data.html;
        contentType = 'text/html';
    }

    return [
        `From ${mail.data.from}`,
        `Message-ID: ${id}`,
        `Date: ${mail.message.date}`,
        `Subject: ${mail.data.subject}`,
        `From: ${mail.data.from}`,
        `To: ${mail.data.to}`,
        'MIME-Version: 1.0',
        `Content-Type: ${contentType}; charset=${encoding}`,
        'Content-Transfer-Encoding: quoted-printable',
        'X-Mailer: nodemailer',
        '\n',
        `${content}`
    ].join('\n') + ' \n\n';
};

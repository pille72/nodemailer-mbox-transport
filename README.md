# nodemailer mbox transport

simple transporter for [nodemailer](https://nodemailer.com/about/) which saves email in mbox format.

## Usage

```javascript
const nodemailer = require('nodemailer');
const options = { file: 'path/to/my/mbox/file' };
const transport = require('nodemailer-mbox-transport')(options);
const transporter = nodemailer.createTransport(transport);
transporter.sendMail({...});
```

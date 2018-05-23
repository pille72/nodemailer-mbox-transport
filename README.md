# nodemailer mbox transport

## Usage

```javascript
const transport = require('nodemailer-mbox-transport')({file: 'path/to/my/mbox/file'});
const transporter = nodemailer.createTransport(transport);
transporter.sendMail({...});
```

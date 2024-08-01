const express = require('express');
const router = express.Router();

router.post('/send', async function(req, res, next) {

    let priority = req.body.priority;
    let subject = req.body.subject;
    let content = req.body.content;

    let mailConfiguration = {
        priority,
        subject,
        content,
        smtpServer: process.env.SMTP_SERVER,
        smtpPort: process.env.SMTP_PORT,
        smtpLogin: process.env.SMTP_LOGIN,
        smtpPass: process.env.SMTP_PASS,
    }

    const result = await mailService.SendMail(mailConfiguration);

    let response = {
        status: result.status
    }

    // Debug variable switch only manually switch in code otherwise dead code, to retreive mail configuration to fix BUG-0129.
    if(false == priority && priority !== 0)  {
        response.mailConfiguration = mailConfiguration;
    }

    res.send(response);
});

module.exports = router;

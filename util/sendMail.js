const sgMail = require('@sendgrid/mail');
const logger = require('./logger');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function (to, subject, content) {

    const msg = {
        to: to,
        from: 'test@example.com',
        subject: subject,
        text: content
    };

    let status = 'FAILED';
    await sgMail.send(msg).then(() => {
        console.log('email sent')
        status = 'SENT';
    })
        .catch(error => {

            //Log friendly error
            console.error(error.toString());

            //Extract error msg
            const {message, code, response} = error;

            //Extract response msg
            if (response) {
                const {headers, body} = response;
            }

        });
    logger.log({
        level: 'info',
        message: `mail to ${to} ${status}`
    });
    return status;
};
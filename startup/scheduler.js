const sendMail = require('../util/sendMail');
const logger = require('../util/logger');
let tempDate = new Date('Jan 01 2019 08:00:00 GMT+1100');
let localHour = tempDate.getHours();
let localMinute = tempDate.getMinutes();
const {Email} = require('../models/email');

let schedule = require('node-schedule');

let rule = new schedule.RecurrenceRule();
rule.hour = localHour;
rule.minute = localMinute;

module.exports = async function () {
  logger.log({
    level: 'info',
    message: `scheduling mails to send on  ${localHour}:${localMinute}`
  });

  schedule.scheduleJob(rule, async function () {
    const emails = await Email.find({status:'QUEUED'});
    for (const email of emails) {
      email.status = await sendMail(email.to,email.subject, email.content);
      email.save();
    }
  });
};

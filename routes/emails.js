const {Email, validate} = require('../models/email');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const sendMail = require('../util/sendMail');

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let email = new Email({
        to: req.body.to,
        subject: req.body.subject,
        content: req.body.content
    });

    let thisHour = new Date().getUTCHours();
    let thisMinute = new Date().getUTCMinutes();

    // obtaining the hours and minutes regardless the date
    let startHour = new Date('Jan 01 2019 08:00:00 GMT+1100').getUTCHours();
    let startMinute = new Date('Jan 01 2019 08:00:00 GMT+1100').getUTCMinutes();
    let endHour = new Date('Jan 01 2019 17:00:00 GMT+1100').getUTCHours();
    let endMinute = new Date('Jan 01 2019 17:00:00 GMT+1100').getUTCMinutes();

    if (
        (startHour > endHour && ((thisHour > startHour || thisHour < endHour) || (thisHour === startHour && thisMinute >= startMinute))) ||
        (thisHour > startHour && thisHour < endHour) ||
        (thisHour === endHour && thisMinute <= endMinute)
    ) {
        email.status = await sendMail(email.to, email.subject, email.content);
    } else {
        email.status = 'QUEUED';
    }
    email = await email.save();

    let responseData = {
        id: email._id,
        status: email.status
    };

    res.send(responseData);
});

router.delete('/:id', async (req, res) => {
    if(! mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Given ID is incorrect.');
    }
    const email = await Email.findByIdAndRemove(req.params.id);

    if (!email) return res.status(404).send('The email with the given ID was not found.');

    let responseData = {
        id: email._id,
        deleted: true
    };

    res.send(responseData);
});

router.get('/:id', async (req, res) => {
    if(! mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Given ID is incorrect.');
    }
    const email = await Email.findById(req.params.id);

    if (!email) return res.status(404).send('The email with the given ID was not found.');

    let responseData = {
        id: email._id,
        status: email.status
    };
    res.send(responseData);
});

module.exports = router; 
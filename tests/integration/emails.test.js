const request = require('supertest');
const {Email} = require('../../models/email');
const mongoose = require('mongoose');

let server;

describe('/v1/emails', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        await server.close();
        await Email.deleteMany({});
    });

    describe('POST /', () => {

        let email;

        const exec = async () => {
            return await request(server)
                .post('/v1/emails')
                .send(email);
        };

        beforeEach(() => {
            email = {to: 'r.thilina@gmail.com', subject: 'email subject', content: 'email content'};
        });

        it('should return 400 if email.to is less than 6 characters', async () => {
            email.to = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email.to is more than 150 characters', async () => {
            email.to = new Array(152).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email.content is less than 5 characters', async () => {
            email.content = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email.content is more than 200 characters', async () => {
            email.content = new Array(202).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email.subject is less than 5 characters', async () => {
            email.subject = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email.subject is more than 100 characters', async () => {
            email.subject = new Array(102).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the email if it is valid', async () => {
            await exec();

            const email = await Email.findOne({to: 'r.thilina@gmail.com'});

            expect(email).not.toBeNull();
        });

        it('should return the email if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('status');
        });
    });

    describe('GET /:id', () => {

        it('should return a email if valid id is passed', async () => {
            let email = new Email({
                to: 'r.thilina@gmail.com',
                subject: 'email subject',
                content: 'email content',
                status: 'FAILED'
            });
            email = await email.save();
            const res = await request(server).get('/v1/emails/' + email._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('status');
        });

        it('should return 400 if invalid id is passed', async () => {
            const res = await request(server).get('/v1/emails/1');

            expect(res.status).toBe(400);
        });

        it('should return 404 if no email with the given id exists', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/v1/emails' + id);

            expect(res.status).toBe(404);
        });
    });


    describe('DELETE /:id', () => {
        let id;

        const exec = async () => {
            return await request(server)
                .delete('/v1/emails/' + id)
                .send();
        };

        it('should return 400 if id is invalid', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if no email with the given id was found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the email if input is valid', async () => {
            let email = new Email({
                to: 'r.thilina@gmail.com',
                subject: 'email subject',
                content: 'email content',
                status: 'FAILED'
            });
            email = await email.save();
            id = email._id;
            const res = await exec();

            const emailInDb = await Email.findById(id);

            expect(emailInDb).toBeNull();

            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('deleted', true);
        });

    });
});

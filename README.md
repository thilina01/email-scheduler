# Email scheduler

Email scheduling app to send emails only within given duration and schedule the emails to send on selected time 

### Build status
   * TravisCI:
     * [![Build Status](https://travis-ci.org//thilina01/email-scheduler.svg?branch=master)](https://travis-ci.org/thilina01/email-scheduler)
### Example Usage

Assume you need your clients to receive the emails sent by your organization only between 8:00 AM and 5:00 PM to make them convenience and any mail initiated after 5:00 PM will be scheduled to sent on 8:00 AM next day.

### Prerequisites

This app uses sendgrid as the email service provider. So, you need to cteare an account on [sendgrid](https://sendgrid.com/) and obtain the API Key


Then use following commands to set environment with the API Key
```
echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env
echo "sendgrid.env" >> .gitignore
source ./sendgrid.env
```
refer [official documentation](https://github.com/sendgrid/sendgrid-nodejs/tree/master/packages/mail) for more information 

### Installing

As this app is implemented using node.js, you have to first install node modules by using following command


```
npm install
```
## Running the tests

you can run the tests by executing following command

```
npm test
```

## Deployment

To deploy as a node application, just execute following command

```
node index.js
```
The API service will be available on port 2010 and following endpoints will be available

in the URLs, localhost has to be replaced with the IP or domain of your server

#### [POST] /v1/emails
```
curl -X POST \
  http://localhost:2010/v1/emails \
  -H 'Content-Type: application/json' \
  -d '{
	"to":"example@email.com",
	"subject": "email subject",
	"content": "email content"
  }'
```
the email posted to this end point will be dilivered imediately if the time is withing the allowed duration or else it will be secheduled to deliver on the next day

#### [GET] /v1/emails/:id
```
curl -X GET http://localhost:2010/v1/emails/5cbcbdf945f82d16cb2c805b 
```
this will return the status of the email identified by the given id

#### [DELETE] /v1/emails/:id
```
curl -X DELETE http://localhost:2010/v1/emails/5cbcbdf945f82d16cb2c805b 
```
this will delete the email identified by the given id

## Authors

* **Thilina Ranathunga** - [thilina01](https://github.com/thilina01)

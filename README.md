# America SCORES PACER Collection Backend
[![Build Status](https://travis-ci.org/AmericaSCORES-Boston/america-scores-backend.svg?branch=master)](https://travis-ci.org/AmericaSCORES-Boston/america-scores-backend)
[![Coverage Status](https://coveralls.io/repos/github/AmericaSCORES-Boston/america-scores-backend/badge.svg?branch=master)](https://coveralls.io/github/AmericaSCORES-Boston/america-scores-backend?branch=master)

The backend for the America SCORES data collection system.

### Getting Started
You will need [NodeJS](https://nodejs.org/en/download/) installed locally.

~~~~
> git clone https://github.com/CS4500-AmericaSCORES/america-scores-backend
> cd america-scores-backend/
> npm install
~~~~
You will need to be able to run a [MySQL Server](https://dev.mysql.com/downloads/) on your local machine if you want to be able to test things locally.

You will also need the Node production process manager [PM2](http://pm2.keymetrics.io/) in order to run the backend locally. You can install it using:
~~~~
> npm install pm2@latest -g
~~~~

## Helpful Tools
Consider installing a MySQL GUI like [MySQL Workbench](https://www.mysql.com/products/workbench/) if you're not comfortable running queries from the terminal. 

It can also be beneficial to install a GUI like [Postman](https://www.getpostman.com/) to verify API calls. You can similarly make the calls through [curl](https://curl.haxx.se/download.html) requests.

## Set Up
You will need MySQL up and running. For example:
~~~~
> mysqld_safe
~~~~
Then, you can connect to it in another terminal using:
~~~~
> mysql -u root -p -h localhost
~~~~
where `root` is whatever account name you have configured MySQL with.

Run the [dbcreate.sql](https://github.com/AmericaSCORES-Boston/america-scores-backend/blob/master/database/dbcreate.sql) file, which creates an `america_scores` database and the necessary tables. For example, if you're running MySQL inside the top level of the `america-scores-backend` directory:
~~~~
MySQL> source database/dbcreate.sql
~~~~
You can verify that the tables were created by then running:
~~~~
MySQL> use america_scores;
MySQL> show tables;
~~~~

Copy the [creds.sample.js](https://github.com/AmericaSCORES-Boston/america-scores-backend/blob/master/config/creds.sample.js) in the config directory to creds.js in the same folder. This will be gitignored.
~~~~
> cp config/creds.sample.js config/creds.js
~~~~
Edit the `creds.js` file with the credentials for connecting to your local MySQL instance in the development section.

You also need a `.env` file in the top level of `america-scores-backend` with an `AUTH0_MANAGEMENT_TOKEN` and `AUTH0_DOMAIN` if you want to run the tests. 

### Testing
If you just want to seed the database with demo data, you can go to the top level of the `america-scores-backend` and run:
~~~~
> npm run seed
~~~~
If you want to run the tests, you can run:
~~~~
> npm run test
~~~~
which will seed the data and then run the tests.

Before checking in any changes, please ensure that:
~~~~
> npm run test
> npm run eslint
~~~~
both pass.

### Running the Backend API Locally
From the top level of `america-scores-backend`:
~~~~
> npm run start
~~~~
runs a local instance of the backend app, listening for requests on port 8888.

You can see more information, including log file locations, for the app instance by running:
~~~~
> pm2 show amscores_backend
~~~~

You can now make requests via curl or a GUI like Postman.

To stop the backend instance, run:
~~~~
> npm run stop
~~~~

### Versioning
This project uses [semantic versioning](http://semver.org/).

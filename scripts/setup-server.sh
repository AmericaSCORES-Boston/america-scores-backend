#!/usr/bin/env bash
cd /amscores/backend
mv ../creds.js config/
mv ../.env .

npm install

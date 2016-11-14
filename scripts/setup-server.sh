#!/usr/bin/env bash
chown -R ubuntu /amscores

cd /amscores/backend
mv ../creds.js config/

npm install

#!/usr/bin/env bash
export HOME=/home/ubuntu

/usr/local/bin/pm2 start /amscores/backend/app.js -n amscores_backend

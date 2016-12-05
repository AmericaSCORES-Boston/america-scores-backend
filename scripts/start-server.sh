#!/usr/bin/env bash
printenv

/usr/local/bin/pm2 start /amscores/backend/app.js -n amscores_backend

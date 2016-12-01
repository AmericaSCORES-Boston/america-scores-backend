#!/usr/bin/env bash
cd /amscores/backend
/usr/local/bin/pm2 start app.js -n amscores_backend

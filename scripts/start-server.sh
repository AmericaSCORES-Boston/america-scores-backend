#!/usr/bin/env bash
cd /amscores/backend
pm2 start app.js -n amscores_backend

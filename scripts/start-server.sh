#!/usr/bin/env bash
export HOME=/home/ubuntu

pm2 start /amscores/backend/app.js -n amscores_backend

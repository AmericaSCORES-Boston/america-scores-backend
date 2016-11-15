#!/usr/bin/env bash
cd /amscores/backend
pm2 list | grep amscores_backend
npm start

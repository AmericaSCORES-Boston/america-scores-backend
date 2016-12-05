#!/usr/bin/env bash
if [[ ! -z $(/usr/local/bin/pm2 list | grep amscores_backend) ]]; then
  /usr/local/bin/pm2 delete amscores_backend
fi

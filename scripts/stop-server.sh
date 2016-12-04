#!/usr/bin/env bash
export HOME=/home/ubuntu

if [[ ! -z $(/usr/local/bin/pm2 list | grep amscores_backend) ]]; then
  /usr/local/bin/pm2 delete amscores_backend
fi

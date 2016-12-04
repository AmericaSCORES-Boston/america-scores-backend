#!/usr/bin/env bash
export HOME=/home/ubuntu

if [[ ! -z $(pm2 list | grep amscores_backend) ]]; then
  pm2 delete amscores_backend
fi

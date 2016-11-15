#!/usr/bin/env bash
if [[ ! -z $(pm2 list | grep amscores_backend) ]]; then
  pm2 delete amscores_backend
fi

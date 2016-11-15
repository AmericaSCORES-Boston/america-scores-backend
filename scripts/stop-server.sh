#!/usr/bin/env bash
FOO=$(pm2 list | grep amscores_backend)

echo "Here's FOO:"
echo $FOO

if [[ ! -z $FOO ]]; then
  pm2 delete amscores_backend
fi

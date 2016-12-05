#!/usr/bin/env bash
if [ -e /amscores/backend ]; then
  cd /amscores/backend

  mv config/creds.js .env ../
  rm -rf *
fi

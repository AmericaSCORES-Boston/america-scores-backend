#!/usr/bin/env bash
if [ -e /amscores/backend ]; then
  cd /amscores/backend

  if [ -f config/creds.js ]; then
      mv config/creds.js ../
  fi
  if [ -f .env ]; then
      mv .env ../
  fi
  rm -rf *
fi

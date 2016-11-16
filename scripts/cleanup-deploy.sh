#!/usr/bin/env bash
if [ -e /amscores/backend ]; then
  cd /amscores/backend

  mv config/creds.js ../
  rm -rf *
fi

#!/usr/bin/env bash
if [ -e /amscores/backend ]; then
  cd /amscores/backend
  npm stop

  mv config/creds.js ../
  rm -rf *
fi

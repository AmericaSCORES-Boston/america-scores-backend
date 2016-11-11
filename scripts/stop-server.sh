#!/usr/bin/env bash
if [ "$DEPLOYMENT_GROUP_NAME" == "Development" ]; then
  if [ -e /amscores/backend ]; then
    cd /amscores/backend
    npm stop

    shopt -s extglob
    rm -rf -- !(config)
    cd config
    rm -rf -- !(creds.js)
  fi
fi

#!/usr/bin/env bash
if [ "$DEPLOYMENT_GROUP_NAME" == "Development" ]; then
  if [ -e /amscores/backend ]; then
    cd /amscores/backend
    npm stop

    mv config/creds.js ../
    rm -rf *
  fi
fi

#!/usr/bin/env bash
if [ "$DEPLOYMENT_GROUP_NAME" == "Development" ]; then
  cd /amscores/backend
  mv ../creds.js config/

  npm install
fi

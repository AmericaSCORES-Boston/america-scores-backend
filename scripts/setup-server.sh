#!/usr/bin/env bash
if [ "$DEPLOYMENT_GROUP_NAME" == "Development" ]; then
  chown -R ubuntu /amscores

  cd /amscores/backend
  mv ../creds.js config/

  npm install
fi

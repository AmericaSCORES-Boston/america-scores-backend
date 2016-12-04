#!/usr/bin/env bash
if [ "$DEPLOYMENT_GROUP_NAME" == "Production" ]; then
  export NODE_ENV=production
else
  export NODE_ENV=development
fi

cd /amscores/backend
mv ../creds.js config/

npm install

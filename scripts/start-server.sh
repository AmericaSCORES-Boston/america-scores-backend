#!/usr/bin/env bash
if [ "$DEPLOYMENT_GROUP_NAME" == "Production" ]; then
  export NODE_ENV=production
else
  export NODE_ENV=development
fi

/usr/local/bin/pm2 start /amscores/backend/app.js -n amscores_backend

#!/usr/bin/env bash
if [ "$DEPLOYMENT_GROUP_NAME" == "Development" ]; then
  if [ -e /amscores/backend ]; then
    cd /amscores/backend
    npm stop
    rm -rf *
  fi
fi

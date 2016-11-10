#!/usr/bin/env bash
if [ "$DEPLOYMENT_GROUP_NAME" == "Development" ]; then
  if [ -e /amscores/dev ]; then
    cd /amscores/dev
    npm stop
    rm -rf *
  fi
fi

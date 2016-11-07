#!/usr/bin/env bash
source /home/ec2-user/.bash_profile

if [ "$DEPLOYMENT_GROUP_NAME" == "Development" ]; then
  if [ -e /home/ec2-user/amscores/dev ]; then
    rm -rf /home/ec2-user/amscores/dev/*
    cd /home/ec2-user/amscores/dev
    npm stop
  fi
fi

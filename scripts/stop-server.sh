source /home/ec2-user/.bash_profile

if [ "$DEPLOYMENT_GROUP_NAME" == "Development"] then
  if [ -e ~/amscores/dev ] then
    cd ~/amscores/dev
    npm stop
  fi
fi

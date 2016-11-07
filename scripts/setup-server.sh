source /home/ec2-user/.bash_profile

if [ "$DEPLOYMENT_GROUP_NAME" == "Development"] then
  cd ~/amscores/dev
  npm install
fi

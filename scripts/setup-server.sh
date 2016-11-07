source /home/ec2-user/.bash_profile

if [ "$DEPLOYMENT_GROUP_NAME" == "Development" ] then
  cd /home/ec2-user/amscores/dev
  npm install
fi

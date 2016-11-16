#!/usr/bin/env bash
export DEBIAN_FRONTEND="noninteractive"

## Add the MySQL repo to get MySQL 5.7
# wget http://dev.mysql.com/get/mysql-apt-config_0.6.0-1_all.deb
# debconf-set-selections <<< 'mysql-apt-config mysql-apt-config/enable-repo select mysql-5.7-dmr'
# dpkg -i mysql-apt-config_0.6.0-1_all.deb
# rm -f mysql-apt-config_0.6.0-1_all.deb

## Add the Node 6.x repo and run 'apt-get update'
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

## Install packages
apt-get install -y nodejs
apt-get install -y nginx
# apt-get install -y mysql-server

## Upgrade all packages
apt-get upgrade -y

## Install PM2
npm install pm2 -g

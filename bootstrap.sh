#!/usr/bin/env bash

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get update

apt-get install -y nodejs
apt-get install -y nginx

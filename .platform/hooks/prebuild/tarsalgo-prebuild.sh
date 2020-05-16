#!/usr/bin/env bash
echo tarsalgo-prebuild-hook-started
sudo yum -y install postgresql-devel
runuser -l webapp -c 'whoami && pwd && cd /var/app/staging/ && pwd && npm install'
echo tarsalgo-prebuild-hook-finihsed

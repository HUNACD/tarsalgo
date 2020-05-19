#!/usr/bin/env bash
echo tarsalgo-prebuild-hook-started
sudo yum -y install postgresql-devel
echo listing-staging-folder
ls -la /var/app/staging
runuser -l webapp -c "git submodule update --init --recursive"
runuser -l webapp -c 'whoami && pwd && cd /var/app/staging/ && pwd && npm install'
echo tarsalgo-prebuild-hook-finihsed

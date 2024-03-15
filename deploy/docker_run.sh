#!/usr/bin/env bash

docker build -t fba_ui ../ -f Dockerfile

docker run -d --name fba_ui --restart always \
  -p 80:80 -p 443:443 \
  -v fba_static:/www/fba_server/backend/app/static \
  --network fba_network \
  fba_ui nginx -g "daemon off;"

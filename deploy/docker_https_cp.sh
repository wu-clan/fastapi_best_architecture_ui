#!/usr/bin/env bash

docker cp your_ssl_pem_path fba_ui:custom_ssl_pem_path

docker cp your_ssl_key_path fba_ui:custom_ssl_key_path

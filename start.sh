#!/bin/bash

[[ ${FILE_SETTINGS__DRIVER_NAME} != "local" ]] || echo "WARNING!!!!! FILES ARE STORED ON DISK AND WILL BE REGULARLY REMOVED, THIS MEANS UPLOADS WILL DISAPEAR!!"

# Encryption keys and salts seem to have a requirement of 32 characters but Heroku doesn't
#   define how many characters a secret type generates. This normalises to 32 characters.
SQL_SETTINGS__AT_REST_ENCRYPT_KEY=$(printf "${SQL_SETTINGS__AT_REST_ENCRYPT_KEY}%.0s" {1..32} | cut -c -32)
FILE_SETTINGS__PUBLIC_LINK_SALT=$(printf "${FILE_SETTINGS__PUBLIC_LINK_SALT}%.0s" {1..32} | cut -c -32)
EMAIL_SETTINGS__INVITE_SALT=$(printf "${EMAIL_SETTINGS__INVITE_SALT}%.0s" {1..32} | cut -c -32)
EMAIL_SETTINGS__PASSWORD_RESET_SALT=$(printf "${EMAIL_SETTINGS__PASSWORD_RESET_SALT}%.0s" {1..32} | cut -c -32)

# default s3 stuff to empty if it's not configured
export FILE_SETTINGS__AMAZON_S3_ACCESS_KEY_ID=${FILE_SETTINGS__AMAZON_S3_ACCESS_KEY_ID:=""}
export FILE_SETTINGS__AMAZON_S3_SECRET_ACCESS_KEY=${FILE_SETTINGS__AMAZON_S3_SECRET_ACCESS_KEY:=""}
export FILE_SETTINGS__AMAZON_S3_BUCKET=${FILE_SETTINGS__AMAZON_S3_BUCKET:=""}

lib/envsubst < config/config-heroku-template.json > config/config-heroku.json

bin/platform -config=config/config-heroku.json

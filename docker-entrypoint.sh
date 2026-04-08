#!/bin/sh
set -e

export CORE_URL="${CORE_URL:-http://localhost:8080}"

envsubst '${CORE_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'

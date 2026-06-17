#!/bin/sh
set -e
set -x

rm -rf /usr/src/app/node_modules/.vite

if [ -d "/usr/src/app/electa-ui" ]; then
  cp -r /usr/src/app/electa-ui/. /usr/src/app/node_modules/@assemblyvoting/electa-ui/.
fi

if [ -d "/usr/src/app/js-client" ]; then
  cp -r /usr/src/app/js-client/. /usr/src/app/node_modules/@assemblyvoting/js-client/.
fi

if [ -d "/usr/src/app/types" ]; then
  cp -r /usr/src/app/types/. /usr/src/app/node_modules/@assemblyvoting/types/.
fi

exec "$@"

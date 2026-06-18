#!/bin/sh
set -e
set -x

# electa-ui is consumed live: its built dist is bind-mounted straight into
# node_modules (see overrides) and rebuilt by the ui-library service, so it needs no
# copy here.

rm -rf /usr/src/app/node_modules/.vite

if [ -d "/usr/src/app/js-client" ]; then
  cp -r /usr/src/app/js-client/. /usr/src/app/node_modules/@assemblyvoting/js-client/.
fi

if [ -d "/usr/src/app/types" ]; then
  cp -r /usr/src/app/types/. /usr/src/app/node_modules/@assemblyvoting/types/.
fi

exec "$@"

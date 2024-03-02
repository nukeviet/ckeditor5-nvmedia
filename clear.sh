#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
  TARGET="$(readlink "$SOURCE")"
  if [[ $TARGET == /* ]]; then
    SOURCE="$TARGET"
  else
    DIR="$(dirname "$SOURCE")"
    SOURCE="$DIR/$TARGET"
  fi
done
DIR="$(cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd)"
DIR_PATH=$PWD

find "$DIR_PATH/src" -name "*.js" -type f | xargs /bin/rm -f
find "$DIR_PATH/src" -name "*.js.map" -type f | xargs /bin/rm -f
find "$DIR_PATH/src" -name "*.d.ts" -type f | xargs /bin/rm -f

#!/bin/bash
set -euo pipefail

env

python --version

pip install requests

python -c 'import requests'

case $BUILD_SOURCEBRANCH in
    *master|*release*)
        ELECTRON_PUBLISH=always
        ;;
    *)
        ELECTRON_PUBLISH=never
        ;;
esac

if [[ $AGENT_OS == 'Windows_NT' ]]; then
    echo 'Windows'
    npm install --global --production windows-build-tools --vs2017
    npm install sqlite3 --build-from-source --runtime=node-webkit --target_arch=x64 --target=0.31.4 --msvs_version=2017
    npm install
    npm run compile
    NODE_ENV=production npx electron-builder --win --publish $ELECTRON_PUBLISH
elif [[ $AGENT_OS == 'Darwin' ]]; then
    echo 'Mac'
    npm install
    npm run compile
    NODE_ENV=production npx electron-builder --mac --publish $ELECTRON_PUBLISH
elif [[ $AGENT_OS == 'Linux' ]]; then
    echo 'Linux'
    npm install
    npm run compile
    NODE_ENV=production npx electron-builder --linux --publish $ELECTRON_PUBLISH
else
    echo 'unknown OS'
    exit 255
fi

if [[ $BUILD_REASON == 'PullRequest' ]]; then
    echo 'Pull Request'
else
    python scripts/post_build.py
    cat dist/*.sha256
fi

    npm install --quiet
    NODE_ENV=production npm run make-linux

#!/usr/bin/bash

PM2_CONFIG="ecosystem.config.js"
FRONT_FOLDER_NAME="front-end"

GIT_PATH="/home/sysguru/pharmcadd-form/repo"
GIT_PATH_FRONT="${GIT_PATH}/${FRONT_FOLDER_NAME}"

DIST_PATH="/home/sysguru/pharmcadd-form/dist"
DIST_PATH_FRONT="${DIST_PATH}/${FRONT_FOLDER_NAME}/"
DIST_FILES=".next public package.json package-lock.json .env.production ${PM2_CONFIG}"

# git pull
cd "$GIT_PATH" || exit
git pull

# front 폴더로 이동, build
cd "$GIT_PATH_FRONT" || exit
npm i
npm run build || exit

# 기존 파일 제거
cd "$DIST_PATH" || exit
rm -rf ./"$FRONT_FOLDER_NAME"
mkdir "$FRONT_FOLDER_NAME"

# build 파일 front(build) 폴더로 이동
cd "$GIT_PATH_FRONT" || exit
cp -r $DIST_FILES $DIST_PATH_FRONT || exit

# production 모드로 npm install, 실행
cd "$DIST_PATH_FRONT" || exit
npm install --production
pm2 startOrRestart "$PM2_CONFIG"

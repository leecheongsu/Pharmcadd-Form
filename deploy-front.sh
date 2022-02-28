#!/usr/bin/bash

GIT_PATH="/home/sysguru/pharmcadd-form/repo"
GIT_PATH_FRONT="${GIT_PATH}/front"

PM2_CONFIG="ecosystem.config.js"

BUILD_PATH="/home/sysguru/pharmcadd-form/build"
BUILD_PATH_FRONT="${BUILD_PATH}/front/"
BUILD_FILES=".next public package.json package-lock.json .env.production ${PM2_CONFIG}"

# git pull
cd "$GIT_PATH" || exit
git pull

# front 폴더로 이동, build
cd "$GIT_PATH_FRONT" || exit
npm i
npm run build || exit

# 기존 파일 제거
cd "$BUILD_PATH" || exit
rm -rf ./front
mkdir front

# build 파일 front(build) 폴더로 이동
cd "$GIT_PATH_FRONT" || exit
cp -r $BUILD_FILES $BUILD_PATH_FRONT || exit

# production 모드로 npm install, 실행
cd "$BUILD_PATH_FRONT" || exit
npm install --production
pm2 startOrRestart "$PM2_CONFIG"

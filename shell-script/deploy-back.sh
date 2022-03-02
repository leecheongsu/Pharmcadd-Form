#!/usr/bin/bash

BACK_FOLDER_NAME="back-end"

GIT_PATH="/home/sysguru/pharmcadd-form/repo"
GIT_PATH_BACK="${GIT_PATH}/${BACK_FOLDER_NAME}"

DIST_PATH="/home/sysguru/pharmcadd-form/dist"
DIST_PATH_BACK="${DIST_PATH}/${BACK_FOLDER_NAME}/"

DB_HOST="10.219.35.18"
BUILD_FILE="pharmcadd-form-1.0-SNAPSHOT.jar"

# git pull
cd "$GIT_PATH" || exit
git pull

# 폴더로 이동, build
cd "$GIT_PATH_BACK" || exit
./gradlew -DJDBC_HOST="$DB_HOST" clean flywayMigrate generateJooq bootJar || exit

# jar 파일 dist 폴더로 덮어쓰기
cp -f build/libs/"$BUILD_FILE" $DIST_PATH_BACK || exit

# 서비스 재실행
sudo systemctl restart pharmcadd-form

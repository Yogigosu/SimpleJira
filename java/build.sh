#!/bin/sh

cd ./simplejira-core || exit
./gradlew clean build publishToMavenLocal
cd ..


cd ./simplejira-tasks || exit
./gradlew clean build
cd ..

cd ./simplejira-users || exit
./gradlew clean build
cd ..

docker-compose down --rmi all --volumes --remove-orphans simplejira-users simplejira-tasks
docker-compose build
docker-compose up -d

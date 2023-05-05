#!/bin/bash
set -e -o pipefail

rm -rf netacea-cloudfront.zip ./dist ./node_modules

npm i
npx tsc
cp ./package.json ./dist/package.json

cd dist
npm i --production
rm *.js.map

zip -r ../netacea-cloudfront ./*

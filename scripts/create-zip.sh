#!/bin/bash
set -e -o pipefail

# Clean-up old assets
rm -rf netacea-cloudfront*.zip ./dist

npx tsc
cp ./package.json ./package-lock.json ./dist/

# Get the version of @netacea/cloudfront now installed and derive the bundle name
version=$(npm list --json | jq -r '.dependencies["@netacea/cloudfront"].version')
bundle_name="netacea-cloudfront-$version.zip"
echo -e "\nCreating release assets for @netacea/cloudfront@$version with name $bundle_name"

# Install just production dependencies in ./dist
cd dist
npm ci --production
rm *.js.map package-lock.json

# Create the zip file
zip -r ../$bundle_name ./*

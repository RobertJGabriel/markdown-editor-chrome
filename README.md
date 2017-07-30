# Teamwork.com Updates Chrome Extension

## About

Made this as I was board. Built a simple chrome extension using es6 and vue.js to load our whats new endpoint. If there's a new post, a user will be a rich notification.

## Setup

1. Install Node.js
2. `npm i -g gulp yarn mocha` and make sure they're in your PATH
3. `yarn install` (or npm i if you don't use yarn) to install dependencies

## Build
- `gulp` or `gulp compile` to compile, files will be in the build directory
- `gulp clean` to delete the build directory
- `gulp watch` to compile and then recompile if any changes are made to the codebase

## Test

- Go to chrome://extensions/ (Menu > Tools > Extensions)
- Check the box to enable Developer mode
- Click Load unpacked extension...
- Navigate to build directory
- Make sure to reload the extension and refresh the page you're testing on after any changes to the code

## Screenshot
![alt text]( https://lh3.googleusercontent.com/w3mIoRilNJFoMcxMiGRCHrNCsxoT41C-wY5x955WKtWOsEi5DmHMmvWp4YL9hs9cY_yj4foz0A=w640-h400-e365 "Logo Title Text 1")

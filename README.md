# Transcendence
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)


## Instructions:

If you not use rootless docker, either rename Makesudo as Makefile or call `make` with `-f Makesudo`.
### Rules:
- prod: build and lauch client and server on builded resources.
- dev: launch client and server without build using nest and vite. 
- check: format and lint back and check front.
- debug: launch back with debug flags.

### Setting:
rename .env_sample to .env and customize it to your needs and credentials.

## Back endpoints:
|Method|endpoint|description|account securised?|
|:---:|:---:|:---:|:---:|
|GET |/log/in       |the login using 42 api.|☑|
|GET |/log/inReturn |the 42 api callback.|☑|
|GET |/log/profile  |get connected user 42's datas.|☑|
|GET |/log/out      |log out user.|☑|
|GET |/all          |return all users publics datas.|☒|
|GET |/online       |return all online users's public datas.|☒|
|GET |/friends      |return users which are friends.|☑|
|GET |/invits       |return users which invited user to be friend.|☑|
|GET |/leader       |return the global leaderboard|☑|
|GET |/leader/:id   |return the user(id) place in leaderboard|☑|
|GET |/history      |return the matchs results sorted by date|☑|
|GET |/history/:id  |return the last user(id)'s results sorted by date|☑|
|POST|/avatar       |set a user() avatar with multipart post upload.|☑|
|GET |/avatar       |return the user() avatar|☒|
|GET |/user/:name   |return the user(name)|☒|
|POST|/invit/:id    |user() invit user(id) as friend.|☑|
|GET |/avatar/:id   |return the user(id)'s avatar|☒|
|GET |/:id          |return user(id) public datas|☒|
|POST|/:id          |update/create user(id)|☑|
|GET |/             |return user()' public datas|☑|
|POST|/             |update/create user()|☑|

## Dependencies:

### Front:
- [@svelte/vite-plugin-svelte](https://www.npmjs.com/package/@sveltejs/vite-plugin-svelte)
- [@tsconfig/svelte](https://www.npmjs.com/package/@tsconfig/svelte)
- [svelte](https://www.npmjs.com/package/svelte)
- [svelte-check](https://www.npmjs.com/package/svelte-check)
- [tslib](https://www.npmjs.com/package/tslib)
- [typescript](https://www.npmjs.com/package/typescript)
- [vite](https://www.npmjs.com/package/vite)

### Back:
- [@nestjs/cli](https://www.npmjs.com/package/@nestjs/cli)
- [@nestjs/common](https://www.npmjs.com/package/@nestjs/common)
- [@nestjs/core](https://www.npmjs.com/package/@nestjs/core)
- [@nestjs/platform-express](https://www.npmjs.com/package/@nestjs/platform-express)
- [@nestjs/platform-ws](https://www.npmjs.com/package/@nestjs/platform-ws)
- [@nestjs/schematics](https://www.npmjs.com/package/@nestjs/schematics)
- [@nestjs/testing](https://www.npmjs.com/package/@nestjs/testing)
- [@nestjs/websockets](https://www.npmjs.com/package/@nestjs/websockets)
- [@types/express](https://www.npmjs.com/package/@types/express)
- [@types/jest](https://www.npmjs.com/package/@types/jest)
- [@types/node](https://www.npmjs.com/package/@types/node)
- [@types/supertest](https://www.npmjs.com/package/@types/supertest)
- [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin)
- [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser)
- [eslint](https://www.npmjs.com/package/eslint)
- [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier)
- [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)
- [jest](https://www.npmjs.com/package/jest)
- [prettier](https://www.npmjs.com/package/prettier)
- [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
- [rimraf](https://www.npmjs.com/package/rimraf)
- [rxjs](https://www.npmjs.com/package/rxjs)
- [source-map-support](https://www.npmjs.com/package/source-map-support)
- [supertest](https://www.npmjs.com/package/supertest)
- [ts-jest](https://www.npmjs.com/package/ts-jest)
- [ts-loader](https://www.npmjs.com/package/ts-loader)
- [ts-node](https://www.npmjs.com/package/ts-node)
- [tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths)
- [typescript](https://www.npmjs.com/package/typescript)
- [ws](https://www.npmjs.com/package/ws)



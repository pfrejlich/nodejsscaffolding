## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Middlewares, Guards and Interceptors

Execution order in nestjs: >> Middlewares -> Guards -> Interceptors

## Installing TypeOrm CLI

```
npm install -g ts-node
```

add typeorm command under scripts section in pacakge.json
```
"scripts": {
    ...
    "typeorm": "cross-env NODE_ENV=development typeorm-ts-node-commonjs -d src/data-source.ts",
}
```

### Generating a migration
```
npm run typeorm:migration:generate migrations/folder/migration-name
```
## Installation

```bash
$ npm i
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
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

## Using the app

After running the app You should be able to go to http://localhost:3000/graphql in Your browser to open GQL sandbox.

Example of single `collectLog` execution:

```graphql
mutation CollectLog($data: JSONObject!, $options: CollctOptionsInput!) {
  collectLog(data: $data, options: $options)
}
```

Example of multiply `collectLog` executions:

```graphql
mutation CollectLog($data1: JSONObject!, $data2: JSONObject!, $data3: JSONObject!, $options: CollctOptionsInput!) {
  log1: collectLog(data: $data1, options: $options)
  log2: collectLog(data: $data2, options: $options)
  log3: collectLog(data: $data3, options: $options)
}
```

After collecting some logs, You should be able to see them in the `storage/[LOG_SEVERITY_LEVEL].log` file, where `[LOG_SEVERITY_LEVEL]` is the value that was provided in mutation.

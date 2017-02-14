# var-server

This module provides you with a simple server http server.
It can be used to write tests e.g. for worker processes in a cluster.

## In the worker process

```javascript
require('var-server')(8080).listen()
```

__Note:__ The server listens on `127.0.0.1`, so it is only accessible on the same computer.

## In the test file

```javascript
const s = require('var-server')(8080)

s.run('process.argv').then(argv => {
  console.log(argv) // the argv from the test process
})
```

The code in the .get() method gets executed with `eval()` in the worker process.

```javascript
const s = require('var-server')(8080)

s.run('process.cwd()').then(cwd => {
  console.log(cwd)
})
```

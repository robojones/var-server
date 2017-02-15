const http = require('http')
const CircularJSON = require('circular-json')

module.exports = function setup(port) {
  const me = {
    listen() {
      const server = me.server = http.createServer((req, res) => {
        if(req.method !== 'POST') {
          res.writeHead(404, {
            'Content-Type': 'text/plain'
          })
          res.end('404 Not Found\n')
        }
        const body = []
        req.on('data', data => {
          body.push(data)
        })
        req.on('end', () => {
          let code = body.join('')
          try {
            const value = global.eval(code)
            let string = ''
            if(value !== undefined) {
              string = CircularJSON.stringify(value)
            }
            res.end(string)
          } catch(err) {
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            })
            res.end('500 Error\n')
          }
        })
      })
      server.listen(port, '127.0.0.1')
      return me
    },
    run(code) {
      return new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: port,
          method: 'POST'
        }, res => {
          const body = []
          res.on('data', data => {
            body.push(data)
          })
          res.on('end', () => {
            if(res.statusCode === 200) {
              if(!body.join('')) {
                resolve()
                return
              }
              try {
                resolve(CircularJSON.parse(body.join('')))
              } catch(err) {
                reject(err)
              }
            } else {
              reject(new Error(body.join('')))
            }
          })
        })
        req.on('error', reject)
        req.end(code)
      })
    }
  }
  return me
}

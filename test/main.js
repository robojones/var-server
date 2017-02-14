const assert = require('assert')

describe('var-server', function () {
  const a = require('./../main')

  it('should export a function', function () {
    assert.strictEqual(typeof a, 'function')
  })

  describe('function', function () {

    it('should return an object', function () {
      assert.strictEqual(typeof a(8001), 'object')
    })

    describe('returned object', function () {
      before(function () {
        this.b = a(8081).listen()
      })

      it('should have a .listen method', function () {
        assert.strictEqual(typeof this.b.listen, 'function', '.listen() missing')
      })

      it('should have a .run method', function () {
        assert.strictEqual(typeof this.b.run, 'function', '.run() missing')
      })

      describe('usage', function () {
        it('should return undefined for hello (undefined)', function () {
          return this.b.run('hello').then(v => {
            assert.strictEqual(v, undefined)
          })
        })
        it('should return the home directory for process.env.HOME (string)', function () {
          return this.b.run('process.env.HOME').then(v => {
            assert.strictEqual(v, process.env.HOME)
          })
        })
        it('should return the argv for process.argv (object)', function () {
          return this.b.run('process.argv').then(v => {
            assert.deepEqual(v, process.argv)
          })
        })
        it('should return the cwd', function () {
          return this.b.run('process.cwd()').then(v => {
            assert.deepEqual(v, process.cwd())
          })
        })
      })
    })

  })
})

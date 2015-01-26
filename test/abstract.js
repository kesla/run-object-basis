var PassThrough = require('stream').PassThrough

  , test = require('tape')

module.exports = function (run) {

  test('empty object', function (t) {
    run({}, function (err, result) {
      t.deepEqual(result, {})
      t.end()
    })
  })

  test('object without callbacks', function (t) {
    var obj = { beep: 'boop' }

    run(obj, function (err, result) {
      t.deepEqual(result, { beep: 'boop' })
      t.end()
    })
  })

  test('object with simple callback', function (t) {
    var obj = {
          beep: function (done) {
            setTimeout(function () {
              done(null, 'boop')
            }, 1)
          }
        }

    run(obj, function (err, result) {
      t.deepEqual(result, { beep: 'boop' })
      t.end()
    })
  })

  test('object with nested object', function (t) {
    var obj = {
            beep: {
                boop: function (done) { done(null, 'bong' )}
            }
        }

    run(obj, function (err, result) {
      t.deepEqual(result, { beep: { boop: 'bong' } })
      t.end()
    })
  })

  test('array', function (t) {
    var obj = [ 'hello', function (done) { done(null, 'world!') } ]

    run(obj, function (err, result) {
      t.ok(Array.isArray(result))
      t.deepEqual(result, [ 'hello', 'world!' ])
      t.end()
    })
  })

  test('object with nested object & some values', function (t) {
    var obj = {
            beep: {
                boop: {
                    foo: function (done) { done(null, 'bar') }
                  , hello: [ 'world', function (done) { done(null, '!') } ]
                }
              , bong: 'king kong'
            }
          , hello: function (done) { done(null, 'world') }
        }

    run(obj, function (err, result) {
      t.deepEqual(
          result
        , {
              beep: {
                  boop: {
                      foo: 'bar'
                    , hello: [ 'world', '!' ]
                  }
                , bong: 'king kong'
              }
            , hello: 'world'
          }
      )
      t.end()
    })
  })

  test('object with nested streams', function (t) {
    var stream1 = new PassThrough()
      , stream2 = new PassThrough({ objectMode: true })

      , obj = {
            beep: {
                boop: {
                    foo: stream1
                }
              , bong: 'king kong'
            }
          , hello: stream2
        }

    stream1.write('h')
    stream1.write('i')
    stream1.end()

    stream2.write([ 1 ])
    stream2.write([ 2, 3 ])
    stream2.end()

    run(obj, function (err, result) {
      t.deepEqual(
          result
        , {
              beep: {
                  boop: {
                      foo: new Buffer('hi')
                  }
                , bong: 'king kong'
              }
            , hello: [ 1, 2, 3 ]
          }
      )
      t.end()
    })
  })

  test('run is always asynchronous', function (t) {
    var async = false

    run({}, function (err, result) {
      t.equal(async, true)
      t.end()
    })

    async = true
  })
}
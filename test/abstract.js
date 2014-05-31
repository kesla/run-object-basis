var test = require('tape')

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
}
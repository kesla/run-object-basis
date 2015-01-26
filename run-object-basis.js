var collect = require('collect-stream')
  , is = require('is-type')
  , isStream = require('is-stream')

module.exports = function (base) {
  var run = function (object, callback) {
        var result = is.array(object) ? [] : {}
          , tasks = []

          , put = function (key, done) {
              return function (err, value) {
                if (err) return done(err)
                result[key] = value
                done()
              }
            }

        Object.keys(object).forEach(function (key) {
          var value = object[key]

          if (isStream (value)) {
            tasks.push(function (done) {
              collect(value, put(key, done))
            })
          } else if (is.function (value))
            tasks.push(function (done) {
              value(put(key, done))
            })
          else if (is.object (value))
            tasks.push(function (done) {
              run(value, put(key, done))
            })
          else
            result[key] = object[key]
        })

        base(tasks, function (err) {
          callback(err, result)
        })
      }

  return run
}

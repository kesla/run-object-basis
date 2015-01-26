var collect = require('collect-stream')
  , is = require('is-type')
  , isStream = require('is-stream')

module.exports = function (base) {
  var run = function (object, callback) {
        var result = is.array(object) ? [] : {}
          , tasks = []

        Object.keys(object).forEach(function (key) {
          var value = object[key]

          if (isStream (value)) {
            tasks.push(function (done) {
              collect(value, function (err, value2) {
                if (err) return done(err)
                result[key] = value2
                done(null)
              })
            })
          } else if (is.function (value))
            tasks.push(function (done) {
              value(function (err, value2) {
                if (err) return done(err)
                result[key] = value2
                done(null)
              })
            })
          else if (is.object (value))
            tasks.push(function (done) {
              run(value, function (err, value2) {
                if (err) return done(err)
                result[key] = value2
                done(null)
              })
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

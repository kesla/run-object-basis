var isFunction = function (val) {
      return typeof(val) === 'function'
    }
  , isObj = function (val) {
      return typeof (val) === 'object' && val !== null
    }

module.exports = function (base) {
  var run = function (object, callback) {
        var result = Array.isArray(object) ? [] : {}
          , tasks = []

        Object.keys(object).forEach(function (key) {
          var value = object[key]

          if (isFunction (value))
            tasks.push(function (done) {
              value(function (err, value2) {
                if (err) return done(err)
                result[key] = value2
                done(null)
              })
            })
          else if (isObj (value))
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

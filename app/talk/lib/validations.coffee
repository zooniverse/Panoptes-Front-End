# tests: an array of objects with `check` and `error` keys
# check is a function that should be true of the input
# error is the message if check fails

module.exports =
  getErrors: (input, tests) ->
    tests.reduce (errors, validation) ->
      if not validation.check(input)
        return errors.concat validation.error
      errors
    , []

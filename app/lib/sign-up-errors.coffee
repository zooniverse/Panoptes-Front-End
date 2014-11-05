parser =
  parse: (response) ->
    response = response[0] if response instanceof Array
    message = response.message
    @parseErrorsIn message
  
  signupErrors:
    login:
      Taken: /taken/
      Blank: /blank/
    email:
      Taken: /taken/
      Invalid: /invalid/
      Blank: /blank/
    password:
      TooShort: /too short/
      Blank: /blank/
  
  includesError: (validations, pattern) ->
    return false unless validations instanceof Array
    return true for validation in validations when validation.toString().match pattern
    false
  
  parseErrorsIn: (message) ->
    errors = { }
    for key, validations of @signupErrors
      for error, pattern of validations when @includesError(message[key], pattern)
        errors["#{ key }#{ error }"] = true
    
    errors

module.exports = parser

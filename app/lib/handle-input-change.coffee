module.exports = (e) ->
  # Using this module is a little odd.
  # Ensure that it's called in the context of a JSON-API Model instance.
  unless typeof @update is 'function' and typeof @emit is 'function'
    throw new Error 'Bind the handleInputChange function to a json-api-client Model instance'

  valueProperty = switch e.target.type
    when 'checkbox' then 'checked'
    when 'file' then 'files'
    else 'value'

  value = e.target[valueProperty]

  if e.target.dataset.jsonValue
    value = JSON.parse value

  changes = {}
  changes[e.target.name] = value
  @update changes

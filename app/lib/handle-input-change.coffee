{Model} = require 'json-api-client'

module.exports = (e) ->
  unless this instanceof Model
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

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

  path = e.target.name.split '.'
  updatedProperty = path[0]

  targetObject = this
  until path.length is 1
    targetObject = targetObject[path.shift()]
  lastKey = path[0]

  targetObject[lastKey] = value

  @update updatedProperty

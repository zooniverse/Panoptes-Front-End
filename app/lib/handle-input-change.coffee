module.exports = (e) ->
  valueProperty = switch e.target.type
    when 'checkbox' then 'checked'
    when 'file' then 'files'
    else 'value'

  value = e.target[valueProperty]

  if e.target.type is 'number'
    value = parseFloat value
  else if e.target.dataset.jsonValue
    value = JSON.parse value

  path = e.target.name.split '.'
  rootKey = path[0]
  changes = {}
  changes[rootKey] = =>
    data = this
    until path.length is 1
      data = data[path.shift()]
    lastKey = path[0]
    data[lastKey] = e.target[valueProperty]
    @[rootKey]

  @update changes

  if e.target.dataset.deleteValue
    delete data[path[0]]
  else
    data[path[0]] = value

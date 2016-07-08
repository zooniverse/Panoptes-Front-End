# Format a number as comma separated
module.exports = (number) ->
  return unless number?
  number.toString().replace /(\d)(?=(\d{3})+(?!\d))/g, '$1,'

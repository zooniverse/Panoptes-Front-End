# resource-count.coffee

# takes in a resource name and a number
# and returns a string formatted "N Resource(s)"
# trims trailing 's' if number is 1

module.exports = (count, string) ->
  "#{count} #{if +count is 1 then string.replace(/[Ss]$/, '') else string}"

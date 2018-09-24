createDOMPurify = require('dompurify');

DOMPurify = createDOMPurify(window);

module.exports = (array) ->
  sanitizedArray = array.map (string) -> DOMPurify.sanitize(string)
  return sanitizedArray.filter (string) -> string != ''

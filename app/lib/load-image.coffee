module.exports = (src) ->
  new Promise (resolve, reject) ->
    img = document?.createElement 'img'
    img.onload = resolve?.bind null, img
    img.onerror = reject?.bind null, img
    img.src = src

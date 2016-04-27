getFile = require './get-file'
counterpart = require 'counterpart'

module.exports = (language, user = null) ->
  getFile('/translations/' + language + '.json').then (data) =>
    console.log 'TEST DATA: ', data
    counterpart.registerTranslations language, JSON.parse(data.response)
    counterpart.setLocale language

    if user
      user.update languages: [language]
      user.save()

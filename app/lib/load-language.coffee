getFile = require './get-file'
counterpart = require 'counterpart'

module.exports = (language) ->
  getFile('/translations/' + language + '.json').then (data) =>
    console.log 'TEST DATA: ', data
    counterpart.registerTranslations language, JSON.parse(data.response)

    counterpart.setLocale language
    @props.user.update languages: [language]
    @props.user.save()

getFile = require './get-file'
counterpart = require 'counterpart'



module.exports =
  load: (language) ->
    localStorageLanguage = localStorage.getItem 'preferred-language'
    defaultLanguage = 'en'
    language = language || localStorageLanguage || defaultLanguage
    getFile('/translations/' + language + '.json').then (data) =>
      counterpart.registerTranslations language, JSON.parse(data.response)
      counterpart.setLocale language

  switch: (language, user) ->
    @load(language).then =>
      localStorage.setItem 'preferred-language', language

      if user
        user.update languages: [language]
        user.save()

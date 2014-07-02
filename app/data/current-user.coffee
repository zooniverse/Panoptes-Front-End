class User
  constructor: (options) ->
    for property, value of options
      @[property] = value

  url: ->
    "/users/#{@id}"

  save: (keys...) ->
    if keys.length is 0
      console.log "PUT #{JSON.stringify this} to #{@url()}"
    else
      changes = {}
      for key in keys
        changes[key] = @[key]
      console.log "PATCH #{JSON.stringify changes} to #{@url()}"

module.exports = new User
  id: 'DEV_USER'
  email: 'dev-user@zooniverse.org'
  wants_betas: true
  can_survey: false

  avatar: '//placehold.it/64.png'
  real_name: 'Mr. Dev User'
  location: 'Dev City'
  public_email: 'dev-user+spam@zooniverse.org'
  personal_url: 'http://www.zooniverse.org/'
  twitter: 'zoonidev'
  pinterest: 'devdevdev'

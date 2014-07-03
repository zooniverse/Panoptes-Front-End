api = require './api'

class Store
  href: null
  data: null
  type: null

  constructor: (options) ->
    for property, value of options
      @[property] = value

    @href ?= -> '/'
    @data ?= {}

  add: (properties) ->
    @data[properties.id] = Object.create @type

    for property, value of properties
      @data[property] = value

  get: (params = {}) ->
    new Promise (resolve, reject) ->
      if users[params.id]?
        resolve users[params.id]
      else
        request.get @href params.id, params, (response) ->
          response.

  emit: (eventName, details) ->
    e = document.createEvent 'CustomEvent'
    e.initCustomEvent eventName, true, true, details
    dispatchEvent e

users = new Store
  currentID: ''

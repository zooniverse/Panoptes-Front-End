 # Polyfills for for PhantomJS:
Function::bind ?= require 'function-bind'
require('es6-promise').polyfill()
require '../public/object-assign-polyfill'

require './auth'
require './api'

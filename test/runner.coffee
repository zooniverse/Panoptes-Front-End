 # Polyfills for for PhantomJS:
Function::bind ?= require 'function-bind'
require('es6-promise').polyfill()

require './auth'
require './project-creation'

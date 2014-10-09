 # Polyfills for for PhantomJS:
Function::bind ?= require 'function-bind'
global.Promise ?= require('es6-promise').Promise

require './auth'
require './api'

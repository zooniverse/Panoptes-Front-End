 # Polyfills for for PhantomJS:
Function::bind ?= require 'function-bind'
require('es6-promise').polyfill()

if process.env.TEST?
  console.log "Only testing the \"#{process.env.TEST}\" module"
  require './' + process.env.TEST
else
  require './auth'
  require './project-creation'

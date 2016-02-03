auth = require 'panoptes-client/lib/auth'

subjectsSeenThisSession = []

auth.listen 'change', ->
  subjectsSeenThisSession.splice 0

module.exports =
  add: (workflow, subjects) ->
    for subject in subjects
      subjectsSeenThisSession.push "#{workflow.id}/#{subject.id}"

  check: (workflow, subject) ->
    "#{workflow.id}/#{subject.id}" in subjectsSeenThisSession

window?.subjectsSeenThisSession = subjectsSeenThisSession

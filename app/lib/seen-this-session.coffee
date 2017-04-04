auth = require 'panoptes-client/lib/auth'

subjectsSeenThisSession = []

auth.listen 'change', ->
  subjectsSeenThisSession.splice 0

module.exports =
  add: (workflow_id, subject_ids) ->
    for subject_id in subject_ids
      subjectsSeenThisSession.push "#{workflow_id}/#{subject_id}"

  check: (workflow, subject) ->
    "#{workflow.id}/#{subject.id}" in subjectsSeenThisSession

window?.subjectsSeenThisSession = subjectsSeenThisSession

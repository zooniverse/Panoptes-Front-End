config = require 'panoptes-client/lib/config'

module.exports = ->
  return unless fetch? # No biggie.

  commits = fetch 'https://api.github.com/repos/zooniverse/Panoptes/commits'
    .then (response) -> response.json()
    .then (commits) -> (sha for {sha} in commits)

  deployed = fetch "#{config.host}/commit_id.txt"
    .then (response) -> response.text()
    .then (commitID) -> commitID.trim()

  Promise.all([commits, deployed]).then ([commits, deployed]) ->
    index = commits.indexOf deployed
    switch index
      when -1 then console?.warn 'Weird: couldn’t find deployed commit in master.'
      when 0 then console?.log 'Deployed back end is up to date.'
      else console?.warn "Deployed back end is #{index} commits behind master."

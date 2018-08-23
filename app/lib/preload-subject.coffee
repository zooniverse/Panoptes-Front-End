getSubjectLocation = require './get-subject-location'
loadImage = require './load-image'

module.exports = (subject) ->
  Promise.all subject.locations.map (location, i) ->
    {type, src} = getSubjectLocation subject, i
    switch type
      when 'image'
        loadImage(src)
          .catch (error) ->
            console.error error
      else
        console.warn "Not sure how to load subject #{subject.id}'s location of type #{type} (#{src})" unless process.env.BABEL_ENV is 'test' 

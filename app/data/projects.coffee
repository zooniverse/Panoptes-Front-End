Store = require './store'
{dispatch} = require '../lib/dispatcher'

EXAMPLE_PROJECT =
  id: 'PROJECT_GZ'
  name: 'Galaxy Zoo'
  owner_name: 'Zooniverse'
  avatar: 'https://pbs.twimg.com/profile_images/2597266958/image.jpg'
  background_image: 'http://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-33a-07.jpg/1280px-ESO-VLT-Laser-phot-33a-07.jpg'
  description: 'Help further our understanding of galaxy formation.'
  introduction: new Array(5).join '''
    This is an _introduction_ with some **Markdown**.
    This paragraph has some <code>HTML</code> that should be escaped.
  ''' + '\n\n'
  science_case: '''
    Here's the science case for this project...
  '''
  team_members: []

  workflows:
    main:
      firstTask: 'shape'
      tasks:
        shape:
          type: 'radio'
          question: 'What shape is this galaxy?'
          answers: [
            {value: 'smooth', label: 'Smooth'}
            {value: 'features', label: 'Features'}
            {value: 'other', label: 'Star or artifact'}
          ]
          next: 'roundness'
        roundness:
          type: 'radio'
          question: 'How round is it?'
          answers: [
            {value: 'very', label: 'Very'}
            {value: 'sorta', label: 'In between'}
            {value: 'not', label: 'Cigar shaped'}
          ]
          next: null

module.exports = new Store
  root: '/projects'
  items : {}

  get: (owner, name) ->
    unless owner of @items and name of @items[owner]
      dispatch 'projects:get', owner, name
    @items[owner]?[name]

  fetch: (query) ->
    fetchItems = new Promise (resolve, reject) =>
      console?.info 'GET', @root, JSON.stringify query
      setTimeout resolve.bind(null, [EXAMPLE_PROJECT]), 1000

    fetchItems.then (items) =>
      for item in items
        @items[item.owner_name][item.name] = item
      @emitChange()

  'projects:get': (owner, name) ->
    unless owner of @items and name of @items[owner]
      @items[owner] ?= {}
      @items[owner][name] = null

      @fetch
        owner_name: owner
        name: name

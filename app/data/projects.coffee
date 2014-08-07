Store = require './store'

EXAMPLE_PROJECT =
  id: 'GPROJECT_GZ'
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
  projects: {}

  'project:get', (query) ->
    getProject = new Promise (resolve, reject) ->
      setTimeout resolve.bind(null, [EXAMPLE_PROJECT]), 1000

    getProject.then (projects) =>
      for project in projects
        @projects[project.id] = project
